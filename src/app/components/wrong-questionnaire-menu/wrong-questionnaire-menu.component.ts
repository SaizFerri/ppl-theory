import { Component } from '@angular/core';

@Component({
  selector: 'app-wrong-questionnaire-menu',
  templateUrl: './wrong-questionnaire-menu.component.html'
})
export class WrongQuestionnaireMenuComponent {
  subjects: object[] = [
    {
      subject: "Luftrecht",
      route: "/wrong/alw/1"
    },
    {
      subject: "Menschliches Leistungsvermögen",
      route: "/wrong/hpl/1"
    },
    {
      subject: "Meteorologie",
      route: "/wrong/met/1"
    },
    {
      subject: "Komunikation",
      route: "/wrong/com/1"
    },
    {
      subject: "Grundlagen des Fluges (Flugzeug)",
      route: "/wrong/pfa/1"
    },
    {
      subject: "Betriebliche verfahren",
      route: "/wrong/opr/1"
    },
    {
      subject: "Flugleistung und Flugplannung",
      route: "/wrong/fpp/1"
    },
    {
      subject: "Allgemeine Luftfahrzeugkunde",
      route: "/wrong/agk/1"
    },
    {
      subject: "Navigation",
      route: "/wrong/nav/1"
    }
  ];

}
