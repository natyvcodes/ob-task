import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,MatDialogModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  @ViewChild('textareaRef') textareaRef!: ElementRef<HTMLTextAreaElement>;
  taskInfo!: Task;
  category: string[] = ["","Urgent", "Important", "Not Urgent"]
  editOpen: boolean = true;
  EditForm: FormGroup;


  constructor(private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) data: { taskInfo: Task }, private dialogRef: MatDialogRef<EditTaskComponent>) {
    this.taskInfo = data.taskInfo
    this.EditForm =  this.formBuilder.group({

    })
  }
  submitForm(){

  }
  setCategory(id_category: number): string {
      const category: string = this.category[id_category]
      return category
  }
  getRemainingCategories(selectedId: number): string[] {
    return this.category.filter((_, index) => index !== selectedId && index > 0); // Excluimos el índice `0` vacío
  }
  closeDialog(taskId: string): void {
    this.dialogRef.close(taskId);
  }
  editInfo() {
    this.editOpen = !this.editOpen;
    console.log(this.editOpen)
    if(!this.editOpen) {
        this.textareaRef.nativeElement.focus();
    }
  }
}
