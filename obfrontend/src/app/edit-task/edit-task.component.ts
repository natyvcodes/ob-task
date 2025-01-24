import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UpdateTask } from '../api.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatDialogModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  taskInfo!: Task;
  category: string[] = ["", "Urgent", "Important", "Not Urgent"]
  state: string[] = ["", "Pending", "In Process", "Complete"]
  editOpen: boolean = true;
  EditForm: FormGroup;
  isLoggedIn: boolean = false;
  taskUpdated!: UpdateTask;

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: { taskInfo: Task },
    private dialogRef: MatDialogRef<EditTaskComponent>,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.taskInfo = data.taskInfo
    this.EditForm = this.formBuilder.group({
      name: [this.taskInfo.name, Validators.required],
      description: [this.taskInfo.description, Validators.required],
      id_category: [this.taskInfo.id_category, Validators.required],
      id_state: [this.taskInfo.id_state, Validators.required],
      id: [this.taskInfo.id, Validators.required]
    })
  }
  submitForm() {
    this.authService.userLoggedInC.subscribe((isloggedIn: boolean) => {
      this.isLoggedIn = isloggedIn;
    })
    if (this.EditForm.valid && this.isLoggedIn) {
      this.taskUpdated = this.EditForm.value;
      this.apiService.updateTask(this.taskUpdated).subscribe()

    }
  }
  getCategories(): { index: number, value: string }[] {
    return this.category
      .map((value, index) => ({ index, value }))
      .filter((item, index, self) => item.index !== 0 && self.findIndex(t => t.index === item.index) === index);  // Asegura índices únicos
  }
  getStates(): { index: number, value: string }[] {
    return this.state
      .map((value, index) => ({ index, value }))
      .filter((item, index, self) => item.index !== 0 && self.findIndex(t => t.index === item.index) === index);  // Asegura índices únicos
  }
  
  closeDialog(taskId: string): void {
    this.dialogRef.close(taskId);
  }
  editInfo() {
    this.editOpen = !this.editOpen;
    if (!this.editOpen) {
      this.textareaRef.nativeElement.focus();
    }
  }
}
