import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../api.service';
import { catchError, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { TaskAddedDialogComponent } from '../task-added-dialog/task-added-dialog.component';
import { AuthService } from '../auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from '../api.service';
@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  state: any[] = []
  category: any[] = []
  name_category: String[] = []
  id_c: number[] = []
  name_state: String[] = []
  id_s: number[] = []
  myForm: FormGroup;
  formSend: boolean = false;
  userId: string | null = '';
  taskData: Task[] = []
  isLoggedIn: boolean = false;

  constructor(private apiService: ApiService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddtaskComponent>,
    private authService: AuthService) {
    this.myForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      id_state: ['', Validators.required],
      id_category: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) { this.taskData = JSON.parse(storedTasks); }
    forkJoin({
      categories: this.apiService.getCategories().pipe(
        map(data => {
          this.category = data;
          this.name_category = this.category.map(c => c.description)
          this.id_c = this.category.map(c => c.id)
        }),
        catchError(error => {
          console.error('An error occurred:', error)
          return of('Error occurred')
        })
      ),
      states: this.apiService.getStates().pipe(
        map(data => {
          this.state = data;
          this.name_state = this.state.map(c => c.description)
          this.id_s = this.state.map(c => c.id)
        }),
        catchError(error => {
          console.error('An error occurred:', error)
          return of('Error occurred')
        })
      )
    }).subscribe()

  }
  submitForm() {
    this.authService.userLoggedInC.subscribe((isloggedIn: boolean) => {
      this.isLoggedIn = isloggedIn;
    })
    for (let i = 0; i < this.name_state.length; i++) {
      if (this.name_state[i] == this.myForm.get('id_state')?.value) {
        this.myForm.get('id_state')?.setValue(this.id_s[i]);
      }
    }
    for (let i = 0; i < this.category.length; i++) {
      if (this.name_category[i] === this.myForm.get('id_category')?.value) {
        this.myForm.get('id_category')?.setValue(this.id_c[i]);
      }
    }
    if (this.isLoggedIn) {
      this.userId = localStorage.getItem('userId');
      this.myForm.get('user_id')?.setValue(this.userId)
      if (this.myForm.valid) {
        const data = this.myForm.value;
        this.apiService.createTask(data).subscribe({
          next: response => {
            this.myForm.reset();
            this.formSend = true;
            this.taskAdded(this.formSend);
            this.dialogRef.close(response);
          },
          error: error => {
            alert('Error al añadir la tarea: ' + error.message);
          }
        }
        );
      } else {
        alert('completa todos los campos')
      }

    } else {
      this.userId = 'default'
      this.myForm.get('user_id')?.setValue(this.userId)
      if (this.myForm.valid) {
        const localTaskData: Task = this.myForm.value;
        this.apiService.addLocalTasks(localTaskData)
        this.dialogRef.close();
        this.myForm.reset()
      } else {
        alert('completa todos los campos')
      }

    }



  }
  taskAdded(confirm: boolean) {
    if (confirm) {
      const dialogRef = this.dialog.open(TaskAddedDialogComponent);
    }

  }
}
