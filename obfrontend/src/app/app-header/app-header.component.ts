import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentRef } from '@angular/core';


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
  openAccountMenu: boolean = true;
  readonly dialog = inject(MatDialog);
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userLoggedInC.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn
      this.accountName()
    });
    this.authService.userName$.subscribe((username: string | null) => {
      this.username = username;
    })
    this.accountName();
  }
  accountName() {
    if (this.isLoggedIn) {
      this.username = this.username;
    } else {
      this.username = "Log in"
    }
  }

  showMenu() {
    this.openMenu = !this.openMenu;
  }
  showLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '340px'});
    this.showMenu()
  }
  showAccountMenu() {
    this.openAccountMenu = !this.openAccountMenu;
  }
  logOut() {
    this.authService.logout()
  }
  onLinkClick(): void {
    this.showMenu();
  }
}
