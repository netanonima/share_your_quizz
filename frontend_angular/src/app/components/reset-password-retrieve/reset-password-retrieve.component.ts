import { Component } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ResetPasswordRetrieveResponse} from "./reset-password-retrieve-response";

@Component({
  selector: 'app-reset-password-retrieve',
  templateUrl: './reset-password-retrieve.component.html',
  styleUrls: ['./reset-password-retrieve.component.scss'],
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
export class ResetPasswordRetrieveComponent {
  resetPasswordRetrieveForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(70)]),
  });

  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordRetrieveForm.get(controlName);
    if (control) {
      if (control.hasError('required')) {
        return 'You must enter a value';
      }

      if(control.hasError('minlength')) {
        return 'Minimum length is ' + control.getError('minlength').requiredLength;
      }

      if(control.hasError('maxlength')) {
        return 'Maximum length is ' + control.getError('maxlength').requiredLength;
      }

      return control.hasError('email') ? 'Not a valid email' : '';
    }

    return '';
  }

  resetPasswordRetrieve() {
    if (this.resetPasswordRetrieveForm.valid) {
      console.log(this.resetPasswordRetrieveForm.value);
      this.onSubmit();
    }
  }

  cancel() {
    // empty all fields
    this.resetPasswordRetrieveForm.reset();
  }

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  onSubmit() {
    if (this.resetPasswordRetrieveForm.valid) {
      const formData = this.resetPasswordRetrieveForm.value;
      this.apiService.resetPasswordRetrieve(formData).subscribe(
        (response: ResetPasswordRetrieveResponse) => {
          console.log('Reset password retrieve success', response);
          this.snackBar.open('Reset password retrieve success, please check your e-mails', 'Close', {
            panelClass: ['snackbar-success'],
            duration: 6000
          });
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          console.error('Registration failed', error);
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: ['snackbar-warning'],
            duration: 3000
          });
        }
      );
    }
  }
}
