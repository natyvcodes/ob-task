import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  readonly dialog = inject(MatDialog)
  username: string | null = localStorage.getItem('userName')
  useremail: string | null = localStorage.getItem('userEmail')
  constructor(private authService: AuthService, private router: Router) { }
  deleteAccount() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { text: 'Are you sure you want to delete you account?' }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result > 0 && result != undefined) {
        this.authService.userId$.subscribe(
          userid => {
            console.log(userid)
            this.authService.deleteUser(userid).subscribe()
            this.router.navigate([''])
          }
        )
      }
    })
  }
}
