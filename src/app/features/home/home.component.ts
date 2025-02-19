import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HomeAnimationService } from './home-animation';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('webgl', { static: true }) canvas!: ElementRef<HTMLElement>;
  private readonly homeAnimationService = inject(HomeAnimationService);

  async ngOnInit(): Promise<void> {
    await this.homeAnimationService.init(this.canvas);
  }
}
