import { Component } from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent {
  data: any;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getQuizzes().subscribe(
      (result) => {
        console.log(result);
        this.data = result;
      },
      (error) => {
        console.log(error);
      }
    )
  }
}
