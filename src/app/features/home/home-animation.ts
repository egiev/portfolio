import { ElementRef, inject, Injectable, NgZone } from '@angular/core';
import gsap from 'gsap';
import { fromEvent } from 'rxjs';
import { Canvas } from './canvas';

@Injectable({ providedIn: 'root' })
export class HomeAnimationService {
  private readonly zone = inject(NgZone);

  private canvas!: Canvas;
  private scrollY = 0;
  private currentSection = 0;
  private objectDistance = 4;
  private cursor = { x: 0, y: 0 };

  async init(elementRef: ElementRef<HTMLElement>) {
    this.canvas = new Canvas(elementRef);

    this.registerListener();
    this.zone.runOutsideAngular(() => this.tick());
  }

  private tick() {
    this.canvas.update();
    requestAnimationFrame(() => this.tick());
  }

  private registerListener() {
    this.resize();
    this.scroll();
    this.mousemove();
  }

  private resize() {
    fromEvent(window, 'resize').subscribe(() => {
      this.canvas.resize(innerWidth, innerHeight);
    });
  }

  private scroll() {
    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollY = window.scrollY;
      const newSection = Math.round(this.scrollY / innerHeight);

      if (newSection !== this.currentSection) {
        this.currentSection = newSection;
        gsap.to(this.canvas.brain.position, {
          duration: 0.7,
          y: -this.objectDistance * this.currentSection,
          x: newSection % 2 === 0 ? Math.abs(1.5) : -Math.abs(1.5),
          ease: 'power3.inOut',
        });
      }

      this.canvas.scroll(this.scrollY, this.objectDistance);
    });
  }

  private mousemove() {
    fromEvent(window, 'mousemove').subscribe((e) => {
      this.cursor.x = (e as MouseEvent).clientX / innerWidth - 0.5;
      this.cursor.y = -((e as MouseEvent).clientY / innerHeight - 0.5);
      this.canvas.mousemove(this.cursor);
    });
  }
}
