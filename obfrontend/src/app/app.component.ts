import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
