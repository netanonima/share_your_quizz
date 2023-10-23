import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginResponse} from "../login/login-response";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
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
export class ConfirmAccountComponent implements OnInit{
  confirmAccountForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    confirmationToken: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]),
  });

  public username: string | null | undefined;
  public token: string | null | undefined;

  getErrorMessage(controlName: string): string {
    const control = this.confirmAccountForm.get(controlName);
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

    }

    return '';
  }

  confirmAccount() {
    if (this.confirmAccountForm.valid) {
      console.log(this.confirmAccountForm.value);
      this.onSubmit();
    }
  }

  cancel() {
    // empty all fields
    this.confirmAccountForm.reset();
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

    this.confirmAccountForm.patchValue({
      username: this.username,
      confirmationToken: this.token
    })
  }

  onSubmit() {
    if (this.confirmAccountForm.valid) {
      const formData = this.confirmAccountForm.value;
      this.apiService.confirmAccount(formData).subscribe(
        (response: LoginResponse) => {
          console.log('Account confirmation success', response);
          this.snackBar.open('Account confirmed with success. Please login', 'Close', {
            panelClass: ['snackbar-success'],
            duration: 6000
          });
          this.router.navigate(['/login']);
        },
        (error: HttpErrorResponse) => {
          console.error('Account confirmation failed', error);
          this.snackBar.open('Account confirmation failed', 'Close', {
            panelClass: ['snackbar-warning'],
            duration: 3000
          });
        }
      );
    }
  }
}
