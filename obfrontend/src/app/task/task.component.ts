import { Component, inject, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from '../api.service';
import { Task } from '../api.service';
import { EditTaskComponent } from '../edit-task/edit-task.component';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  category: string = '';
  @Input() taskInfo!: Task;
  readonly dialog = inject(MatDialog)
  constructor(private apiService: ApiService) { }

  deleteTask(taskId: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.apiService.deleteTask(taskId).subscribe()
      }
    })
  }
  editTask() {
    const dialogRef = this.dialog.open(EditTaskComponent, {
      width: '300px',
      data: { taskInfo: this.taskInfo }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result > 0 && result != undefined) {
        this.deleteTask(result)
      }

    })
  }
  setCategory(id_category: string): string {
    if (id_category == '1') {
      this.category = "Urgent"
    } else if (id_category == '2') {
      this.category = "Important"
    } else {
      this.category = "Not Urgent"
    }
    return this.category;
  }
}
