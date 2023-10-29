import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ResetPasswordResponse} from "./reset-password-response";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
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
export class ResetPasswordComponent implements OnInit{
  resetPasswordForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, { validators: this.passwordMatchValidator }),
    confirmationToken: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
  });

  public username: string | null | undefined;
  public token: string | null | undefined;

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password: string = passwordControl.value;
      const confirmPassword: string = confirmPasswordControl.value;
      return password === confirmPassword ? null : { mismatch: true };
    }

    return { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);
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

      return control.hasError('email') ? $localize`:@@hasErrorError:Not a valid email` : '';
    }

    return '';
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
      this.onSubmit();
    }
  }

  cancel() {
    // empty all fields
    this.resetPasswordForm.reset();
  }

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.resetPasswordForm.patchValue({
      username: this.username,
      confirmationToken: this.token
    })
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const formData = this.resetPasswordForm.value;
      const requestInput = {
        username: formData.username,
        password: formData.passwords.password,
        confirmation_token: formData.confirmationToken
      };
      this.apiService.resetPassword(requestInput).subscribe(
        (response: ResetPasswordResponse) => {
          console.log('Password reset success', response);
          this.snackBar.open('Password reset success, please login', 'Close', {
            panelClass: ['snackbar-success'],
            duration: 3000
          });
          this.router.navigate(['/login']);
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
