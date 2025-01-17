import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface Task {
  id: string;
  name: string;
  description: string;
  user_id: string;
  id_state: string;
  id_category: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  private userId: string = '';

  private userTasks = new BehaviorSubject<Task[]>([]);
  public userTask$ = this.userTasks.asObservable();

  private Tasks = new BehaviorSubject<Task[]>([]);
  public task$ = this.Tasks.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.userId$.subscribe((userId: string) => {
      this.userId = userId;
      this.updateTasks();
    });
  }

  getMessage() {
    return this.http.get<{ message: string }>(`${this.apiUrl}/`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  getStates(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/states`);
  }

  createTask(taskData: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/addTask`, taskData).pipe(
      map(newTask => {
        const currentTasks = this.userTasks.getValue();
        this.userTasks.next([...currentTasks, newTask]);
        return newTask;
      })
    );
  }
  deleteTask(id: number) {
    return this.http.post<{id: number}>(`${this.apiUrl}/deleteTask`, id)
  }
  getUserTask(userId: string | null): Observable<Task[]> {
    return this.http.post<Task[]>(`${this.apiUrl}/userTasks`, { id: userId }).pipe(
      map(tasks => {
        this.userTasks.next(tasks);
        return tasks;
      })
    );
  }
  private updateTasks() {
    if (this.userId) {
      this.getUserTask(this.userId).subscribe();
    }
  }
  addLocalTasks(newTask: Task) {
    const currentTasks = this.getLocalTask();
    if (!Array.isArray(currentTasks)) {
      console.error('Expected an array from getLocalTask, but got:', currentTasks);
      return;
    }
    currentTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(currentTasks));
    this.Tasks.next(currentTasks);
  }
  
  private getLocalTask(): Task[] {
    const storedTasks = localStorage.getItem('tasks');
    try {
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (e) {
      console.error('Error parsing tasks from localStorage', e);
      return [];
    }
  }
  
}
