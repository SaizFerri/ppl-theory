import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent implements OnInit {
  email: string;
  password: string;
  isError: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {}

  logIn() {
    this.authService.logIn(this.email, this.password)
      .then(res => this.router.navigate(['']))
      .catch(err => {
        this.isError = true;
        this.password = '';
      });
  }
}
