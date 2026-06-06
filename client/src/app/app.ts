import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './core/layout/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  collapsed: boolean = false;
  protected readonly title = signal('client');

  openIconUrl: string = 'assets/images/icons/chevron-right.svg'
  closedIconUrl: string = 'assets/images/icons/chevron-left.svg'
}
