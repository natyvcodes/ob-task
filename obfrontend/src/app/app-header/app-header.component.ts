import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatDialogModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  openMenu: boolean = true;
  username: string | null = null;
  isLoggedIn: boolean = false
  readonly dialog = inject(MatDialog);
  constructor(private authService: AuthService){
  }
  accountName(){
    if(this.isLoggedIn){
      this.username = this.username;
    }else {
      this.username = "Sign in"
    }
  }

  showMenu() {
    this.openMenu = !this.openMenu;
  }
  showLogin(){
    const dialogRef = this.dialog.open(LoginComponent,{
      width: '320px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  showAccountMenu(){
    alert('Hola')
  }
  ngOnInit(): void {
    this.authService.userLoggedInC.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn
    });
    this.authService.userName$.subscribe((username:string | null) => {
      this.username = username;
    })
    console.log(this.isLoggedIn);
    this.accountName();
  }
}
