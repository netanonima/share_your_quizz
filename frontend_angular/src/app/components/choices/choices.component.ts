import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Sort} from "@angular/material/sort";
import {Choice} from "./choice.interface";
import {NewElementComponent} from "../../modal-dialogs/new-element/new-element.component";
import {Question} from "../questions/question.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {RenameElementComponent} from "../../modal-dialogs/rename-element/rename-element.component";
import {DeleteConfirmationComponent} from "../../modal-dialogs/delete-confirmation/delete-confirmation.component";

@Component({
  selector: 'app-choices',
  templateUrl: './choices.component.html',
  styleUrls: ['./choices.component.scss']
})
export class ChoicesComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  public questionId: string | null = null;
  public data: Choice[] = [];
  public sortedData : Choice[] | undefined;

  ngOnInit(): void {
    console.log('ChoicesComponent');
    this.questionId = this.route.snapshot.queryParamMap.get('id');
    if(this.questionId){
      this.apiService.getChoices(this.questionId).subscribe(
        (result) => {
          console.log(result);
          this.data = result;
          this.sortedData = this.data.slice();
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

  sortData(sort: Sort) {
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'choice':
          return compare(a.choice, b.choice, isAsc);
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
        if(this.questionId){
          this.apiService.addingChoice(this.questionId, result).subscribe(
            (response: any) => {
              console.log('Element added', response);
              this.snackBar.open('Element added', 'Close', {
                panelClass: ['snackbar-success'],
                duration: 3000
              });
              // add element to array
              const newChoice: Choice = {
                id: response.id,
                choice: response.choice,
                is_correct: false,
              } as Choice;
              this.sortedData?.push(newChoice);
            },
            (error: HttpErrorResponse) => {
              console.error('An error occurred', error);
              this.snackBar.open('An error occurred', 'Close', {
                panelClass: ['snackbar-warning'],
                duration: 3000
              });
            }
          )
        }
      } else {
        console.log('User cancelled element adding');
      }
    });
  }

  rename(id: number){
    console.log('rename action');
    const dialogRef = this.dialog.open(RenameElementComponent, {
      data: { name: this.sortedData?.find((item) => item.id === id)?.choice }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('User submitted value', result);
        const currentIsCorrect = this.sortedData?.find((item) => item.id === id)?.is_correct;
        if(this.questionId && currentIsCorrect !== undefined){
          this.apiService.renamingChoice(id.toString(), result, currentIsCorrect).subscribe(
            (response: any) => {
              console.log('Element renamed', response);
              this.snackBar.open('Element renamed', 'Close', {
                panelClass: ['snackbar-success'],
                duration: 3000
              });
              // update element in array
              this.sortedData = this.sortedData?.map((item) => {
                if(item.id === id){
                  item.choice = response.choice;
                  item.is_correct = response.is_correct;
                }
                return item;
              });
            },
            (error: HttpErrorResponse) => {
              console.log('An error occurred', error);
              this.snackBar.open('An error occurred', 'Close', {
                panelClass: ['snackbar-warning'],
                duration: 3000
              });
            }
          );
        }
      }
    });
  }

  isCorrectToggle(id: number){
    const currentChoice = this.sortedData?.find((item) => item.id === id)?.choice;
    const currentIsCorrect = this.sortedData?.find((item) => item.id === id)?.is_correct;
    if(currentChoice && currentIsCorrect !== undefined){
      this.apiService.isCorrectToggleChoice(id.toString(), currentChoice, currentIsCorrect).subscribe(
        (response: any) => {
          console.log('Is_correct toggled', response);
          this.snackBar.open('Element toggled', 'Close', {
            panelClass: ['snackbar-success'],
            duration: 3000
          });
          // update element in array
          this.sortedData = this.sortedData?.map((item) => {
            if(item.id === id){
              item.choice = response.choice;
              item.is_correct = response.is_correct;
            }
            return item;
          });
        },
        (error: HttpErrorResponse) => {
          console.log('An error occurred', error);
          this.snackBar.open('An error occurred', 'Close', {
            panelClass: ['snackbar-warning'],
            duration: 3000
          });
        }
      );
    }
  }

  delete(id: number){
    console.log('delete action');
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');

        this.apiService.deleteChoice(id.toString()).subscribe(
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
}
