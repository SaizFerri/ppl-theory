import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable } from 'rxjs';

import { Question } from '../interfaces/question.interface';
import { AuthService } from './auth.service';
import { Collection } from '../enum/collection.enum';
import { LanguageService } from '@app/core/services/language.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private readonly db: AngularFirestore,
    private readonly authService: AuthService
  ) { }

  getQuestions(path: string): Observable<any> {
    return this.http.get(`./assets/${path}`);
  }

  fireGetAllWrong(user: User): Observable<any> {
    return this.languageService.lang.pipe(
      switchMap(lang => {
        return this.db.collection(Collection.WRONG, ref => ref.where('userId', '==', user.uid).where('lang', '==', lang)).valueChanges();
      })
    );
  }

  async fireAddToWrongAnsweredCollection(question: Question, collection: Collection) {
    const user: User = await this.authService.isLoggedIn();

    if (user) {
      await this.db.collection(collection).add({
          userId: user.uid,
          questionId: question.id,
          questionNumber: question.questionId,
          subject: question.subject,
          lang: question.lang
        }
      );
    }
  }
}
