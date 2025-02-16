import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@ui/navbar';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <ng-container>
      <app-navbar />
      <router-outlet />
    </ng-container>
  `,
})
export class AppComponent {}
