import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lang } from '@app/core/enum/lang.enum';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  lang: BehaviorSubject<Lang>;

  constructor() {
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.lang = new BehaviorSubject<Lang>(<Lang>Lang[lang.toLocaleUpperCase()]);
    } else {
      localStorage.setItem('lang', 'de');
      this.lang = new BehaviorSubject<Lang>(Lang.DE);
    }
  }

  setLang(lang: Lang) {
    localStorage.setItem('lang', lang);
    this.lang.next(lang);
  }
}
