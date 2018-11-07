import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';
import { Subject } from '../../enum/subject.enum';
import { Store } from '@ngxs/store';
import { QuestionnaireState } from 'src/app/states/questionnaire.state';
import { map, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-wrong-question',
  templateUrl: './wrong-question.component.html'
})
export class WrongQuestionComponent {
  @Input() isEmpty: boolean;
  
  question: Question;
  subject: Subject;
  answers: Answer[];
  selectedAnswer: Answer;
  correctAnswer: Answer;
  buttonColor: string;
  isLoaded: boolean = false;
  isWrong: boolean = false;
  isCorrect: boolean = false;
  hasAsset: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    /**
     * Initialize component when route params are changed
     */
    route.params.pipe(
      switchMap(params => {
        this.subject = <Subject>Subject[params.subject.toUpperCase()];
        this.isLoaded = false;

        /**
         * Returns the observable with the mapped question
         * (from WrongAnsweredQuestion to Question)
         */
        return this.store.select(QuestionnaireState.wrongAnsweredBySubject(this.subject))
          .pipe(
            filter(questions => questions.length > 0),
            map(questions => questions.find(question => question.questionNumber === parseInt(params.id))),
            filter(Boolean),
            switchMap(question => this.store.select(QuestionnaireState.questionById(question.questionId)))
          )
      })
    )
    .subscribe(question => {
      this.buttonColor = 'primary';
      this.isWrong = false;
      this.isCorrect = false;
      this.selectedAnswer = null;

      if (question) {
        this.question = question;
        this.answers = this.question.answers;
        this.hasAsset = false;
        if (this.question.asset) {
          this.hasAsset = true;
        }
        this.isLoaded = true;
      }
    });
  }

  check() {
    if (this.selectedAnswer) {
      this.correctAnswer = this.answers.find(answer => answer.correct === true);

      if (this.correctAnswer.id !== this.selectedAnswer.id) {
        this.buttonColor = 'warn';
        this.selectedAnswer = this.correctAnswer;
        this.isCorrect = false;
        this.isWrong = true;
      } else if (this.correctAnswer.id === this.selectedAnswer.id) {
        this.buttonColor = 'primary';
        this.isWrong = false;
        this.isCorrect = true;
      }
    } else {
      return;
    }
  }
}
