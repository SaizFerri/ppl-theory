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
  @Input() wrong: boolean;
  @Input() subject: Subject;

  @Output() navigateTo = new EventEmitter<Question>();

  constructor(private readonly router: Router) { }

  navigate(id: number) {
    if (this.wrong) {
      this.navigateTo.emit(this.questions.filter(q => q.questionId === id)[0]);
    } else {
      this.router.navigateByUrl(`${this.subject}/${id}`);
    }
  }

}
