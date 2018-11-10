import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent {
  subjects: object[] = [
    {
      subject: 'Luftrecht',
      route: '/questionnaire/alw/1'
    },
    {
      subject: 'Menschliches Leistungsvermögen',
      route: '/questionnaire/hpl/1'
    },
    {
      subject: 'Meteorologie',
      route: '/questionnaire/met/1'
    },
    {
      subject: 'Komunikation',
      route: '/questionnaire/com/1'
    },
    {
      subject: 'Grundlagen des Fluges (Flugzeug)',
      route: '/questionnaire/pfa/1'
    },
    {
      subject: 'Betriebliche verfahren',
      route: '/questionnaire/opr/1'
    },
    {
      subject: 'Flugleistung und Flugplannung',
      route: '/questionnaire/fpp/1'
    },
    {
      subject: 'Allgemeine Luftfahrzeugkunde',
      route: '/questionnaire/agk/1'
    },
    {
      subject: 'Navigation',
      route: '/questionnaire/nav/1'
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }

}
