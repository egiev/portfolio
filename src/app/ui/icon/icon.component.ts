import { Component, input } from '@angular/core';

export type Icon = 'facebook' | 'instagram' | 'linkedin' | 'github';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  icon = input.required<Icon>();
  size = input<number>(24);
}
