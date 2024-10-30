import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  openMenu:boolean = false;
  mensaje() {
    this.openMenu = !this.openMenu;
  }
}
