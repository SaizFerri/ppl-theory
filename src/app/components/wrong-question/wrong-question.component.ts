import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Question } from '../../interfaces/question.interface';
import { Answer } from '../../interfaces/answer.interface';
import { QuestionsService } from '../../services/questions.service';
import { Collection } from '../../enum/collection.enum';

@Component({
  selector: 'app-wrong-question',
  templateUrl: './wrong-question.component.html'
})
export class WrongQuestionComponent implements OnInit {
  @Input() isEmpty: boolean;
  
  question: Question;
  params;
  questionId: number;
  
  path: string;
  subject: string;
  answers: Answer[];
  selectedAnswer: Answer;
  correctAnswer: Answer;
  buttonColor: string;
  isLoaded: boolean = false;
  isWrong: boolean = false;
  isCorrect: boolean = false;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly questionService: QuestionsService
  ) {
    route.params.subscribe(params => { /*this.initialize(params);*/ this.params = params; });
  }

  ngOnInit() {
    this.path = `${this.params.subject.toUpperCase()}/${this.params.subject}.json`;
    this.questionService.wrongQuestionData.subscribe(
      res => {
        this.questionId = res.questionId;
        this.questionService.getQuestions(this.path).subscribe(
          response => {
            const questions = response;
            this.question = questions.filter(question => question.id === this.questionId)[0];
            this.answers = this.question.answers;
            this.isLoaded = true;
            this.buttonColor = 'primary';
            this.isWrong = false;
            this.isCorrect = false;
          },
          err => console.log(err)
        )
      }
    )
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

      // let exists = await this.questionService.fireCheckIfExists(this.question, Collection.ANSWERED, this.subject);

      // if (!exists) {
      //   this.questionService.fireAddToCollection(this.question, Collection.ANSWERED, this.correct, this.subject);
      // }
    } else {
      return;
    }
  }

}
