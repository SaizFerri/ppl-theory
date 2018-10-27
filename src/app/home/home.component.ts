import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  subjects: object[] = [
    {
      subject: "Navigation",
      route: "/nav/1"
    },
    {
      subject: "Komunikation",
      route: "/com/1"
    },
    {
      subject: "Flug planung",
      route: "/fpp/1"
    },
    {
      subject: "Meteorologie",
      route: "/met/1"
    },
    {
      subject: "Betriebliche verfahren",
      route: "/opr/1"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
