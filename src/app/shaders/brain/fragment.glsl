precision mediump float;

void main() {
  vec2 uv = gl_PointCoord;
  gl_FragColor = vec4(uv, 1., 1.);
}