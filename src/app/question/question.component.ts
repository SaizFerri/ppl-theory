import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../interfaces/question.interface';
import { Answer } from '../interfaces/answer.interface';
import { QuestionsService } from '../questions.service';
import { Collection } from '../enum/collection.enum';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {
  @Input() question: Question;
  
  path: string;
  subject: string;
  answers: Answer[];
  selectedAnswer: Answer;
  correct: boolean;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly questionService: QuestionsService
  ) {
    route.params.subscribe(params => this.initialize(params));
  }

  ngOnInit() {
    this.answers = this.question.answers;
  }

  initialize(params) {
    this.subject = params.subject;
    this.path = `${this.subject.toUpperCase()}/${this.subject}.json`;
  }

  async check() {
    let exists = await this.questionService.fireCheckIfExists(this.question, Collection.ANSWERED, this.subject);

    if (this.selectedAnswer) {
      this.correct = await this.questionService.correctQuestion(this.question, this.selectedAnswer, this.path);

      if (!exists) {
        this.questionService.fireAddToCollection(this.question, Collection.ANSWERED, this.correct, this.subject);
      }
    } else {
      return;
    }
  }

}
