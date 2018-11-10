import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngxs/store';

import { switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { QuestionnaireState } from '@app/core/states/questionnaire.state';
import { AddAnsweredQuestionToFirebase } from '@app/core/actions/questionnaire.actions';

import { Subject as QuestionSubject } from '@app/core/enum/subject.enum';
import { Question } from '@app/core/interfaces/question.interface';
import { Answer } from '@app/core/interfaces/answer.interface';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent {
  question: Question;
  questions: Question[];
  subject: QuestionSubject;
  selectedAnswer: Answer;
  correctAnswer$: Subject<Answer> = new Subject<Answer>();
  isCorrect$: Subject<boolean> = new Subject<boolean>();

  params: Params;
  isLoaded = false;
  hasError = false;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    /**
     * Initializes component when route params are changed
     * Calls switchMap to return the observable with the questions sorted by subject
     */
    this.route.params.pipe(
      switchMap(params => {
        this.params = params;
        this.subject = <QuestionSubject>QuestionSubject[this.params.subject.toUpperCase()];
        this.hasError = false;
        this.isCorrect$.next(null);

        return this.store.select(QuestionnaireState.questionsBySubject(this.subject));
      }),
      // Checks if the question exists and if not sets the hasError to true
      tap(questions => {
        this.question = questions.find(question => question.questionId === parseInt(this.params.id, 10));

        if (!this.question) {
          this.hasError = true;
        }
      })
      )
      .subscribe(questions => {
        this.questions = questions;
        this.isLoaded = true;
      });
  }

  test() {
    console.log('asda');
  }

  getAnswer(answer) {
    this.selectedAnswer = answer;
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
    const checkNext = this.questions.find(question => question.questionId === questionId);

    if (checkNext) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/1`);
    }
  }

  prev() {
    const questionId = parseInt(this.params.id, 10) - 1;
    const checkPrev = this.questions.find(question => question.questionId === questionId);

    if (checkPrev) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/${this.questions.length}`);
    }
  }

}
