import { Component, Input } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() taskName!: string;

  deleteTask(){
    
  }
}
