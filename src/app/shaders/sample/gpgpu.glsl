void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(uParticle, uv);
  gl_FragColor = particle;
}