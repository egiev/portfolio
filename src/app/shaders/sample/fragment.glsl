varying vec4 vColor;
varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vUv2;
varying vec2 vUv3;
varying vec3 vNormal;

void main() {
  float distanceToCenter = length(gl_PointCoord - .5);

  if(distanceToCenter > .5) {
    discard;
  }

  vec3 color = normalize(vNormal) * 0.5 + 0.5;
  // gl_FragColor = vColor;
  gl_FragColor = vec4(color, 1.);
}