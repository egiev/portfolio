precision mediump float;

uniform float uTime;
uniform float aRandomness;
uniform sampler2D uTexture;

// Rotation function
mat2 getRotation(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_PointCoord; // Get the UV coordinates of the particle

  // Center UVs around (0.5, 0.5) for proper rotation
  vec2 centeredUv = uv - 0.5;

  // Apply rotation
  vec2 rotatedUv = getRotation(uTime) * centeredUv + 0.5;

  // Sample the rotated texture (fixing the mistake)
  vec4 color = texture2D(uTexture, rotatedUv);

  // Set final fragment color
  gl_FragColor = color;
}