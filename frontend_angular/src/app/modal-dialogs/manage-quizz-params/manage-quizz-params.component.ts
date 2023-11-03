import {Component, Inject} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-manage-quizz-params',
  templateUrl: './manage-quizz-params.component.html',
  styleUrls: ['./manage-quizz-params.component.scss'],
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
export class ManageQuizzParamsComponent {
  shuffleQuestions = new FormControl(false);
  shuffleChoices = new FormControl(false);

  constructor(
    public dialogRef: MatDialogRef<ManageQuizzParamsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data){
      this.shuffleQuestions.setValue(data.shuffleQuestions);
      this.shuffleChoices.setValue(data.shuffleChoices);
    }
  }

  submitValue(){
    const returnValue = {
      shuffleQuestions: this.shuffleQuestions.value,
      shuffleChoices: this.shuffleChoices.value
    };
    this.dialogRef.close(returnValue);
  }
}
