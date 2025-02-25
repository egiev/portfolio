uniform float uTime;
uniform float uCenter;
uniform float uPointSize;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

    // Standard projection
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  // gl_PointSize = 30.;
  // gl_PointSize = 30.;
  // gl_PointSize = 3. * (uPointSize / -viewPosition.z);

  // float distanceFromCenter = length(modelPosition.y - uCenter);
  // gl_PointSize = distanceFromCenter * uPointSize;
  // vec3 center = vec3(0.0, 0.0, 10);
  // float distFromCenter = length(position.z - center);
  // // distFromCenter += length(position.z - vec3(0, 3, 3));
  // gl_PointSize = uPointSize;
  // // distFromCenter += length(position.y - center);
  // // distFromCenter -= length(position.z - center);
  // gl_PointSize *= 1.5 / -viewPosition.z;

  // // Compute distance from the model center
  // float distFromCenter = length(modelPosition.xyz - uCenter);

  //   // Normalize the distance (assuming max distance ~10, adjust as needed)
  // float normalizedDistance = smoothstep(0.0, 10.0, distFromCenter);

  //   // Invert the effect: Bigger at the center, smaller at the edges
  // float sizeFactor = mix(1.0, 0.3, normalizedDistance); // 1.0 (center), 0.3 (edges)

  //   // Compute final point size with perspective correction
  // gl_PointSize = clamp(uPointSize * sizeFactor * (1.0 / -viewPosition.z), 1.0, 300.0);

  gl_PointSize = uPointSize;
  gl_PointSize *= 1. / -viewPosition.z;

}