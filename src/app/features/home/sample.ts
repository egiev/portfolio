import fragmentShader from '@shaders/sample/fragment.glsl';
import gpgpuFragmentShader from '@shaders/sample/gpgpu.glsl';
import vertexShader from '@shaders/sample/vertex.glsl';
import GUI from 'lil-gui';
import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  Uniform,
  Vector2,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  GPUComputationRenderer,
  Variable,
} from 'three/examples/jsm/misc/GPUComputationRenderer.js';

type Model = { instance: BufferGeometry; count: number };

type Particles = {
  geometry: BufferGeometry;
  material: ShaderMaterial;
  points: Points;
};

type GPGPU = {
  size: number;
  computation: GPUComputationRenderer;
  particleVariable: Variable;
  debug: Mesh;
};

export class Sample extends Group {
  private readonly modelSource = '/models/human_brain.glb';

  private model: Model = {} as Model;
  private particles: Particles = {} as Particles;
  private gpgpu: GPGPU = {} as GPGPU;

  constructor(
    private readonly renderer: WebGLRenderer,
    private readonly gui: GUI,
  ) {
    super();
  }

  async init() {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(this.modelSource);
    const mesh = gltf.scene.getObjectByName('Object_5') as Mesh;
    mesh.geometry.center();

    if (!mesh) {
      throw new Error('Failed to load model.');
    }

    // Base geometry
    this.model.instance = (mesh as Mesh).geometry;
    this.model.count = this.model.instance.attributes['position'].count;

    // GPGPU
    this.gpgpu.size = Math.ceil(Math.sqrt(this.model.count));
    this.gpgpu.computation = new GPUComputationRenderer(
      this.gpgpu.size,
      this.gpgpu.size,
      this.renderer,
    );

    // Base Particle
    const baseParticleTexture = this.gpgpu.computation.createTexture();
    for (let i = 0; i < this.model.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      (baseParticleTexture.image.data as Float32Array)[i4] =
        this.model.instance.attributes['position'].array[i3];
      (baseParticleTexture.image.data as Float32Array)[i4 + 1] =
        this.model.instance.attributes['position'].array[i3 + 1];
      (baseParticleTexture.image.data as Float32Array)[i4 + 2] =
        this.model.instance.attributes['position'].array[i3 + 2];
      (baseParticleTexture.image.data as Float32Array)[i4 + 3] = 0;
    }

    // Particle Variable
    this.gpgpu.particleVariable = this.gpgpu.computation.addVariable(
      'uParticle',
      gpgpuFragmentShader,
      baseParticleTexture,
    );
    this.gpgpu.computation.setVariableDependencies(
      this.gpgpu.particleVariable,
      [this.gpgpu.particleVariable],
    );

    this.gpgpu.computation.init();

    // Particles UVs
    const particlesUvArray = new Float32Array(this.model.count * 2);
    const particlesSizesArray = new Float32Array(this.model.count);
    for (let y = 0; y < this.gpgpu.size; y++) {
      for (let x = 0; x < this.gpgpu.size; x++) {
        const i = y * this.gpgpu.size + x;
        const i2 = i * 2;

        const uvX = (x + 0.5) / this.gpgpu.size;
        const uvY = (y + 0.5) / this.gpgpu.size;

        particlesUvArray[i2] = uvX;
        particlesUvArray[i2 + 1] = uvY;

        particlesSizesArray[i] = Math.random();
      }
    }

    // Particles
    this.particles.geometry = this.model.instance;
    this.particles.geometry = new BufferGeometry();
    this.particles.geometry.setDrawRange(0, this.model.count);
    this.particles.geometry.setAttribute(
      'aParticleUv',
      new BufferAttribute(particlesUvArray, 2),
    );
    this.particles.geometry.setAttribute(
      'aScale',
      new BufferAttribute(particlesSizesArray, 1),
    );
    this.particles.geometry.setAttribute(
      'aColor',
      mesh.geometry.attributes['tangent'],
    );
    this.particles.geometry.setAttribute('uv', mesh.geometry.attributes['uv']);
    this.particles.geometry.setAttribute(
      'uv1',
      mesh.geometry.attributes['uv1'],
    );
    this.particles.geometry.setAttribute(
      'uv2',
      mesh.geometry.attributes['uv2'],
    );
    this.particles.geometry.setAttribute(
      'uv3',
      mesh.geometry.attributes['uv2'],
    );
    this.particles.geometry.setAttribute(
      'normal',
      mesh.geometry.attributes['normal'],
    );
    console.log(mesh.geometry.attributes);

    this.particles.material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSize: new Uniform(0.044),
        uResolution: new Uniform(
          new Vector2(
            innerWidth * Math.min(devicePixelRatio, 2),
            innerHeight * Math.min(devicePixelRatio, 2),
          ),
        ),
        uParticleTexture: new Uniform(0),
      },
    });

    this.particles.points = new Points(
      this.particles.geometry,
      this.particles.material,
    );
    this.particles.points.scale.set(0.05, 0.05, 0.05);
    this.add(this.particles.points);

    // Debug
    this.gpgpu.debug = new Mesh(
      new PlaneGeometry(2, 2),
      new MeshBasicMaterial({
        map: this.gpgpu.computation.getCurrentRenderTarget(
          this.gpgpu.particleVariable,
        ).texture,
      }),
    );
    this.gpgpu.debug.position.x = 3;
    this.add(this.gpgpu.debug);

    // GUI
    const particleGui = this.gui.addFolder('Particles');
    particleGui.add(
      this.particles.material.uniforms['uSize'],
      'value',
      0.001,
      10,
      0.001,
    );
  }

  update() {
    if (!this.gpgpu.computation) return;

    this.gpgpu.computation.compute();
    this.particles.material.uniforms['uParticleTexture'].value =
      this.gpgpu.computation.getCurrentRenderTarget(
        this.gpgpu.particleVariable,
      ).texture;

    this.particles.points.rotation.y += 0.01;
  }
}
