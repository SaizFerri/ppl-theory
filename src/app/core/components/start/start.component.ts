import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { LanguageService } from '@app/core/services/language.service';
import { Lang } from '@app/core/enum/lang.enum';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { FetchQuestions, QuestionsService } from '@app/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit, OnDestroy {
  language$: Subscription;
  language: string;
  subjectLang: string;

  dangerColor = '#D33534';
  colorWhite = '#FFFFFF';

  subjects: object[] = [
    {
      subjectDe: 'Luftrecht',
      subjectEn: 'Air Law',
      route: '/questionnaire/alw/1'
    },
    {
      subjectDe: 'Menschliches Leistungsvermögen',
      subjectEn: 'Human Performance and Limitations',
      route: '/questionnaire/hpl/1'
    },
    {
      subjectDe: 'Meteorologie',
      subjectEn: 'Metereology',
      route: '/questionnaire/met/1'
    },
    {
      subjectDe: 'Komunikation',
      subjectEn: 'Communication',
      route: '/questionnaire/com/1'
    },
    {
      subjectDe: 'Grundlagen des Fluges (Flugzeug)',
      subjectEn: 'Principles of Flight (Aeroplane)',
      route: '/questionnaire/pfa/1'
    },
    {
      subjectDe: 'Betriebliche verfahren',
      subjectEn: 'Operational Procedures',
      route: '/questionnaire/opr/1'
    },
    {
      subjectDe: 'Flugleistung und Flugplannung',
      subjectEn: 'Flight Performance and Planning',
      route: '/questionnaire/fpp/1'
    },
    {
      subjectDe: 'Allgemeine Luftfahrzeugkunde',
      subjectEn: 'Aircraft General Knowledge',
      route: '/questionnaire/agk/1'
    },
    {
      subjectDe: 'Navigation',
      subjectEn: 'Navigation',
      route: '/questionnaire/nav/1'
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly languageService: LanguageService,
    private readonly questionsService: QuestionsService,
    private readonly store: Store,
    private readonly authService: AuthService
  ) {}

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

  getLanguage() {
    this.languageService.setLang(<Lang>Lang[this.language.toUpperCase()]);
    this.store.dispatch(new FetchQuestions());
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['login']);
  }

  // deleteQuestions() {
  //   this.questionsService.fireDeleteByUserId('');
  // }

}
