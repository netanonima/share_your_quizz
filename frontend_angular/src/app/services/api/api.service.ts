import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  resetPasswordRetrieve(data: any): Observable<any> {
    const url = `${this.apiUrl}/users/forgot-password-retrieve`;
    return this.http.post(url, data);
  }

  resetPassword(data: any): Observable<any> {
    const url = `${this.apiUrl}/users/forgot-password`;
    return this.http.post(url, data);
  }

  getQuizzes(): Observable<any> {
    const url = `${this.apiUrl}/quizzs`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.get<any>(url, { headers });
  }

  getQuizz(id: string): Observable<any> {
    const url = `${this.apiUrl}/quizzs/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.get<any>(url, { headers });
  }

  deleteQuizz(id: string): Observable<any> {
    const url = `${this.apiUrl}/quizzs/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.delete<any>(url, { headers });
  }

  addingQuizz(quizz: string): Observable<any> {
    const url = `${this.apiUrl}/quizzs`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    const data = {
      quizz: quizz
    };
    return this.http.post<any>(url, data, { headers });
  }

  startSession(id: string): Observable<any> {
    const url = `${this.apiUrl}/sessions`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.post<any>(url, {
      quizzId: parseInt(id)
    }, { headers });
  }

  deleteSession(id: string): Observable<any> {
    const url = `${this.apiUrl}/sessions/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.delete<any>(url, { headers });
  }

  getSession(id: string): Observable<any> {
    const url = `${this.apiUrl}/sessions/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.get<any>(url, { headers });
  }
}
