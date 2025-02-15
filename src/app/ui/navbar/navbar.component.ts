import { Component } from '@angular/core';
import { IconComponent } from '@ui/icon';
import { MonogramComponent } from '@ui/monogram';
import { NAV_LINKS, SOCIAL_MEDIAS } from './navbar.constant';

@Component({
  selector: 'app-navbar',
  imports: [MonogramComponent, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public readonly navLinks = NAV_LINKS;
  public readonly socialMedias = SOCIAL_MEDIAS;
}
