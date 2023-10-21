import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnDestroy{
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) {
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
}
