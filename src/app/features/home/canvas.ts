import { ElementRef } from '@angular/core';
import {
  AmbientLight,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
} from 'three';
import { Timer } from 'three/examples/jsm/misc/Timer.js';
import { Brain } from './brain';
import { Particle } from './particle';

export class Canvas {
  private scene!: Scene;
  private cameraGroup!: Group;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private raycaster!: Raycaster;
  private timer: Timer = new Timer();
  private delta!: number;

  brain!: Brain;
  particles!: Particle;

  private _objectDistance = 4;
  private _cursor = { x: 0, y: 0 };
  private _scrollY = 0;

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    this.init();
    this.initModels();
  }

  private init() {
    // Scene
    this.scene = new Scene();

    // Camera group
    this.cameraGroup = new Group();
    this.scene.add(this.cameraGroup);

    // Camera
    this.camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.camera.aspect = innerWidth / innerHeight;
    this.cameraGroup.add(this.camera);

    const ambientLight = new AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 0, 4);
    this.scene.add(directionalLight);

    // Raycaster
    // this.raycaster = new Raycaster();
    // // this.raycaster.setFromCamera(
    // //   new Vector2(this.cursor.x, this.cursor.y),
    // //   this.camera,
    // // );
    // //
    // this.raycaster.setFromCamera(
    //   new Vector2(0, 0),
    //   this.camera,
    // );

    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.elementRef.nativeElement,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  private initModels() {
    this.brain = new Brain();
    this.brain.position.x = 1.5;
    this.brain.position.y = -this.objectDistance * 0;
    this.brain.rotation.y = Math.PI * 0.25;
    this.scene.add(this.brain);

    this.particles = new Particle(350, this.objectDistance);
    // this.scene.add(this.particles);
  }

  update() {
    this.timer.update();
    this.delta = this.timer.getDelta();

    // Camera
    this.camera.position.y =
      (-this._scrollY / innerHeight) * this.objectDistance;

    // Parallax
    const parallaxX = this._cursor.x * 0.5;
    const parallaxY = this._cursor.y * 0.5;
    this.cameraGroup.position.x +=
      (parallaxX - this.cameraGroup.position.x) * 5 * this.delta;
    this.cameraGroup.position.y +=
      (parallaxY - this.cameraGroup.position.y) * 5 * this.delta;

    this.brain.update(this.delta);
    this.particles.update(this.delta);

    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  }

  set scrollY(scrollY: number) {
    this._scrollY = scrollY;
  }

  get objectDistance() {
    return this._objectDistance;
  }

  set cursor(cursor: { x: number; y: number }) {
    this._cursor = cursor;
  }
}
