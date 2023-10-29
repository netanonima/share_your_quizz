import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-rename-element',
  templateUrl: './rename-element.component.html',
  styleUrls: ['./rename-element.component.scss'],
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
export class RenameElementComponent {
  renameElementForm: FormGroup = new FormGroup({
    value: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(80)])
  });

  getErrorMessage(controlName: string): string {
    const control = this.renameElementForm.get(controlName);
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

  constructor(
    public dialogRef: MatDialogRef<RenameElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data){
      this.renameElementForm.setValue({value: data.name});
    }
  }

  submitValue(){
    if (this.renameElementForm.valid) {
      this.dialogRef.close(this.renameElementForm.value.value);
    }
  }
}
