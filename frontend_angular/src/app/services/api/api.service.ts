import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BACKEND_URL} from "../../constants";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = BACKEND_URL;

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

  // page quizzes
  getQuizzes(): Observable<any> {
    const url = `${this.apiUrl}/quizzs`;
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

  renamingQuizz(id: string, quizz: string): Observable<any> {
    const url = `${this.apiUrl}/quizzs/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    const data = {
      quizz: quizz
    };
    return this.http.put<any>(url, data, { headers });
  }

  // page questions
  getQuestions(id: string): Observable<any> {
    const url = `${this.apiUrl}/questions/quizz/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.get<any>(url, { headers });
  }

  deleteQuestions(id: string): Observable<any> {
    const url = `${this.apiUrl}/questions/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    return this.http.delete<any>(url, { headers });
  }

  addingQuestions(question: string): Observable<any> {
    const url = `${this.apiUrl}/questions`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('api_token')}`
    });
    const data = {
      question: question
    };
    return this.http.post<any>(url, data, { headers });
  }

  // page choices


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
