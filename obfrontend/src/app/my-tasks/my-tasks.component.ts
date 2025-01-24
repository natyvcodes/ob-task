import { Component, inject, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddtaskComponent } from '../addtask/addtask.component';
import { AuthService } from '../auth.service';
import { ApiService } from '../api.service';
import { TaskComponent } from '../task/task.component';
import { Task } from '../api.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, TaskComponent],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isLoggedIn: boolean = false;
  taskData: Task[] = [];
  userId: string | null = '';
  taskInfo!: Task;

  constructor(private authService: AuthService, private apiService: ApiService) {}


  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.authService.userLoggedInC.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn; 
      if (loggedIn) {
        localStorage.removeItem('tasks')
        this.apiService.userTask$.subscribe(tasks => {
          this.taskData = tasks.flat().sort((a, b) => this.sortByCategoria(a, b));
        });
      } else {
        this.apiService.task$.subscribe((tasks: Task[]) => {
          this.taskData = tasks.flat().sort((a, b) => this.sortByCategoria(a, b));
        })
      }
    });


  }
  showTaskRegister() {
    const dialogRef = this.dialog.open(AddtaskComponent,{
      width:'370px'
    });
  
  }
  sortByCategoria(a: Task, b: Task): number {
    return a.id_category - b.id_category; 
  }
}
