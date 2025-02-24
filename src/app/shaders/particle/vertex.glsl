uniform float uTime;

attribute float aRandomness;

varying vec2 vUv;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float moveFactor = uTime * aRandomness;

  modelPosition.x += cos(moveFactor) * .02;
  modelPosition.y += sin(moveFactor) * .02;
          // modelPosition.y += sin(uTime * aRandom * 5.) * 0.2 * .5;
          // modelPosition.y += sin(uTime + modelPosition.y) * 0.2;
          // modelPosition.y += sin(uTime + modelPosition.y) * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPostion = projectionMatrix * viewPosition;
  gl_Position = projectionPostion;
  gl_PointSize = clamp(3. * (1. / -modelPosition.z), 20., 50.);

  // Varyings
  vUv = uv;
}