import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-task-added-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './task-added-dialog.component.html',
  styleUrl: './task-added-dialog.component.css'
})
export class TaskAddedDialogComponent {

}
