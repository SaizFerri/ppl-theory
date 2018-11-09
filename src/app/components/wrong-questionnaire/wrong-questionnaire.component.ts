import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngxs/store';

import { Subject } from 'rxjs';
import { map, withLatestFrom, filter, tap, switchMap } from 'rxjs/operators';

import { QuestionnaireState } from '../../states/questionnaire.state';
import { Subject as QuestionSubjectect } from '../../enum/subject.enum';
import { Question } from '../../interfaces/question.interface';
import { WrongAnsweredQuestion } from '../../interfaces/wrongAnsweredQuestion.interface';
import { Answer } from '../../interfaces/answer.interface';

@Component({
  selector: 'app-wrong-questionnaire',
  templateUrl: './wrong-questionnaire.component.html'
})
export class WrongQuestionnaireComponent {
  question: Question;
  questions: Question[];
  subject: QuestionSubjectect;
  wrongAnsweredQuestions: WrongAnsweredQuestion[];
  selectedAnswer: Answer;
  correctAnswer: Subject<Answer> = new Subject<Answer>();
  isCorrect: Subject<boolean> = new Subject<boolean>();
  params: Params;

  isEmpty = true;
  hasError = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    route.params.pipe(
      switchMap(params => {
        this.params = params;
        this.subject = <QuestionSubjectect>QuestionSubjectect[params.subject.toUpperCase()];
        this.hasError = false;
        this.isCorrect.next(null);

        return this.store.select(QuestionnaireState.wrongAnsweredBySubject(this.subject))
          .pipe(
            filter(questions => questions.length > 0),
            withLatestFrom(this.store.select(QuestionnaireState.questionsBySubject(this.subject))),
            map(([wrongAnsweredQuestions, questions]) => {
              return wrongAnsweredQuestions.map(wrongQuestion => questions.find(question => wrongQuestion.questionId === question.id));
            }),
            tap(questions => {
              this.question = questions.find(question => question.questionId === parseInt(params.id, 10));
              if (!this.question) {
                this.hasError = true;
              }
            })
          );
      })
    )
    .subscribe(questions => {
      // Sort questions in menu in ascendent order
      this.questions = questions.sort((a, b) => a.questionId - b.questionId);

      if (!this.question && this.questions.length > 0) {
        this.router.navigateByUrl(`wrong/${this.subject}/${this.questions[0].questionId}`);
      }
      this.isEmpty = this.questions.length === 0;
    });
  }

  getAnswer(answer) {
    this.selectedAnswer = answer;
  }

  navigateTo(question) {
    const questionToNavigate = this.questions.find(q => q.id === question.id);
    this.question = questionToNavigate;
    this.router.navigateByUrl(`wrong/${this.subject}/${questionToNavigate.questionId}`);
  }

  check() {
    if (this.selectedAnswer) {
      const correctAnswer = this.question.answers.find(answer => answer.correct === true);
      let correct;

      if (correctAnswer.id !== this.selectedAnswer.id) {
        correct = false;
        this.isCorrect.next(false);
        this.correctAnswer.next(correctAnswer);
      } else if (correctAnswer.id === this.selectedAnswer.id) {
        correct = true;
        this.isCorrect.next(true);
      }
    } else {
      return;
    }
  }

  next() {
    const index = this.questions.indexOf(this.question);

    if (this.questions.length > 1) {
      if (this.questions[index + 1]) {
        this.navigateTo(this.questions[index + 1]);
      } else {
        this.navigateTo(this.questions[0]);
      }
    }
  }

  prev() {
    const index = this.questions.indexOf(this.question);

    if (this.questions.length > 1) {
      if (this.questions[index - 1] && this.questions.length > 1) {
        this.navigateTo(this.questions[index - 1]);
      } else {
        this.navigateTo(this.questions[this.questions.length - 1]);
      }
    }
  }

}
