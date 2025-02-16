import {
  Component,
  ElementRef,
  inject,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import gsap from 'gsap';
import { fromEvent } from 'rxjs';
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { Timer } from 'three/addons/misc/Timer.js';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild('webgl', { static: true }) canvas!: ElementRef<HTMLElement>;
  zone = inject(NgZone);
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  timer: Timer = new Timer();

  mesh!: Object3D;

  scrollY = window.scrollY;
  objectDistance = 4;

  ngOnInit(): void {
    // Scene
    this.scene = new Scene();

    // Camera
    this.camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 5);
    this.camera.aspect = innerWidth / innerHeight;

    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);

    this.initModels();
    this.registerListener();
    this.zone.runOutsideAngular(() => this.tick());
  }

  private initModels() {
    // Object
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial();
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.x = 2;
    this.mesh.position.y = -this.objectDistance * 0;
    this.scene.add(this.mesh);
  }

  private tick() {
    // Timer
    this.timer.update();

    // Camera
    this.camera.position.y =
      (-this.scrollY / innerHeight) * this.objectDistance;

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.tick());
  }

  private registerListener() {
    this.resize();
    this.scroll();
  }

  private scroll() {
    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollY = window.scrollY;

      const currentSection = Math.floor(this.scrollY / innerHeight);

      gsap.to(this.mesh.position, {
        duration: 0.7,
        y: -this.objectDistance * currentSection,
        ease: 'power3.inOut',
      });
      console.log(currentSection);
    });
  }

  private resize() {
    fromEvent(window, 'resize').subscribe(() => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(innerWidth, innerHeight);
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });
  }
}
