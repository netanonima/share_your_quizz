import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-new-element',
  templateUrl: './new-element.component.html',
  styleUrls: ['./new-element.component.scss'],
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
export class NewElementComponent {
  newElementForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(80)])
  });

  getErrorMessage(controlName: string): string {
    const control = this.newElementForm.get(controlName);
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


  constructor(public dialogRef: MatDialogRef<NewElementComponent>) {}

  submitValue(){
    if (this.newElementForm.valid) {
      this.dialogRef.close(this.newElementForm.value.value);
    }
  }
}
