import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';
import {ApiService} from "../../services/api/api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LoginResponse} from "./login-response";
import { trigger, state, style, animate, transition } from '@angular/animations';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import * as moment from "moment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control) {
      if (control.hasError('required')) {
        return $localize`:@@requiredError:You must enter a value`;
      }

      if(control.hasError('minlength')) {
        return $localize`:@@minLengthError:Minimum length is ` + control.getError('minlength').requiredLength;
      }

      if(control.hasError('maxlength')) {
        return $localize`:@@maxLengthError:Maximum length is ` + control.getError('maxlength').requiredLength;
      }

    }

    return '';
  }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.onSubmit();
    }
  }

  cancel() {
    // empty all fields
    this.loginForm.reset();
  }

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.apiService.login(formData).subscribe(
        (response: LoginResponse) => {
          console.log('Registration successful', response);
          localStorage['api_token'] = response.access_token;
          const now = moment().toISOString();
          const expiresAt = moment().add(3, 'hours').toISOString();
          localStorage['expires_at'] = expiresAt;
          this.snackBar.open('Login successful', 'Close', {
            panelClass: ['snackbar-success'],
            duration: 3000
          });
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          console.error('Registration failed', error);
          if(error.error.message=='Account not confirmed'){
            console.log('Account not confirmed');
            this.snackBar.open('Account not confirmed', 'Close', {
              panelClass: ['snackbar-warning'],
              duration: 3000
            });
          }else{
            this.snackBar.open('Login failed', 'Close', {
              panelClass: ['snackbar-warning'],
              duration: 3000
            });
          }
        }
      );
    }
  }
}
