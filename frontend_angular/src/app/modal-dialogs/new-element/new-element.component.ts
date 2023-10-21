import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-element',
  templateUrl: './new-element.component.html',
  styleUrls: ['./new-element.component.scss']
})
export class NewElementComponent {
  elementValue = '';
  @Output() valueSubmitted = new EventEmitter<string>();

  submitValue(){
    this.valueSubmitted.emit(this.elementValue);
  }
}
