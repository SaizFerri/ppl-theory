import { Component, OnInit, Input } from '@angular/core';
import { Question } from '../interfaces/question.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire-menu',
  templateUrl: './questionnaire-menu.component.html'
})
export class QuestionnaireMenuComponent {

  @Input() questions: Question[];
  @Input() subject: string;

  constructor(private readonly router: Router) { }

  navigate(id: number) {
    this.router.navigateByUrl(`${this.subject}/${id}`);
  }

}
