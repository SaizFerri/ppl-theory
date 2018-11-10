import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '@app/core/interfaces/question.interface';
import { Subject } from '@app/core/enum/subject.enum';

@Component({
  selector: 'app-questionnaire-menu',
  templateUrl: './questionnaire-menu.component.html'
})
export class QuestionnaireMenuComponent {

  @Input() questions: Question[];
  @Input() subject: Subject;

  @Output() navigateTo = new EventEmitter<Question>();

  constructor(private readonly router: Router) { }

  navigate(id: number) {
    this.navigateTo.emit(this.questions.find(q => q.questionId === id));
  }

}
