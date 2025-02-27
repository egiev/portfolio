uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uParticleTexture;

attribute vec2 aParticleUv;
attribute float aScale;
attribute vec4 aColor;
attribute vec2 uv1;
attribute vec2 uv2;
attribute vec2 uv3;

varying vec4 vColor;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec2 vUv3;
varying vec3 vNormal;

void main() {
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectedPosition = projectionMatrix * viewPosition;
  // gl_Position = projectedPosition;
  vec4 particle = texture(uParticleTexture, aParticleUv);

  vec4 modelPosition = modelMatrix * vec4(particle.xyz, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPostion = projectionMatrix * viewPosition;

  gl_Position = projectionPostion;
  gl_PointSize = aScale * uSize * uResolution.y;
  gl_PointSize *= 1. / -viewPosition.z;

  vColor = aColor;
  vUv = uv;
  vUv1 = uv1;
  vUv2 = uv2;
  vUv3 = uv3;
  vNormal = normal;
}

// uniform float uSize;

// void main() {
//   vec4 modelPosition = modelMatrix * vec4(position, 1.);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   vec4 projectionPosition = projectionMatrix * viewPosition;

//   gl_Position = projectionPosition;

//   gl_PointSize = uSize;
// }
