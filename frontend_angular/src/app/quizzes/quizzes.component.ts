import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";
import {Sort} from "@angular/material/sort";
import * as moment from 'moment';
// import 'moment/locale/en-US';

export interface Quizz {
  id: number;
  quizz: string;
  created_on: Date;
  modified_on: Date;
}

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss'],
})
export class QuizzesComponent implements OnInit{
  data: Quizz[] = [];
  sortedData : Quizz[] | undefined;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getQuizzes().subscribe(
      (result) => {
        console.log(result);
        this.data = result;
        this.sortedData = this.data.slice();
      },
      (error) => {
        console.log(error);
      }
    )
  }

  sortData(sort: Sort) {
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'quizz':
          return compare(a.quizz, b.quizz, isAsc);
        case 'created_on':
          return compare(a.created_on, b.created_on, isAsc);
        case 'modified_on':
          return compare(a.modified_on, b.modified_on, isAsc);
        default:
          return 0;
      }
    });

    function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }

  play(id: number){
    console.log('play action');
  }

  edit(id: number){
    console.log('edit action');
  }

  delete(id: number){
    console.log('delete action');
  }

  protected readonly moment = moment;
}
