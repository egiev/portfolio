import { Component } from '@angular/core';
import { MonogramComponent } from '@ui/monogram';

@Component({
  selector: 'app-navbar',
  imports: [MonogramComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
