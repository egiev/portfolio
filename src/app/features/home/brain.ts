import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  Points,
  PointsMaterial,
  TextureLoader,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Brain extends Group {
  private readonly model = '/models/human_brain.glb';
  private readonly texture = '/textures/8.png';

  constructor() {
    super();
    this.init();
  }

  async init() {
    try {
      const model = await this.loadModel();
      const modelParticles = await this.modelToParticle(model);
      this.add(modelParticles);
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
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    const material = new PointsMaterial();
    material.size = 0.2;
    material.sizeAttenuation = true;
    material.alphaMap = await this.loadTexture();
    material.color = new Color('#df800d');
    material.transparent = true;
    material.depthWrite = false;

    const particles = new Points(geometry, material);
    particles.scale.set(0.02, 0.02, 0.02);

    return particles;
  }

  getPositions(model: Group) {
    const positions: number[] = [];

    model.traverse((node) => {
      if (node instanceof Mesh) {
        node.geometry.center();
        positions.push(...node.geometry.attributes.position.array);
      }
    });

    return new Float32Array(positions);
  }

  private async loadTexture() {
    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(this.texture);
    return texture;
  }
}
