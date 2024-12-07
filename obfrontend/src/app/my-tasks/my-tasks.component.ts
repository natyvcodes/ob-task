import { Component, inject } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddtaskComponent } from '../addtask/addtask.component';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent {
    existTasks: boolean = false;
    readonly dialog = inject(MatDialog);
    showTaskRegister(){
    const dialogRef = this.dialog.open(AddtaskComponent,{
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}