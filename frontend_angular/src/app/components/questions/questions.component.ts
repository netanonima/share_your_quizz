import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../services/api/api.service";
import {Question} from "./question.interface";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit{
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
  }

  public data: Question[] = [];

  ngOnInit() {
    console.log('QuestionsComponent');
    const quizzId = this.route.snapshot.queryParamMap.get('id');
    if(quizzId){
      this.apiService.getQuestions(quizzId).subscribe(
        (result) => {
          console.log(result);
          this.data = result;
        },
        (error) => {
          console.log(error);
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: ['snackbar-error'],
            duration: 3000
          });
        }
      );
    }
  }
}
