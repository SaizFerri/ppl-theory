import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngxs/store';

import { switchMap, tap, filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { QuestionnaireState } from '@app/core/states/questionnaire.state';
import { AddAnsweredQuestionToFirebase } from '@app/core/actions/questionnaire.actions';

import { Subject as QuestionSubject } from '@app/core/enum/subject.enum';
import { Question } from '@app/core/interfaces/question.interface';
import { Answer } from '@app/core/interfaces/answer.interface';
import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  // Workaround for ngIf behaviour in mat-drawer
  @ViewChildren('drawer') menu: QueryList<MatDrawer>;

  question: Question;
  questions: Question[];
  subject: QuestionSubject;
  selectedAnswer: Answer;
  correctAnswer$: Subject<Answer> = new Subject<Answer>();
  isCorrect$: Subject<boolean> = new Subject<boolean>();
  state: Subscription;

  params: Params;
  isLoaded = false;
  isEmpty = false;
  hasError = false;

  dangerColor = '#D33534';
  colorWhite = '#FFFFFF';
  colorWhiteBackground = '#FAFAFA';

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    this.route.params.subscribe(params => this.params = params);
  }

  ngOnInit() {
    this.subject = <QuestionSubject>QuestionSubject[this.params.subject.toUpperCase()];
    this.hasError = false;
    this.isCorrect$.next(null);

    this.state = this.store.select(QuestionnaireState.questionsBySubject(this.subject))
      .pipe(
        filter(questions => {
          if (questions.length === 0) {
            this.isEmpty = true;
            this.isLoaded = true;
          }
          return questions.length > 0;
        }),
        tap(questions => {
          this.question = questions.find(question => question.questionId === parseInt(this.params.id, 10));

          if (!this.question) {
            this.hasError = true;
          }
        })
      )
      .subscribe(questions => {
        this.questions = questions;
        this.isEmpty = questions.length === 0;
        this.isLoaded = true;
      });
  }

  ngOnDestroy() {
    this.state.unsubscribe();
  }

  getAnswer(answer) {
    this.selectedAnswer = answer;
  }

  navigateTo(question) {
    this.question = question;
    this.isCorrect$.next(null);
    this.correctAnswer$.next(null);
    this.selectedAnswer = null;
    this.router.navigateByUrl(`questionnaire/${this.subject}/${question.questionId}`);
  }

  check() {
    if (this.selectedAnswer) {
      const correctAnswer = this.question.answers.find(answer => answer.correct === true);
      let correct;

      if (correctAnswer.id !== this.selectedAnswer.id) {
        correct = false;
        this.isCorrect$.next(false);
        this.correctAnswer$.next(correctAnswer);
      } else if (correctAnswer.id === this.selectedAnswer.id) {
        correct = true;
        this.isCorrect$.next(true);
      }

      /**
       * Checks if the question exists in the 'wrongAnsweredQuestions' state
       * and if not, and the questions was answered wrong, it will be added to
       * firebase
       */
      this.store.select(QuestionnaireState.checkIfExistsInFirebase(this.question))
        .subscribe(question => {
          if (!question && !correct) {
            this.store.dispatch(new AddAnsweredQuestionToFirebase(this.question));
          }
        });

    } else {
      return;
    }
  }

  next() {
    const questionId = parseInt(this.params.id, 10) + 1;
    const nextQuestion = this.questions.find(question => question.questionId === questionId);

    if (nextQuestion) {
      this.navigateTo(nextQuestion);
    } else {
      this.navigateTo(this.questions[0]);
    }
  }

  prev() {
    const questionId = parseInt(this.params.id, 10) - 1;
    const prevQuestion = this.questions.find(question => question.questionId === questionId);

    if (prevQuestion) {
      this.navigateTo(prevQuestion);
    } else {
      this.navigateTo(this.questions[this.questions.length - 1]);
    }
  }

}
