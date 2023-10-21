import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.scss']
})
export class QuizzComponent implements OnInit{
  public data: any;
  public error: string;
  public id: string | undefined | null;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.error = '';
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if(this.id){
      this.apiService.getQuizz(this.id).subscribe(
        (result) => {
          console.log(result);
          this.data = result;
        },
        (error) => {
          console.log(error);
        }
      )
    }else{
      this.error = 'No id provided';
    }
  }
}
