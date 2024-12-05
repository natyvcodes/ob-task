import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [],
  templateUrl: './addtask.component.html',
  styleUrl: './addtask.component.css'
})
export class AddtaskComponent implements OnInit {
  category: any[] = []
  description: String[] = []
  ids: number[] = []
  constructor(private apiService: ApiService) { }
  ngOnInit(): void {
    this.apiService.getCategories().pipe(
      map(data => {
        this.category = data;
        this.description =  this.category.map(c => c.description)
        this.ids = this.category.map(c => c.id)
      }),
      catchError(error => {
        console.error('An error occurred:', error)
        return of('Error occurred')
      })
    ).subscribe()
  }
}
