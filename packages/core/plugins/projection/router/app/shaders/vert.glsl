attribute vec2 aVertexPosition;

varying vec2 vertPos;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  vertPos = aVertexPosition;
}
