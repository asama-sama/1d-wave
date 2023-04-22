precision mediump float;

attribute vec3 vertex;

uniform float xMin;
uniform float xMax;

void main() {
  float mp;
  float l;
  float newX;
  mp = (xMax + xMin) / 2.0;
  l = xMax - xMin;

  newX = (vertex.x - mp)/(l/2.0);

  gl_Position = vec4(newX, vertex.y, 0, 1.0);
}