import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {Sort} from "@angular/material/sort";
import * as moment from 'moment';
import {Router} from "@angular/router";
import {MatDialog } from "@angular/material/dialog";
import {DeleteConfirmationComponent} from "../../modal-dialogs/delete-confirmation/delete-confirmation.component";
import {LoginResponse} from "../login/login-response";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NewElementComponent} from "../../modal-dialogs/new-element/new-element.component";
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

  constructor(
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
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

  add(){
    console.log('add action');
    const dialogRef = this.dialog.open(NewElementComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User submitted value', result);
        this.apiService.addingQuizz(result).subscribe(
          (response: any) => {
            console.log('Element added', response);
            this.snackBar.open('Element added', 'Close', {
              panelClass: ['snackbar-success'],
              duration: 3000
            });
            // add element to array
            const newQuizz: Quizz = {
              id: response.id,
              quizz: response.quizz,
              created_on: response.created_on,
              modified_on: response.modified_on
            } as Quizz;
            this.sortedData?.push(newQuizz);
          },
          (error: HttpErrorResponse) => {
            console.error('An error occurred', error);
            this.snackBar.open('An error occurred', 'Close', {
              panelClass: ['snackbar-warning'],
              duration: 3000
            });
          }
        )
      } else {
        console.log('User cancelled element adding');
      }
    });
  }

  play(id: number){
    console.log('play action');
    this.apiService.startSession(id.toString()).subscribe(
      (response: any) => {
        console.log('Game session created');
        this.snackBar.open('Game session created', 'Close', {
          panelClass: ['snackbar-success'],
          duration: 3000
        });
        console.log('====');
        console.log(window.location);
        const domain = window.location.origin;
        // window.open(domain+`/play?id=${response.id}`, '_blank');
        this.router.navigate([{ outlets: { playOutlet: ['play'] } }], { queryParams: { id: response.id } });

      },
(error: HttpErrorResponse) => {
        console.error('An error occurred', error);
        this.snackBar.open('An error occurred', 'Close', {
          panelClass: ['snackbar-warning'],
          duration: 3000
        });
      }
    );
  }

  edit(id: number){
    console.log('edit action');
    this.router.navigate(['/quizz'], { queryParams: { id: id } });
  }

  delete(id: number){
    console.log('delete action');
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');

        this.apiService.deleteQuizz(id.toString()).subscribe(
          (response: any) => {
            console.log('Element deleted', response);
            this.snackBar.open('Element deleted', 'Close', {
              panelClass: ['snackbar-success'],
              duration: 3000
            });
            this.sortedData = this.sortedData?.filter((item) => item.id !== id);
          },
          (error: HttpErrorResponse) => {
            console.error('An error occurred', error);
            this.snackBar.open('An error occurred', 'Close', {
              panelClass: ['snackbar-warning'],
              duration: 3000
            });
          }
        );

      } else {
        console.log('User cancelled deletion');
      }
    });
  }

  protected readonly moment = moment;
}
