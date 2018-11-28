import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngxs/store';

import { Subject, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom, filter, tap, switchMap } from 'rxjs/operators';

import { QuestionnaireState } from '@app/core/states/questionnaire.state';
import { Subject as QuestionSubjectect } from '@app/core/enum/subject.enum';
import { Question } from '@app/core/interfaces/question.interface';
import { WrongAnsweredQuestion } from '@app/core/interfaces/wrongAnsweredQuestion.interface';
import { Answer } from '@app/core/interfaces/answer.interface';
import { ViewChildren } from '@angular/core';
import { QueryList } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-wrong-questionnaire',
  templateUrl: './wrong-questionnaire.component.html'
})
export class WrongQuestionnaireComponent implements OnInit, OnDestroy {
  // Workaround for ngIf behaviour in mat-drawer
  @ViewChildren('drawer') menu: QueryList<MatDrawer>;

  question: Question;
  questions: Question[];
  subject: QuestionSubjectect;
  wrongAnsweredQuestions: WrongAnsweredQuestion[];
  selectedAnswer: Answer;
  correctAnswer$: Subject<Answer> = new Subject<Answer>();
  isCorrect$: Subject<boolean> = new Subject<boolean>();
  params: Params;
  state: Subscription;

  isLoaded = false;
  isEmpty = false;
  hasError = false;

  dangerColor = '#D33534';
  colorWhite = '#FFFFFF';
  colorWhiteBackground = '#FAFAFA';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
  ) {
    route.params.subscribe(params => this.params = params);
  }

  ngOnInit() {
    this.subject = <QuestionSubjectect>QuestionSubjectect[this.params.subject.toUpperCase()];
    this.hasError = false;
    this.isCorrect$.next(null);

    this.state = this.store.select(QuestionnaireState.wrongAnsweredBySubject(this.subject))
      .pipe(
        filter(questions => {
          const full = questions.length > 0;
          if (!full) {
            this.isEmpty = true;
            this.isLoaded = true;
          }
          return full;
        }),
        withLatestFrom(this.store.select(QuestionnaireState.questionsBySubject(this.subject))),
        map(([wrongAnsweredQuestions, questions]) => {
          return wrongAnsweredQuestions.map(wrongQuestion => questions.find(question => wrongQuestion.questionId === question.id));
        })
      )
      .subscribe(questions => {
        // Eliminate doble questions from the Array
        const cleanQuestions = new Set();
        questions.filter(question => {
          return cleanQuestions.has(question.id) ? false : cleanQuestions.add(question);
        });
        questions = Array.from(cleanQuestions);
        // Sort questions in menu in ascendent order
        this.questions = questions.sort((a, b) => a.questionId - b.questionId);

        if (this.questions.length > 0) {
          this.isEmpty = false;
          this.navigateTo(this.questions[0]);
        }
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
    const questionToNavigate = this.questions.find(q => q.id === question.id);
    this.question = questionToNavigate;
    this.isCorrect$.next(null);
    this.correctAnswer$.next(null);
    this.selectedAnswer = null;
    this.router.navigateByUrl(`questionnaire/wrong/${this.subject}/${questionToNavigate.questionId}`);
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
