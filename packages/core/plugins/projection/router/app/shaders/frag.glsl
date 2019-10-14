precision mediump float;

varying vec2 vertPos;

void main() {
  float newPos = (vertPos.x + 1.0) / 2.0;
  
  gl_FragColor = vec4(newPos, newPos, newPos, 1.0);
}
