import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../services/api/api.service";
import {Question} from "./question.interface";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {Sort} from "@angular/material/sort";
import {NewElementComponent} from "../../modal-dialogs/new-element/new-element.component";
import {HttpErrorResponse} from "@angular/common/http";
import {RenameElementComponent} from "../../modal-dialogs/rename-element/rename-element.component";
import {DeleteConfirmationComponent} from "../../modal-dialogs/delete-confirmation/delete-confirmation.component";
import {ManageMediaComponent} from "../../modal-dialogs/manage-media/manage-media.component";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit{
  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  public quizzId: string | null = null;
  public data: Question[] = [];
  public sortedData : Question[] | undefined;

  ngOnInit() {
    console.log('QuestionsComponent');
    this.quizzId = this.route.snapshot.queryParamMap.get('id');
    if(this.quizzId){
      this.apiService.getQuestions(this.quizzId).subscribe(
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
        case 'question':
          return compare(a.question, b.question, isAsc);
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
        if(this.quizzId){
          this.apiService.addingQuestion(this.quizzId, result).subscribe(
            (response: any) => {
              console.log('Element added', response);
              this.snackBar.open('Element added', 'Close', {
                panelClass: ['snackbar-success'],
                duration: 3000
              });
              // add element to array
              const newQuestion: Question = {
                id: response.id,
                question: response.question,
                media: response.media
              } as Question;
              this.sortedData?.push(newQuestion);
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
      data: { name: this.sortedData?.find((item) => item.id === id)?.question }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('User submitted value', result);

        this.apiService.renamingQuestion(id.toString(), result).subscribe(
          (response: any) => {
            console.log('Element renamed', response);
            this.snackBar.open('Element renamed', 'Close', {
              panelClass: ['snackbar-success'],
              duration: 3000
            });
            // update element in array
            this.sortedData = this.sortedData?.map((item) => {
              if(item.id === id){
                item.question = response.question;
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
    });
  }

  edit(id: number){
    console.log('edit action');
    this.router.navigate(['/choices'], { queryParams: { id: id } });
  }

  manageMedia(id: number){
    console.log('manage media action');
    const dialogRef = this.dialog.open(ManageMediaComponent, {
      data: this.sortedData?.find((item) => item.id === id)?.media
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed!');
      if(result!==''){
        const modalResult = result;
        console.log('modalResult', modalResult);
        if(modalResult && modalResult.erase){
          console.log('start erasing media');
          // erase media
          this.apiService.removingMedia(this.sortedData?.find((item) => item.id === id)?.media.id.toString()).subscribe(
            (response: any) => {
              console.log('Media removed', response);
              this.snackBar.open('Media removed', 'Close', {
                panelClass: ['snackbar-success'],
                duration: 3000
              });
              this.sortedData = this.sortedData?.map((item) => {
                if(item.id === id){
                  item.media = {};
                }
                return item;
              });
            },
            (error: HttpErrorResponse) => {
              console.log('an error occurred', error);
              this.snackBar.open('An error occurred', 'Close', {
                panelClass: ['snackbar-warning'],
                duration: 3000
              });
            }
          );
        }else{
          console.log('start updating media');
          if(modalResult && modalResult.base64 && modalResult.fileName && modalResult.base64!=='' && modalResult.fileName!==''){
            // update media
            // updatingQuestionMedia(id: string, question: string, media: string, mediaName: string)
            const thisQuestion = this.sortedData?.find((item) => item.id === id)?.question;
            console.log('thisQuestion', thisQuestion);
            if(thisQuestion){
              this.apiService.updatingQuestionMedia(id.toString(), thisQuestion, modalResult.base64, modalResult.fileName).subscribe(
                (response: any) => {
                  console.log('Media updated', response);
                  this.snackBar.open('Media updated', 'Close', {
                    panelClass: ['snackbar-success'],
                    duration: 3000
                  });
                  this.sortedData = this.sortedData?.map((item) => {
                    if(item.id === id){
                      item.media = response.media;
                    }
                    return item;
                  });
                },
                (error: HttpErrorResponse) => {
                  console.log('an error occurred', error);
                  this.snackBar.open('An error occurred', 'Close', {
                    panelClass: ['snackbar-warning'],
                    duration: 3000
                  });
                }
              );
            }
          }
        }
      }else{
        console.log('User cancelled media management');
      }
    });
  }

  delete(id: number){
    console.log('delete action');
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User confirmed deletion');

        this.apiService.deleteQuestion(id.toString()).subscribe(
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
