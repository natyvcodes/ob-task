import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ApiService } from './api.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  mensaje: Object = {};
  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.apiService.getMessage().pipe(
      map(data => {
        this.mensaje = data;
        console.log(data);
      }),
      catchError(error => {
        console.error('An error occurred:', error);
        return of('Error occurred');
      })
    ).subscribe()
  }
}
