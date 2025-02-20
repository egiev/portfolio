import { ElementRef, inject, Injectable, NgZone } from '@angular/core';
import gsap from 'gsap';
import { fromEvent } from 'rxjs';
import { Canvas } from './canvas';

@Injectable({ providedIn: 'root' })
export class HomeAnimationService {
  private readonly zone = inject(NgZone);

  private canvas!: Canvas;

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
    let currentSection = 0;

    fromEvent(window, 'scroll').subscribe(() => {
      const scrollY = window.scrollY;
      const newSection = Math.round(scrollY / innerHeight);

      if (newSection !== currentSection) {
        currentSection = newSection;
        gsap.to(this.canvas.brain.position, {
          duration: 0.7,
          y: -this.canvas.objectDistance * currentSection,
          x: newSection % 2 === 0 ? Math.abs(1.5) : -Math.abs(1.5),
          ease: 'power3.inOut',
        });
      }

      this.canvas.scrollY = scrollY;
    });
  }

  private mousemove() {
    fromEvent(window, 'mousemove').subscribe((e) => {
      const x = (e as MouseEvent).clientX / innerWidth - 0.5;
      const y = -((e as MouseEvent).clientY / innerHeight - 0.5);
      this.canvas.cursor = { x, y };
    });
  }
}
