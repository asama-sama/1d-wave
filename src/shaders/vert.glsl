precision mediump float;

attribute vec3 vertex;

void main() {
  gl_Position = vec4(vertex.x, vertex.y, 0, 1.0);
}