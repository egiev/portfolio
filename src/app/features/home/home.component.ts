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
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { Timer } from 'three/addons/misc/Timer.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

  cameraGroup!: Object3D;
  brain!: Object3D;
  particles!: Points;

  currentSection = 0;
  scrollY = window.scrollY;
  cursor = { x: 0, y: 0 };
  objectDistance = 4;

  ngOnInit(): void {
    this.init();
    this.initModels();
    this.initParticles();
    this.registerListener();
    this.zone.runOutsideAngular(() => this.tick());
  }

  private init() {
    // Scene
    this.scene = new Scene();

    // Camera
    this.cameraGroup = new Group();
    this.scene.add(this.cameraGroup);

    this.camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.camera.aspect = innerWidth / innerHeight;
    this.cameraGroup.add(this.camera);

    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas.nativeElement,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);
  }

  private async initModels() {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync('/models/human_brain.glb');
    const positions: number[] = [];

    model.scene.traverse((node) => {
      if (node instanceof Mesh) {
        node.geometry.center();
        positions.push(...node.geometry.attributes.position.array);
      }
    });

    const geometry = new BufferGeometry();
    geometry.center();
    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(positions), 3),
    );

    const material = new PointsMaterial();
    material.size = 0.3;
    material.sizeAttenuation = true;
    material.alphaMap = await this.loadTexture();
    material.color = new Color('#df800d');
    material.transparent = true;
    material.depthWrite = false;

    this.brain = new Points(geometry, material);
    this.brain.scale.set(0.03, 0.03, 0.03);
    this.brain.position.x = 1.5;
    this.brain.position.y = -this.objectDistance * 0;
    this.brain.rotation.y = Math.PI * 0.5 * 0.5;
    this.scene.add(this.brain);
  }

  private async loadTexture() {
    const textureLoader = new TextureLoader();
    const particleTexture = await textureLoader.loadAsync('/textures/8.png');
    return particleTexture;
  }

  private async initParticles() {
    const count = 250;
    const geometry = new BufferGeometry();

    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] =
        this.objectDistance * 0.7 - Math.random() * this.objectDistance * 4;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    const material = new PointsMaterial();
    material.size = 0.025;
    material.sizeAttenuation = true;
    material.color = new Color('#df800d');
    // material.map = await this.loadTexture();
    // material.transparent = true;
    // material.depthWrite = false;

    this.particles = new Points(geometry, material);
    this.scene.add(this.particles);
  }

  private tick() {
    // Timer
    this.timer.update();
    const delta = this.timer.getDelta();

    // Camera
    this.camera.position.y =
      (-this.scrollY / innerHeight) * this.objectDistance;

    // Parallax
    const parallaxX = this.cursor.x * 0.5;
    const parallaxY = this.cursor.y * 0.5;
    this.cameraGroup.position.x =
      parallaxX - this.cameraGroup.position.x * 5 * delta;
    this.cameraGroup.position.y =
      parallaxY - this.cameraGroup.position.y * 5 * delta;

    // Renderer
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.tick());
  }

  private registerListener() {
    this.resize();
    this.scroll();
    this.mousemove();
  }

  private resize() {
    fromEvent(window, 'resize').subscribe(() => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(innerWidth, innerHeight);
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });
  }

  private scroll() {
    fromEvent(window, 'scroll').subscribe(() => {
      this.scrollY = window.scrollY;

      const newSection = Math.floor(this.scrollY / innerHeight);
      if (newSection !== this.currentSection) {
        this.currentSection = newSection;

        gsap.to(this.brain.position, {
          duration: 0.7,
          y: -this.objectDistance * this.currentSection,
          x: this.brain.position.x * -1,
          ease: 'power3.inOut',
        });
      }
    });
  }

  private mousemove() {
    fromEvent(window, 'mousemove').subscribe((e) => {
      this.cursor.x = (e as MouseEvent).clientX / innerWidth - 0.5;
      this.cursor.y = -((e as MouseEvent).clientY / innerHeight - 0.5);
    });
  }
}
