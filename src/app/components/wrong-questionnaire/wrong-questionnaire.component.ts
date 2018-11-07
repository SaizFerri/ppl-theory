import { Component } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { WrongAnsweredQuestion } from 'src/app/interfaces/wrongAnsweredQuestion.interface';
import { Subject } from 'src/app/enum/subject.enum';
import { QuestionnaireState } from 'src/app/states/questionnaire.state';
import { QuestionsService } from 'src/app/services/questions.service';
import { map, withLatestFrom, filter, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-wrong-questionnaire',
  templateUrl: './wrong-questionnaire.component.html'
})
export class WrongQuestionnaireComponent {
  questions: Question[];
  actualQuestion: Question;
  subject: Subject;
  wrongAnsweredQuestions: WrongAnsweredQuestion[];
  isEmpty: boolean = true;
  hasError: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) { 
    route.params.pipe(
      switchMap(params => {
        this.subject = <Subject>Subject[params.subject.toUpperCase()];
        this.hasError = false;

        return this.store.select(QuestionnaireState.wrongAnsweredBySubject(this.subject))
          .pipe(
            filter(questions => questions.length > 0),
            withLatestFrom(this.store.select(QuestionnaireState.questionsBySubject(this.subject))),
            map(([wrongAnsweredQuestions, questions]) => {
              return wrongAnsweredQuestions.map(wrongQuestion => questions.find(question => wrongQuestion.questionId === question.id));
            }),
            tap(questions => {
              this.actualQuestion = questions.find(question => question.questionId === parseInt(params.id));
              if (!this.actualQuestion) {
                this.hasError = true;
              }
            })
          );
      })
    )
    .subscribe(questions => {
      this.questions = questions.sort((a, b) => a.questionId - b.questionId);
      this.isEmpty = this.questions.length === 0;
    });
  }

  navigateTo(question) {
    const questionToNavigate = this.questions.find(q => q.id === question.id);
    this.actualQuestion = questionToNavigate;
    this.router.navigateByUrl(`wrong/${this.subject}/${questionToNavigate.questionId}`);
  }

  next() {
    const index = this.questions.indexOf(this.actualQuestion);
    
    if (this.questions.length > 1) {
      if (this.questions[index+1]) {
        this.actualQuestion = this.questions[index+1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionId}`);
      } else {
        this.actualQuestion = this.questions[0];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionId}`);
      }
    }
  }

  prev() {
    const index = this.questions.indexOf(this.actualQuestion);
    
    if (this.questions.length > 1) {
      if (this.questions[index-1] && this.questions.length > 1) {
        this.actualQuestion = this.questions[index-1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionId}`);
      } else {
        this.actualQuestion = this.questions[this.questions.length-1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionId}`);
      }
    }
  }

}
