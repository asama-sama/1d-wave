// @ts-ignore
// import { mat4 } from "./lib/gl-matrix-min" 
import { Wave } from './models/wave';

const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
if (!canvas) throw new Error('canvas could not be found')
const gl = canvas.getContext("webgl");
if (!gl) {
  throw new Error("WebGL not supported");
}
gl.enable(gl.DEPTH_TEST);

Wave.createProgram(gl)

const waveVertices = (n: number, xMin: number, xMax: number) => {
  const s = (xMax - xMin) / n;
  const mp = (xMax + xMin) / 2;
  const l = xMax - xMin
  const transform = (x: number) => (x - mp)/(l/2)
  let points: number[] = []

  for (let i = 0; i <= n; i++) {
    const x = s * i + xMin
    const y = Math.sin(x)
    const xt = transform(x)
    points = [...points,  xt, -1, xt, y] // y axis on wave followed by bottom for triangle strip
  }
  return new Float32Array(points)
}

const vertices = waveVertices(500, -2*Math.PI, 2*Math.PI)

const wave = new Wave(vertices)

const animate = () => {
  requestAnimationFrame(animate)
  wave.render()
}
animate()
