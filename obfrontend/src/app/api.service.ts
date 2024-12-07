import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }
  getMessage() {
    return this.http.get<{ message: string }>(`${this.apiUrl}/`); }
  getCategories(): Observable<String[]> {
    return this.http.get<String[]>(`${this.apiUrl}/categories`)
  }
  getStates(): Observable<String[]> {
    return this.http.get<String[]>(`${this.apiUrl}/states`)
  }
  createTask(taskData: string):Observable<Object[]> {
    return this.http.post<Object[]>(`${this.apiUrl}/addTask`,taskData)
  }
} 
