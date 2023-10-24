import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-manage-media',
  templateUrl: './manage-media.component.html',
  styleUrls: ['./manage-media.component.scss'],
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
export class ManageMediaComponent {
  manageMediaForm: FormGroup = new FormGroup({
    file: new FormControl('', [Validators.required])
  });
  fileName: string = '';

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  fileChanged(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.fileName = fileInput.files[0].name;
      this.manageMediaForm.get('file')?.setValue(fileInput.files[0]);  // Mettez à jour la valeur du contrôle de formulaire
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.manageMediaForm.get(controlName);
    if (control) {
      if (control.hasError('required')) {
        return 'You must enter a value';
      }
    }
    return '';
  }

  constructor(
    public dialogRef: MatDialogRef<ManageMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submitValue(){
    if (this.manageMediaForm.valid) {
      const file = this.manageMediaForm.value.file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(reader.result){
          const base64 = reader.result.toString();
          const result = {
            base64: base64,
            fileName: file.name,
            erase: false
          }
          this.dialogRef.close(result);
        }
      };
    }
  }

  submitErasing(){
    const result = {
      base64: '',
      fileName: '',
      erase: true
    };
    this.dialogRef.close(result);
  }

  @ViewChild('fileInputRef', { static: false }) fileInputRef!: ElementRef;


  resetForm(){
    this.manageMediaForm.reset();
    this.fileName = '';  // Réinitialiser également la variable fileName
    this.fileInputRef.nativeElement.value = '';  // Réinitialiser l'input de type file
  }
}
