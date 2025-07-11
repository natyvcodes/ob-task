import { Component, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog} from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, MatButtonModule, MatDialogModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  RegisterForm: FormGroup;
  passwordMatch!: boolean;
  passwordIsValid!: boolean;
  emailIsValid!: boolean;
  errorMessage: string = ''
  readonly dialog = inject(MatDialog);

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private dialogRef: DialogRef, private router: Router) {
    this.RegisterForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })

  }
  ngOnInit(): void {
    this.verifyPassword()
    this.verifyEmail()


  }
  submitForm() {
      if(this.emailIsValid && this.passwordIsValid && this.passwordMatch && this.RegisterForm.valid){
        const name = this.RegisterForm.get('name')?.value;
        const email = this.RegisterForm.get('email')?.value;
        const password = this.RegisterForm.get('password')?.value;
        this.authService.registerUser(name, email,password).subscribe({
          next: (response) => {
            this.dialogRef.close()
            this.authService.login(email, password).subscribe({
              next: (response) => {
                this.dialogRef.close()
                this.router.navigate(['/My-Tasks'])
              },
              error: (err) => {
                this.errorMessage = err.error.message || 'Invalid email or password';
                console.error('Error during login:', err);
              }
            })
            this.router.navigate(['/My-Tasks'])
          },
          error: (err) => {
            this.errorMessage = err.error.message || 'User is not register';
            console.error('Error during register:', err);
          }
        })
      }else {
      }
  }
  private verifyPassword(){
    const passwordControl = this.RegisterForm.get('password')
    const confirmPasswordControl = this.RegisterForm.get('confirmPassword')
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
    passwordControl?.valueChanges.subscribe((password)=>{
      if(regex.test(password)){
        confirmPasswordControl?.valueChanges.subscribe((confirmPassword)=> {
          if(password == confirmPassword && password != ''){
            this.passwordMatch = true;
          }else {
            this.passwordMatch = false;
          }
        })
        this.passwordIsValid = true;
      }else {
        this.passwordIsValid = false;
      }
    })
    
  }
  private verifyEmail(){
    const emailControl = this.RegisterForm.get('email');
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    emailControl?.valueChanges.subscribe((email) =>{
        if(emailRegex.test(email)){
          this.emailIsValid = true;
        }else {
          this.emailIsValid = false;
        }
    })
  }
  openLogIn() { 
    this.dialogRef.close()
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '360px'
    });
   
  }
}
