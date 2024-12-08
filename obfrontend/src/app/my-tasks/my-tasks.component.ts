import { Component, inject, OnInit } from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddtaskComponent } from '../addtask/addtask.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService){}
    showTaskRegister(){
    const dialogRef = this.dialog.open(AddtaskComponent,{
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit(): void {
    this.authService.userLoggedInC.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn
    });
    console.log(this.isLoggedIn);
  }
}