import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrong-questionnaire-menu',
  templateUrl: './wrong-questionnaire-menu.component.html'
})
export class WrongQuestionnaireMenuComponent {
  subjects: object[] = [
    {
      subject: "Navigation",
      route: "/wrong/nav/1"
    },
    {
      subject: "Komunikation",
      route: "/wrong/com/1"
    },
    {
      subject: "Flug planung",
      route: "/wrong/fpp/1"
    },
    {
      subject: "Meteorologie",
      route: "/wrong/met/1"
    },
    {
      subject: "Betriebliche verfahren",
      route: "/wrong/opr/1"
    }
  ];

}