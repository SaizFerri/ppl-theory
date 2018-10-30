import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly af: AngularFireAuth) {}

  isLoggedIn() {
    return this.af.authState.pipe(first()).toPromise();
  }

  logIn(email: string, password: string): Promise<any> {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    this.af.auth.signOut();
  }
}
