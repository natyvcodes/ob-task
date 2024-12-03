import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  mensaje:string = '';
  constructor (private apiService: ApiService){}
  ngOnInit(): void {
    this.apiService.getMessage().subscribe(
      (data: any) => {
        this.mensaje = data;
        console.log(data);
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }
}
