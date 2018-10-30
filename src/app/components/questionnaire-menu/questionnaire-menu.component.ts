import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-questionnaire-menu',
  templateUrl: './questionnaire-menu.component.html'
})
export class QuestionnaireMenuComponent {

  @Input() questions: Question[];
  @Input() wrong: boolean;
  @Input() subject: string;

  @Output() navigateTo = new EventEmitter<Question>();

  constructor(private readonly router: Router) { }

  navigate(id: number) {
    if (this.wrong) {
      this.navigateTo.emit(this.questions.filter(q => q.id === id)[0]);
    } else {
      this.router.navigateByUrl(`${this.subject}/${id}`);
    }
  }

}
