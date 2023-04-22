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

const wave = Wave.initialise(500,  -2*Math.PI, 2*Math.PI)

let t=0
const animate = () => {
  requestAnimationFrame(animate)
  wave.render()
  t+=0.05
  wave.updateWave(t)
}
animate()
