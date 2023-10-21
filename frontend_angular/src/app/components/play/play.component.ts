import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from "../../services/api/api.service";
import {ActivatedRoute} from "@angular/router";
import {QueryParamsService} from "../../services/query-params/query-params.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy{
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private queryParamsService: QueryParamsService
  ) {
  }

  ngOnInit(): void {
    const params = this.queryParamsService.getParams();
    console.log(params);
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
