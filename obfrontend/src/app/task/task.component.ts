import { Component, inject, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() taskName!: string;
  @Input() taskId!: string;
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
}
