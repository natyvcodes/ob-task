import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../auth.service';
import {MatTooltipModule} from '@angular/material/tooltip';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ MatDialogModule, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly dialog = inject(MatDialog);
  userIsLogged: boolean = false;
  
  constructor(private authService: AuthService){
    this.authService.userLoggedInC.subscribe(
      userlogged => {
        this.userIsLogged = userlogged;
      }
    )
  }
  showLogin(){
    const dialogRef = this.dialog.open(RegisterComponent,{
      width: '360px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
