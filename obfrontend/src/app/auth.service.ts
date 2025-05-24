import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError, map } from 'rxjs';
import { environment } from '../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private userLoggedIn = new BehaviorSubject<boolean>(false);
  public userLoggedInC = this.userLoggedIn.asObservable();

  private userName = new BehaviorSubject<string | null>(null);
  public userName$ = this.userName.asObservable();

  private userId = new BehaviorSubject<string>('');
  public userId$ = this.userId.asObservable();

  private userConfirmPass = new BehaviorSubject<string>('');
  public userConfirmPass$ = this.userConfirmPass.asObservable();

  private errorMessage = new BehaviorSubject<string>('');
  public errorMessage$ = this.errorMessage.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }
  private checkToken(): void {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    const id = localStorage.getItem('userId')

    if (token && name && id) {
      this.userLoggedIn.next(true);
      this.userName.next(name);
      this.userId.next(id)
    } else {
      this.userLoggedIn.next(false);
      this.userName.next(null);
      this.userId.next('')
    }
  }
  private saveToken(token: string, name: string, id: string, email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', id)
    localStorage.setItem('userEmail', email);
    this.userName.next(name);
    this.userLoggedIn.next(true);
    this.userId.next(id)
  }

  login(email: string, password: string) {
    return this.http.post<{ message: string; token: string, name: string, id: string, email: string  }>(`${this.apiUrl}/login`, {
      email,
      password,
    }).pipe(
      tap(response => {
        this.saveToken(response.token, response.name, response.id, response.email);
      }),
      catchError(error => {
        const errorMsg = error.error?.message || 'Invalid email or password';
        this.errorMessage.next(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  registerUser(name: string, email: string, password: string) {
    return this.http.post<{ name: string, email: string, password: string }>(`${this.apiUrl}/registerUser`, {
      name, email, password
    }).pipe(
      tap(response => {
        this.login(response.email, response.password)
      })
    )
  }
  deleteUser(id: string): Observable<{ id: string }> {
      return this.http.post<{ id: string }>(`${this.apiUrl}/deleteUser`, { id }).pipe(
        map(response => {
          this.logout()
          return response;
        })
      );
    }
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
    this.userLoggedIn.next(false);
  }



}

