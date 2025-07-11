import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  myLogin: FormGroup;
  errorMessage: string | null = null;
  readonly dialog = inject(MatDialog);

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>) {
    this.myLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  submitForm() {
    if (this.myLogin.valid) {
      const email: string = this.myLogin.get('email')?.value;
      const password: string = this.myLogin.get('password')?.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login successful, token:', response.token);
          this.dialogRef.close()
          this.router.navigate(['/My-Tasks'])
        },
        error: (err) => {
          this.errorMessage = err || 'Invalid email or password';
        }
      })
    } else {
      this.errorMessage = 'Please fill out the form correctly';
    }
  }
  openRegister() { 
    this.dialogRef.close()
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '360px'
    });
   
  }
}
