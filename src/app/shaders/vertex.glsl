uniform float uTime;

void main() {
  vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);

  vec4 projectionPosition = projectionMatrix * modelPosition;

  gl_PointSize = 6.;
  gl_Position = projectionPosition;
}