import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit{
  data: any;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getQuizzs().subscribe(
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
