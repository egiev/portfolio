uniform float uTime;

void main() {
  float randomX = sin(position.x + 3.0 + uTime * 0.5) * 0.5;
  float randomY = cos(position.y + 3.0 + uTime * 0.5) * 0.5;
  float randomZ = sin(position.z + 3.0 + uTime * 0.5) * 0.5;
  vec3 newPosition = position + vec3(randomX, randomY, randomZ);

  gl_PointSize = 6.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}