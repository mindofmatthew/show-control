attribute vec2 aVertexPosition;

void main() {
  vec2 position = aVertexPosition * vec2(2.0, -2.0) + vec2(-1.0, 1.0);
  gl_Position = vec4(position, 0.0, 1.0);
}
