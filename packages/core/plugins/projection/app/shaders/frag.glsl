precision mediump float;

uniform sampler2D uSampler;

varying mediump vec2 vTexCoord;

void main() {
  gl_FragColor = texture2D(uSampler, vTexCoord);
}
