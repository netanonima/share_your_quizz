import { Component } from '@angular/core';
import {provideRouter} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
  }

  name = 'Angular 6';
    protected readonly provideRouter = provideRouter;

    logout() {
        localStorage.removeItem('api_token');
        this.snackBar.open('Logout successful', 'Close', {
          panelClass: ['snackbar-success'],
          duration: 3000
        });
    }
}
