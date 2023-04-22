import vertShader from '../shaders/vert.glsl'
import fragShader from '../shaders/frag.glsl'

type Uniforms = {
  [key: string]: WebGLUniformLocation | null
}

export class Wave {
  static gl: WebGLRenderingContext;
  static vertexBuffer: WebGLBuffer;
  static uniforms: Uniforms = {
    xMin: null,
    xMax: null,
  }

  constructor(private vertices: Float32Array, private xMin: number, private xMax: number) { }
  
  render() {
    Wave.gl.bindBuffer(Wave.gl.ARRAY_BUFFER, Wave.vertexBuffer)
    Wave.gl.bufferData(
      Wave.gl.ARRAY_BUFFER,
      this.vertices,
      Wave.gl.STATIC_DRAW
    )

    Wave.gl.uniform1f(Wave.uniforms.xMin, this.xMin)
    Wave.gl.uniform1f(Wave.uniforms.xMax, this.xMax)

    Wave.gl.drawArrays(Wave.gl.TRIANGLE_STRIP, 0, this.vertices.length/2)
  }

  updateWave = (t: number) => {
    const points = this.vertices.length / 4
    for (let i = 0; i < points; i++) {
      const x = this.vertices[i*4]
      const y = Wave.getHeightAtPoint(x, t)
      this.vertices[i*4+3] = y
    }
  }

  static createProgram = (gl: WebGLRenderingContext) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    if (!vertexShader) throw new Error('no vertex shader found')
    gl.shaderSource(vertexShader, vertShader)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fragmentShader) throw new Error("no fragment shader found")
    gl.shaderSource(fragmentShader, fragShader)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    if (!program) throw new Error('no program found')
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) throw new Error('no buffer found')
    Wave.vertexBuffer = vertexBuffer
    const vertexLocation = gl.getAttribLocation(program, 'vertex')
    gl.enableVertexAttribArray(vertexLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.vertexAttribPointer(vertexLocation, 2, gl.FLOAT, false, 0, 0)

    const xMinLocation = gl.getUniformLocation(program, 'xMin')
    this.uniforms.xMin = xMinLocation

    const xMaxLocation = gl.getUniformLocation(program, 'xMax')
    this.uniforms.xMax = xMaxLocation

    gl.useProgram(program)
    Wave.gl = gl
  }

  static initialise = (n: number, xMin: number, xMax: number) => {

    const s = (xMax - xMin) / n;
    const mp = (xMax + xMin) / 2;
    const l = xMax - xMin
    // const transform = (x: number) => (x - mp)/(l/2) // transform from [xMin, xMax] -> [-1, 1]
    let points: number[] = []

    for (let i = 0; i <= n; i++) {
      const x = s * i + xMin
      const y = this.getHeightAtPoint(x, 0)
      // const xt = transform(x)
      points = [...points,  x, -1, x, y] // y axis on wave followed by bottom for triangle strip
    }
    return new Wave(new Float32Array(points), xMin, xMax)
  }

  static getHeightAtPoint = (x: number, t: number) => {
    return Math.sin(x + t)/2 + 0.2
  }
}