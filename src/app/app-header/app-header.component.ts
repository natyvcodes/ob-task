import { Component, ElementRef, afterRender } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  openMenu: boolean = true;
  showMenu() {
    this.openMenu = !this.openMenu;
  }
}