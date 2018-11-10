import { Component } from '@angular/core';

@Component({
  selector: 'app-wrong-questionnaire-menu',
  templateUrl: './wrong-questionnaire-menu.component.html'
})
export class WrongQuestionnaireMenuComponent {
  subjects: object[] = [
    {
      subject: 'Luftrecht',
      route: '/questionnaire/wrong/alw/1'
    },
    {
      subject: 'Menschliches Leistungsvermögen',
      route: '/questionnaire/wrong/hpl/1'
    },
    {
      subject: 'Meteorologie',
      route: '/questionnaire/wrong/met/1'
    },
    {
      subject: 'Komunikation',
      route: '/questionnaire/wrong/com/1'
    },
    {
      subject: 'Grundlagen des Fluges (Flugzeug)',
      route: '/questionnaire/wrong/pfa/1'
    },
    {
      subject: 'Betriebliche verfahren',
      route: '/questionnaire/wrong/opr/1'
    },
    {
      subject: 'Flugleistung und Flugplannung',
      route: '/questionnaire/wrong/fpp/1'
    },
    {
      subject: 'Allgemeine Luftfahrzeugkunde',
      route: '/questionnaire/wrong/agk/1'
    },
    {
      subject: 'Navigation',
      route: '/questionnaire/wrong/nav/1'
    }
  ];

}
