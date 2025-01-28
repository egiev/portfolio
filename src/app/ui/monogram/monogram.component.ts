import { Component, input } from '@angular/core';

@Component({
  selector: 'app-monogram',
  imports: [],
  templateUrl: './monogram.component.html',
  styleUrl: './monogram.component.scss',
})
export class MonogramComponent {
  highlight = input<boolean>(false);
}
