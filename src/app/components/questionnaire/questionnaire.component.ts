import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionsService } from '../../services/questions.service';
import { Subjects } from '../../enum/subjects.enum';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent {
  subject: string;
  questions: Question[];
  question: Question;
  loaded: boolean = false;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly questionService: QuestionsService
  ) {
    route.params.subscribe(params => this.initialize(params));
  }

  initialize(params) {
    this.subject = params.subject;
    const id = parseInt(params.id);

    if (Subjects[this.subject.toUpperCase()]) {
      this.questionService.getQuestions(`${this.subject.toUpperCase()}/${this.subject}.json`).subscribe(
        response => {
          this.questions = response;
          this.loaded = true;
        },
        err => console.log(err)
      )
    }
  }

  next() {
    const questionId = parseInt(this.route.snapshot.paramMap.get('id')) + 1;
    const a = this.questions.filter(question => question.id === questionId);
    
    if (a.length > 0) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/1`);
    }
  }

  prev() {
    const questionId = parseInt(this.route.snapshot.paramMap.get('id')) - 1;
    const a = this.questions.filter(question => question.id === questionId);
    
    if (a.length > 0) {
      this.router.navigateByUrl(`/${this.subject}/${questionId}`);
    } else {
      this.router.navigateByUrl(`/${this.subject}/${this.questions.length}`);
    }
  }

}
