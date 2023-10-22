import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy{
  error: boolean = false;
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('id');
    if(sessionId && sessionId!=null){
      this.apiService.getSession(sessionId).subscribe(
        (result) => {
          console.log('Session retrieved');
          console.log(result);
          this.error = false;
        },
        (error) => {
          console.log(error);
          this.error = true;
        }
      );
    }else{

    }
  }

  ngOnDestroy() {
    console.log('PlayComponent destroyed');
    const sessionId = this.route.snapshot.queryParamMap.get('id');
    if(sessionId && sessionId!=null){
      this.apiService.deleteSession(sessionId).subscribe(
        (result) => {
          console.log('Session deleted');
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  navigateToQuizzes() {
    this.router.navigate([{ outlets: { playOutlet: null } }]).then(() => {
      // Étape 2: Naviguez vers la nouvelle route
      this.router.navigate(['/quizzes']);
    });
  }
}
