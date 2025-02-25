import GUI from 'lil-gui';
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  Points,
  ShaderMaterial,
  TextureLoader,
  Uniform,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragmentShader from '@shaders/brain/fragment.glsl';
import vertexShader from '@shaders/brain/vertex.glsl';

export class Brain extends Group {
  private readonly model = '/models/human_brain.glb';
  private readonly texture = '/textures/14.png';

  private brain!: Points;

  private gui = new GUI();

  constructor() {
    super();
    this.init();
  }

  async init() {
    try {
      const model = await this.loadModel();
      this.brain = await this.modelToParticle(model);

      this.initGui();
      this.add(this.brain);
      // this.add(model);
    } catch {
      throw new Error('Cannot load model');
    }
  }

  async loadModel() {
    const loader = new GLTFLoader();
    const model = await loader.loadAsync(this.model);

    if (!model) throw new Error('Cannot load model.');

    return model.scene;
  }

  async modelToParticle(model: Group) {
    const positions = this.getPositions(model);
    const randomness = this.getRandomness(positions.length / 3);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 1));

    console.log(geometry.attributes);

    const material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uTime: new Uniform(0),
        uCenter: new Uniform(new Vector3()),
        uPointSize: new Uniform(250),
        uTexture: new Uniform(await this.loadTexture()),
      },
      // blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    const particles = new Points(geometry, material);
    particles.rotation.y = Math.PI * 0.5;
    particles.scale.set(0.03, 0.03, 0.03);

    return particles;
  }

  private getPositions(model: Group) {
    const positions: number[] = [];

    model.traverse((node) => {
      if (node instanceof Mesh) {
        node.geometry.center();
        positions.push(...node.geometry.attributes.position.array);
      }
    });

    return new Float32Array(positions);
  }

  private getRandomness(count: number) {
    const randomness = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randomness[i] = Math.random();
    }

    return randomness;
  }

  private async loadTexture() {
    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(this.texture);
    return texture;
  }

  private initGui() {
    const material = this.brain.material as ShaderMaterial;
    console.log('mater', material.uniforms['uPointSize']);
    this.gui.add(material.uniforms['uPointSize'], 'value', 1, 500, 0.001);
  }

  update(delta: number) {
    if (this.brain) {
      const materials = this.brain.material as ShaderMaterial;

      materials.uniforms['uTime'].value += delta;
      this.brain.rotation.y += delta * 0.05;
    }
  }
}
