import {Component, OnInit, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-answer-distribution',
  templateUrl: './answer-distribution.component.html',
  styleUrls: ['./answer-distribution.component.scss']
})
export class AnswerDistributionComponent implements OnInit, OnChanges {
  public maxHeight: number = 180;
  @Input() public data: any[] = [];
  public sumOfData: number = 0;

  sumData() {
    this.sumOfData = this.data.reduce((sum, current) => sum + current.value, 0);
  }

  getBarHeight(value: number) {
    return (this.maxHeight / this.sumOfData) * value + 'px';
  }

  ngOnInit() {
    this.sumData();
    console.log('this.data');
    console.log(this.data);
  }

  ngOnChanges() {
    this.sumData();
  }
}
