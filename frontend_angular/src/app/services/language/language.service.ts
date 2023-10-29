import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private language = new BehaviorSubject<string>('en');
  currentLanguage = this.language.asObservable();

  changeLanguage(lang: string) {
    this.language.next(lang);
    window.location.href = 'https://'+window.location.hostname+`/${lang}/`;
  }
}
