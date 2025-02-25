import fragmentShader from '@shaders/particle/fragment.glsl';
import vertexShader from '@shaders/particle/vertex.glsl';
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

export class Particle extends Points {
  private readonly texture = '/textures/14.png';

  private particle!: Points;

  constructor(
    private readonly particleCount: number,
    private readonly distance: number,
  ) {
    super();
    this.init();
  }

  async init() {
    const positions = this.getPositions(this.particleCount, this.distance);
    const randomness = this.getRandomness(this.particleCount);
    const texture = await this.getTexture();

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 1));

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: new Uniform(0),
        uColor: new Uniform(new Color('#df800d')),
        uTexture: new Uniform(texture),
      },
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });

    this.particle = new Points(geometry, material);
    this.add(this.particle);
  }

  private async getTexture() {
    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(this.texture);
    return texture;
  }

  private getPositions(count: number, distance: number) {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = distance * 0.7 - Math.random() * distance * 4;
      positions[i + 2] = Math.random() * 2 - 1;
    }

    return positions;
  }

  private getRandomness(count: number) {
    const randomness = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randomness[i] = Math.random();
    }

    return randomness;
  }

  update(delta: number) {
    if (this.particle) {
      const material = this.particle.material as ShaderMaterial;
      material.uniforms['uTime'].value += delta;
    }
  }
}
