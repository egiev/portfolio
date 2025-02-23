precision mediump float;

uniform vec3 uColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));

  if(strength > .5) {
    discard;
  }

  strength = 1. - step(.5, strength);
  strength = pow(strength, 5.);

  vec3 finalColor = mix(vec3(.0), uColor, strength);

  gl_FragColor = vec4(vec3(finalColor), 1.);
}