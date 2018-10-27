import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from './interfaces/question.interface';
import { Answer } from './interfaces/answer.interface';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(
    private http: HttpClient,
    private readonly db: AngularFirestore
    ) { }

  getQuestions(path: string): Observable<any> {
    return this.http.get(`./assets/${path}`);
  }

  async correctQuestion(selectedQuestion: Question, selectedAnswer: Answer, path: string): Promise<boolean> {
    const questions = await this.getQuestions(path).toPromise();
    const answers = questions.filter(question => question.id === selectedQuestion.id)[0].answers;
    
    const correctAnswer = answers.filter(answer => answer.correct === true)[0];
    
    if (correctAnswer.id === selectedAnswer.id) {
      return true;
    }

    return false;
  }

  async fireAddToCollection(question: Question, collection: string, correct: boolean, subject: string) {
    await this.db.collection(collection)
            .doc(subject)
            .collection('questions')
            .add({ questionId: question.id, answeredCorrectly: correct });
  }

  async fireCheckIfExists(question: Question, collection: string, subject: string): Promise<boolean> {
    const documents = await this.db.collection(collection).doc(subject).collection('questions').get().toPromise();
    let exists = false;

    documents.forEach(doc => {
      if (doc.data().questionId === question.id) {
        exists = true;
      }
    });

    return exists;
  }
}
