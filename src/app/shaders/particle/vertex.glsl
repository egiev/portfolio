uniform float uTime;

void main() {
  vec4 modelPosition = vec4(position, 1.0);
  modelPosition.x += 1.0;

  vec4 viewPosition = modelViewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;

  gl_PointSize = 6.0;
  gl_Position = projectionPosition;
}