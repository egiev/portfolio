precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  // float strength = distance(gl_PointCoord, vec2(0.5));

  // if(strength > .5) {
  //   discard;
  // }

  // strength = 1. - step(.5, strength);
  // strength = pow(strength, 5.);

  // vec3 finalColor = mix(vec3(.0), uColor, strength);

  vec4 color = texture2D(uTexture, gl_PointCoord);

  gl_FragColor = color;
}