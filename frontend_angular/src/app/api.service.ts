import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000';


  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    const url = `${this.apiUrl}/users`;
    return this.http.post(url, data);
  }

  login(data: any): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post(url, data);
  }

  confirmAccount(data: any): Observable<any> {
    const url = `${this.apiUrl}/users/confirm-account`;
    return this.http.post(url, data);
  }
}
