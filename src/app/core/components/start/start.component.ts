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
      route: '/alw/1'
    },
    {
      subject: 'Menschliches Leistungsvermögen',
      route: '/hpl/1'
    },
    {
      subject: 'Meteorologie',
      route: '/met/1'
    },
    {
      subject: 'Komunikation',
      route: '/com/1'
    },
    {
      subject: 'Grundlagen des Fluges (Flugzeug)',
      route: '/pfa/1'
    },
    {
      subject: 'Betriebliche verfahren',
      route: '/opr/1'
    },
    {
      subject: 'Flugleistung und Flugplannung',
      route: '/fpp/1'
    },
    {
      subject: 'Allgemeine Luftfahrzeugkunde',
      route: '/agk/1'
    },
    {
      subject: 'Navigation',
      route: '/nav/1'
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
