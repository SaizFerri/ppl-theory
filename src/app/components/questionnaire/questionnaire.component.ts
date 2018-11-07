import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Subject } from '../../enum/subject.enum';
import { Question } from '../../interfaces/question.interface';
import { QuestionnaireState } from 'src/app/states/questionnaire.state';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent {
  subject: Subject;
  questions: Question[];
  params: any;
  isLoaded: boolean = false;
  hasError: boolean = false;

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
        this.subject = <Subject>Subject[this.params.subject.toUpperCase()];
        this.hasError = false;
    
        return this.store.select(QuestionnaireState.questionsBySubject(this.subject));
      }),
      // Checks if the question exists and if not sets the hasError to true
      tap(questions => {
        const actualQuestion = questions.find(question => question.questionId === parseInt(this.params.id));
        
        if (!actualQuestion) {
          this.hasError = true;
        }
      })
    )
    .subscribe(questions => {
      this.questions = questions;
      this.isLoaded = true;
    });
  }

  next() {
    const questionId = parseInt(this.params.id) + 1;
    const checkNext = this.questions.find(question => question.questionId === questionId);
    
    if (checkNext) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/1`);
    }
  }

  prev() {
    const questionId = parseInt(this.params.id) - 1;
    const checkPrev = this.questions.find(question => question.questionId === questionId);
    
    if (checkPrev) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/${this.questions.length}`);
    }
  }

}
