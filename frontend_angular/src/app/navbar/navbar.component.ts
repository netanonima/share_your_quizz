import { Component } from '@angular/core';
import {provideRouter} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public authService: AuthService) {
  }

  name = 'Angular 6';
    protected readonly provideRouter = provideRouter;

    logout() {
        localStorage.removeItem('api_token');
    }
}
