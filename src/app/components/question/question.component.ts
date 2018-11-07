import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { map, switchMap } from 'rxjs/operators';

import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';
import { QuestionnaireState } from 'src/app/states/questionnaire.state';
import { Subject } from 'src/app/enum/subject.enum';
import { AddAnsweredQuestionToFirebase } from 'src/app/actions/questionnaire.actions';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent {
  question: Question;
  answers: Answer[];
  selectedAnswer: Answer;
  correctAnswer: Answer;
  subject: Subject;
  buttonColor: string;
  isLoaded: boolean = false;
  isWrong: boolean = false;
  isCorrect: boolean = false;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    /**
     * Initializes component when route params are changed
     */
    route.params.pipe(
      switchMap(params => {
        this.selectedAnswer = null;
        this.isLoaded = false;
        this.subject = <Subject>Subject[params.subject.toUpperCase()];
        this.buttonColor = 'primary';
        this.isWrong = false;
        this.isCorrect = false;
        
        return this.store.select(QuestionnaireState.questionsBySubject(this.subject))
          .pipe(
            map(questions => questions.find(question => question.questionId === parseInt(params.id)))
          )
      })
    )
    .subscribe(question => {
      if (question) {
        this.question = question;
        this.answers = this.question.answers;
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

      /**
       * Checks if the question exists in the 'wrongAnsweredQuestions' state
       * and if not, and the questions was answered wrong, it will be added to 
       * firebase
       */
      this.store.select(QuestionnaireState.checkIfExistsInFirebase(this.question))
        .subscribe(question => {
          if (!question && this.isWrong) {
            this.store.dispatch(new AddAnsweredQuestionToFirebase(this.question));
          }
        });

    } else {
      return;
    }
  }

}
