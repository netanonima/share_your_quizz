import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { QueryParamsService } from '../../services/query-params/query-params.service';

@Injectable({
  providedIn: 'root'
})
export class PlayGuard implements CanActivate {
  constructor(private router: Router, private queryParamsService: QueryParamsService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('PlayGuard activated');
    this.queryParamsService.setParams(route.queryParams);
    this.router.navigate([{ outlets: { playOutlet: ['play'] } }]);
    return true;
  }
}
