import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private language = new BehaviorSubject<string>('en');
  currentLanguage = this.language.asObservable();

  changeLanguage(lang: string) {
    console.log('language set to: ' + lang);
    this.language.next(lang);
    window.location.href = `/${lang}/`;
  }
}
