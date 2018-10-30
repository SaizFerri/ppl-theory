import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Question } from '../interfaces/question.interface';
import { Answer } from '../interfaces/answer.interface';
import { AuthService } from './auth.service';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  wrongQuestionData = new EventEmitter<Question>();

  constructor(
    private http: HttpClient,
    private readonly db: AngularFirestore,
    private readonly authService: AuthService
  ) { }

  getQuestions(path: string): Observable<any> {
    return this.http.get(`./assets/${path}`);
  }

  passQuestion(question: Question) {
    this.wrongQuestionData.emit(question);
  }

  async correctQuestion(selectedQuestion: Question, selectedAnswer: Answer, path: string): Promise<Answer> {
    const questions = await this.getQuestions(path).toPromise();
    const answers = questions.filter(question => question.id === selectedQuestion.id)[0].answers;
    
    const correctAnswer = answers.filter(answer => answer.correct === true)[0];

    return correctAnswer;
  }

  fireGetAllWrong(user: User, subject: string): Observable<any> {
    return this.db.collection('answeredQuestions').doc(subject).collection('questions', ref => ref.where('userId', '==', user.uid).where('answeredCorrectly', '==', false)).valueChanges();
  }

  async fireAddToCollection(question: Question, collection: string, correct: boolean, subject: string) {
    const user = await this.authService.isLoggedIn();
    
    await this.db.collection(collection)
            .doc(subject)
            .collection('questions')
            .add({ userId: user.uid, questionId: question.id, answeredCorrectly: correct });
  }

  async fireCheckIfExists(question: Question, collection: string, subject: string): Promise<boolean> {
    const user = await this.authService.isLoggedIn();
    const documents = await this.db.collection(collection).doc(subject).collection('questions').get().toPromise();
    let exists = false;

    documents.forEach(doc => {
      if (doc.data().questionId === question.id && doc.data().userId === user.uid) {
        exists = true;
      }
    });

    return exists;
  }
}
