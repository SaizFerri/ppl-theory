import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (
    private readonly router: Router,
    private authService: AuthService

  ) { }
  
  async canActivate() {
    const user = await this.authService.isLoggedIn();

    if (user) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}