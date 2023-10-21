import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsService {
  private params: any = {};

  setParams(params: any) {
    this.params = params;
  }

  getParams() {
    return this.params;
  }
}
