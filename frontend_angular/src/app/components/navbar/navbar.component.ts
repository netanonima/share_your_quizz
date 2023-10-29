import {Component, OnInit} from '@angular/core';
import {provideRouter, Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as moment from "moment";
import {LanguageService} from "../../services/language/language.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  public currentLanguage: string = 'en';

  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    public languageService: LanguageService
  ) {
  }

  name = 'Angular 6';
    protected readonly provideRouter = provideRouter;

    ngOnInit() {
      const now = moment();
      const expiresAt = moment(localStorage.getItem('expires_at'));
      if(now.isAfter(expiresAt)){
        this.logout();
        this.router.navigate(['/login']);
      }
      this.setCurrentLanguageFromUrl();
    }

    setCurrentLanguageFromUrl(): void {
      const langSegment = this.router.url.split('/')[1];
      switch (langSegment) {
        case 'de':
        case 'es':
        case 'fr':
        case 'it':
          this.currentLanguage = langSegment;
          break;
        default:
          this.currentLanguage = 'en';  // default to English
      }
    }

    logout() {
        localStorage.removeItem('api_token');
        this.snackBar.open('Logout successful', 'Close', {
          panelClass: ['snackbar-success'],
          duration: 3000
        });
    }

  changeLanguage(lang: string) {
    this.languageService.changeLanguage(lang);
  }
}
