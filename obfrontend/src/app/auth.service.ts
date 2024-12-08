import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  public userLoggedInC = this.userLoggedIn.asObservable();
  private userName = new BehaviorSubject<string | null>(null);
  public userName$ = this.userName.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }
  private checkToken(): void {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName'); if (token && name) {
      this.userLoggedIn.next(true);
      this.userName.next(name);
    } else {
      this.userLoggedIn.next(false);
      this.userName.next(null);
    }
  }
  private saveToken(token: string, name: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    this.userName.next(name);
    this.userLoggedIn.next(true);
  }

  login(email: string, password: string) {
    return this.http.post<{ message: string; token: string, name: string }>(`${this.apiUrl}/login`, {
      email,
      password,
    }).pipe(
      tap(response => {
        this.saveToken(response.token, response.name);
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    this.userLoggedIn.next(false);
  }

}

