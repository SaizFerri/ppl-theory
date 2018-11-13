import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '@app/core/services/language.service';

@Component({
  selector: 'app-wrong-questionnaire-menu',
  templateUrl: './wrong-questionnaire-menu.component.html'
})
export class WrongQuestionnaireMenuComponent implements OnInit, OnDestroy {
  language: string;
  language$: Subscription;
  subjectLang: string;

  dangerColor = '#D33534';
  subjects: object[] = [
    {
      subjectDe: 'Luftrecht',
      subjectEn: 'Air Law',
      route: '/questionnaire/wrong/alw/1'
    },
    {
      subjectDe: 'Menschliches Leistungsvermögen',
      subjectEn: 'Human Performance and Limitations',
      route: '/questionnaire/wrong/hpl/1'
    },
    {
      subjectDe: 'Meteorologie',
      subjectEn: 'Metereology',
      route: '/questionnaire/wrong/met/1'
    },
    {
      subjectDe: 'Komunikation',
      subjectEn: 'Communication',
      route: '/questionnaire/wrong/com/1'
    },
    {
      subjectDe: 'Grundlagen des Fluges (Flugzeug)',
      subjectEn: 'Principles of Flight (Aeroplane)',
      route: '/questionnaire/wrong/pfa/1'
    },
    {
      subjectDe: 'Betriebliche verfahren',
      subjectEn: 'Operational Procedures',
      route: '/questionnaire/wrong/opr/1'
    },
    {
      subjectDe: 'Flugleistung und Flugplannung',
      subjectEn: 'Flight Performance and Planning',
      route: '/questionnaire/wrong/fpp/1'
    },
    {
      subjectDe: 'Allgemeine Luftfahrzeugkunde',
      subjectEn: 'Aircraft General Knowledge',
      route: '/questionnaire/wrong/agk/1'
    },
    {
      subjectDe: 'Navigation',
      subjectEn: 'Navigation',
      route: '/questionnaire/wrong/nav/1'
    }
  ];

  constructor(private readonly languageService: LanguageService) {}

  ngOnInit() {
    this.language$ = this.languageService.lang
      .subscribe(lang => {
        this.language = lang;
        this.subjectLang = lang === 'de' ? 'subjectDe' : 'subjectEn';
      });
  }

  ngOnDestroy() {
    this.language$.unsubscribe();
  }

}
