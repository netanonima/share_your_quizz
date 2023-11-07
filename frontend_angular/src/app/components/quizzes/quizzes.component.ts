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
import { Quizz } from "./quizz.interface";
import {RenameElementComponent} from "../../modal-dialogs/rename-element/rename-element.component";
import {ManageQuizzParamsComponent} from "../../modal-dialogs/manage-quizz-params/manage-quizz-params.component";
// import 'moment/locale/en-US';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss'],
})
export class QuizzesComponent implements OnInit{
  public data: Quizz[] = [];
  public sortedData : Quizz[] | undefined;

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
        this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
          panelClass: ['snackbar-warning'],
          duration: 3000
        });
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
            this.snackBar.open($localize`:@@elementAdded:Element added`, $localize`:@@closeSnackbar:Close`, {
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
            this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
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
        this.snackBar.open($localize`:@@gameSessionCreated:Game session created`, $localize`:@@closeSnackbar:Close`, {
          panelClass: ['snackbar-success'],
          duration: 3000
        });
        const domain = window.location.origin;
        // window.open(domain+`/play?id=${response.id}`, '_blank');
        this.router.navigate([{ outlets: { playOutlet: ['play'] } }], { queryParams: { id: response.id } });

      },
(error: HttpErrorResponse) => {
        console.error('An error occurred', error);
        this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
          panelClass: ['snackbar-warning'],
          duration: 3000
        });
      }
    );
  }

  rename(id: number){
    console.log('rename action');
    const dialogRef = this.dialog.open(RenameElementComponent, {
      data: { name: this.sortedData?.find((item) => item.id === id)?.quizz }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('User submitted value', result);

        this.apiService.renamingQuizz(id.toString(), result).subscribe(
          (response: any) => {
            console.log('Element renamed', response);
            this.snackBar.open($localize`:@@elementRenamed:Element renamed`, $localize`:@@closeSnackbar:Close`, {
              panelClass: ['snackbar-success'],
              duration: 3000
            });
            // update element in array
            this.sortedData = this.sortedData?.map((item) => {
              if(item.id === id){
                item.quizz = response.quizz;
                item.modified_on = response.modified_on;
              }
              return item;
            });
          },
          (error: HttpErrorResponse) => {
            console.log('An error occurred', error);
            this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
              panelClass: ['snackbar-warning'],
              duration: 3000
            });
          }
        );
      }
    });
  }

  edit(id: number){
    console.log('edit action');
    this.router.navigate(['/questions'], { queryParams: { id: id } });
  }

  param(id: number){
    console.log('param action');
    const dialogRef = this.dialog.open(ManageQuizzParamsComponent, {
      data: {
        shuffleQuestions: this.sortedData?.find((item) => item.id === id)?.param_shuffle_questions,
        shuffleChoices: this.sortedData?.find((item) => item.id === id)?.param_shuffle_choices
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('User submitted value', result);

        this.apiService.updatingQuizzParams(id.toString(), result.shuffleQuestions, result.shuffleChoices).subscribe(
            (response: any) => {
              console.log('Element renamed', response);
              this.snackBar.open($localize`:@@elementRenamed:Element renamed`, $localize`:@@closeSnackbar:Close`, {
                panelClass: ['snackbar-success'],
                duration: 3000
              });
              // update element in array
              this.sortedData = this.sortedData?.map((item) => {
                if(item.id === id){
                  item.modified_on = response.modified_on;
                  item.param_shuffle_questions = response.param_shuffle_questions;
                  item.param_shuffle_choices = response.param_shuffle_choices;
                }
                return item;
              });
            },
            (error: HttpErrorResponse) => {
              console.log('An error occurred', error);
              this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
                panelClass: ['snackbar-warning'],
                duration: 3000
              });
            }
        );
      }
    });
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
            this.snackBar.open($localize`:@@elementDeleted:Element deleted`, $localize`:@@closeSnackbar:Close`, {
              panelClass: ['snackbar-success'],
              duration: 3000
            });
            this.sortedData = this.sortedData?.filter((item) => item.id !== id);
          },
          (error: HttpErrorResponse) => {
            console.error('An error occurred', error);
            this.snackBar.open($localize`:@@errorOccurred:An error occurred`, $localize`:@@closeSnackbar:Close`, {
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
