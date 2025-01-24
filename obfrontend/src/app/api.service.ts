import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Task {
  id: string;
  name: string;
  description: string;
  user_id: string;
  id_state: number;
  id_category: number;
}
export type UpdateTask = Omit<Task, "user_id">

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  private userId: string = '';

  public userTasks = new BehaviorSubject<Task[]>([]);
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
  updateTask(updateTask: UpdateTask): Observable<UpdateTask> {
    return this.http.post<UpdateTask>(`${this.apiUrl}/updateTask`, updateTask).pipe(
      map(updatedTask => {
        const currentTasks = this.userTasks.getValue();
        const taskIndex = currentTasks.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          const updatedTasks = [...currentTasks];
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updatedTask };
          this.userTasks.next(updatedTasks);
        }

        return updatedTask;
      })
    );
  }





  deleteTask(id: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.apiUrl}/deleteTask`, { id }).pipe(
      map(response => {
        const currentTasks = this.userTasks.getValue().flat();
        const updatedTasks = currentTasks.filter(task => String(task.id) !== String(response.id));
        this.userTasks.next(updatedTasks);
        return response;
      })
    );
  }

  getUserTask(userId: string | null): Observable<Task[]> {
    return this.http.post<Task[]>(`${this.apiUrl}/userTasks`, { id: userId }).pipe(
      map(tasks => {
        this.userTasks.next(tasks);
        return tasks;
      })
    );
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
  private updateTasks() {
    if (this.userId) {
      this.getUserTask(this.userId).subscribe();
    }
  }
}
