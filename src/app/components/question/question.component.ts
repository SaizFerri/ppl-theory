import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';
import { QuestionsService } from '../../services/questions.service';
import { Collection } from '../../enum/collection.enum';
import { Store } from '@ngxs/store';
import { CheckIfExistsInFirebase } from 'src/app/actions/questionnaire.actions';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit {
  question: Question;
  answers: Answer[];
  selectedAnswer: Answer;
  correctAnswer: Answer;
  path: string;
  params: object;
  subject: string;
  buttonColor: string;
  isLoaded: boolean = false;
  isWrong: boolean = false;
  isCorrect: boolean = false;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly questionService: QuestionsService,
    private readonly store: Store
  ) {
    route.params.subscribe(params => this.initialize(params));
  }

  ngOnInit() {}
  
  async initialize(params) {
    this.selectedAnswer = null;
    this.isLoaded = false;
    this.subject = params.subject;
    this.path = `${this.subject.toUpperCase()}/${this.subject}.json`;
    this.buttonColor = 'primary';
    this.isWrong = false;
    this.isCorrect = false;

    this.questionService.getQuestions(this.path).subscribe(
      response => {
        this.question = response.filter(question => question.questionId === parseInt(params.id))[0];
        this.answers = this.question.answers;
        this.isLoaded = true;
      }
    )
  }

  async check() {
    if (this.selectedAnswer) {
      this.correctAnswer = await this.questionService.correctQuestion(this.question, this.selectedAnswer, this.path);      
      this.correctAnswer = this.answers.filter(answer => answer.id === this.correctAnswer.id)[0];
      
      if (this.correctAnswer.id !== this.selectedAnswer.id) {
        this.buttonColor = 'warn';
        this.selectedAnswer = this.correctAnswer;
        this.isCorrect = false;
        this.isWrong = true;
      } else if (this.correctAnswer.id === this.selectedAnswer.id) {
        this.buttonColor = 'primary';
        this.isWrong = false;
        this.isCorrect = true;
      }

      /** Update this */
      //let exists = this.store.dispatch(new CheckIfExistsInFirebase(this.question)).subscribe(response => console.log(response));
      
      // if (!exists) {
      //   this.questionService.fireAddToCollection(this.question, Collection.ANSWERED, this.isCorrect, this.subject);
      // }
    } else {
      return;
    }
  }

}
