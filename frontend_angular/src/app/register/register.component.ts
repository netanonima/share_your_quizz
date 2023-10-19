import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(10), Validators.maxLength(70)]),
    passwords: new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, { validators: this.passwordMatchValidator })
  });

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
    const control = this.registerForm.get(controlName);
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

    return '';  // Retourne une chaîne vide si le contrôle est null
  }

  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }

  cancel() {
    // empty all fields
    this.registerForm.reset();
  }
}