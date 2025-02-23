import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  TextureLoader,
  Uniform,
} from 'three';

import fragmentShader from '@shaders/particle/fragment.glsl';
import vertexShader from '@shaders/particle/vertex.glsl';

export class Particle extends Points {
  private readonly texture = '/textures/8.png';
  particle!: Points;

  constructor(
    private readonly particleCount: number,
    private readonly distance: number,
  ) {
    super();
    this.init();
  }

  async init() {
    const positions = this.getPositions(this.particleCount, this.distance);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));

    // const material = new PointsMaterial();
    // material.size = 0.2;
    // material.sizeAttenuation = true;
    // material.alphaMap = await this.loadTexture();
    // material.color = new Color('#df800d');
    // material.transparent = true;
    // material.depthWrite = false;
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: new Uniform(0),
        uColor: new Uniform(new Color('#df800d')),
      },
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    this.particle = new Points(geometry, material);
    this.add(this.particle);
  }

  private async loadTexture() {
    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(this.texture);
    return texture;
  }

  private getPositions(count: number, distance: number) {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = distance * 0.7 - Math.random() * distance * 4;
      positions[i + 2] = (Math.random() - 0.5) * 2;
    }

    return positions;
  }

  update(delta: number) {
    (this.particle.material as ShaderMaterial).uniforms['uTime'].value = delta;
  }
}
