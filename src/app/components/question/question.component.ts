import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';
import { QuestionsService } from '../../services/questions.service';
import { Collection } from '../../enum/collection.enum';

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
  buttonColor: string;
  isWrong: boolean = false;
  isCorrect: boolean = false;


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
    this.buttonColor = 'primary';
    this.isWrong = false;
    this.isCorrect = false;
  }

  async check() {
    
    if (this.selectedAnswer) {
      this.correct = await this.questionService.correctQuestion(this.question, this.selectedAnswer, this.path);
      
      if (!this.correct) {
        this.buttonColor = 'warn';
        this.isCorrect = false;
        this.isWrong = true;
      } else if (this.correct) {
        this.isWrong = false;
        this.isCorrect = true;
      }

      let exists = await this.questionService.fireCheckIfExists(this.question, Collection.ANSWERED, this.subject);

      if (!exists) {
        this.questionService.fireAddToCollection(this.question, Collection.ANSWERED, this.correct, this.subject);
      }
    } else {
      return;
    }
  }

}
