import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { Question } from '@app/core/interfaces/question.interface';
import { Answer } from '@app/core/interfaces/answer.interface';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnDestroy {
  @Input() question: Question;
  @Input() correctAnswer$: Subject<Answer>;
  @Input() correct$: Subject<boolean>;

  @Output() answer$ = new EventEmitter<Answer>();

  selectedAnswer: Answer;
  isWrong = false;
  isCorrect = false;
  buttonColor = 'primary';

  dangerColor = '#D33534';
  successColor = '#4BB543';
  colorWhite = '#FFFFFF';

  constructor() {}

  ngOnInit() {
    this.correct$.pipe(
      switchMap(correct => {
        if (correct) {
          this.isCorrect = true;
          this.isWrong = false;
          this.buttonColor = 'primary';
        } else if (!correct && correct !== null) {
          this.isCorrect = false;
          this.isWrong = true;
          this.buttonColor = 'warn';
        } else if (correct === null) {
          this.isCorrect = false;
          this.isWrong = false;
          this.buttonColor = 'primary';
        }
        return this.correctAnswer$;
      })
    )
    .subscribe(answer => {
      this.selectedAnswer = answer;
    });
  }

  ngOnDestroy() {
    this.correctAnswer$.unsubscribe();
  }

  answerOnChange() {
    this.answer$.emit(this.selectedAnswer);
  }
}
