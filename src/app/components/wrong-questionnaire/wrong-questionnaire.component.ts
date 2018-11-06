import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { Question } from '../../interfaces/question.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wrong-questionnaire',
  templateUrl: './wrong-questionnaire.component.html'
})
export class WrongQuestionnaireComponent implements OnInit {
  questions: Question[];
  answeredQuestions: any[];
  isEmpty: boolean = true;
  actualQuestion: any;
  subject: string;
  path: string;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private readonly questionService: QuestionsService,
    private readonly authService: AuthService
  ) { 
    route.params.subscribe(params => { this.initialize(params); this.subject = params.subject })
  }

  //Fix this
  async ngOnInit() {
    // this.path = `${this.subject.toUpperCase()}/${this.subject}.json`;
    // const user = await this.authService.isLoggedIn();
    // if (this.subject) {
    //   // Check if id is valid
    //   this.questionService.fireGetAllWrong(user).subscribe(
    //     response => {
    //       this.answeredQuestions = response;
    //       this.questionService.passQuestion(this.answeredQuestions[0]);
    //       this.actualQuestion = this.answeredQuestions[0];
    //       this.isEmpty = this.answeredQuestions.length > 0 ? false : true;

    //       this.questionService.getQuestions(this.path).subscribe(
    //         response => {
    //           this.questions = response;
    //           const originalQuestions = [];
    //           this.answeredQuestions.forEach(question => {
    //             this.questions.forEach(q => {
    //               if (question.questionId === q.id) {
    //                 originalQuestions.push(q);
    //               }
    //             });
    //           });
    //           this.questions = originalQuestions;
    //         }
    //       )
    //     }
    //   );
    // }
  }

  initialize(params) {}

  navigateTo(question) {
    const questionToNavigate = this.answeredQuestions.filter(q => q.questionId === question.id)[0];
    this.questionService.passQuestion(questionToNavigate);
    this.actualQuestion = questionToNavigate;
    this.router.navigateByUrl(`wrong/${this.subject}/${questionToNavigate.questionNumber}`);
  }

  next() {
    const index = this.answeredQuestions.indexOf(this.actualQuestion);  
    
    if (this.answeredQuestions.length > 1) {
      if (this.answeredQuestions[index+1]) {
        this.questionService.passQuestion(this.answeredQuestions[index+1]);
        this.actualQuestion = this.answeredQuestions[index+1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionNumber}`);
      } else {
        this.questionService.passQuestion(this.answeredQuestions[0]);
        this.actualQuestion = this.answeredQuestions[0];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionNumber}`);
      }
    }
  }

  prev() {
    const index = this.answeredQuestions.indexOf(this.actualQuestion);
    
    if (this.answeredQuestions.length > 1) {
      if (this.answeredQuestions[index-1] && this.answeredQuestions.length > 1) {
        this.questionService.passQuestion(this.answeredQuestions[index-1]);
        this.actualQuestion = this.answeredQuestions[index-1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionNumber}`);
      } else {
        this.questionService.passQuestion(this.answeredQuestions[this.answeredQuestions.length-1]);
        this.actualQuestion = this.answeredQuestions[this.answeredQuestions.length-1];
        this.router.navigateByUrl(`wrong/${this.subject}/${this.actualQuestion.questionNumber}`);
      }
    }
  }

}
