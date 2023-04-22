import vertShader from '../shaders/vert.glsl'
import fragShader from '../shaders/frag.glsl'

export class Wave {
  static gl: WebGLRenderingContext;
  static vertexBuffer: WebGLBuffer;
  constructor(private vertices: Float32Array) { }
  
  render() {
    Wave.gl.bindBuffer(Wave.gl.ARRAY_BUFFER, Wave.vertexBuffer)
    Wave.gl.bufferData(
      Wave.gl.ARRAY_BUFFER,
      this.vertices,
      Wave.gl.STATIC_DRAW
    )

    Wave.gl.drawArrays(Wave.gl.TRIANGLE_STRIP, 0, this.vertices.length/2)
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

    gl.useProgram(program)
    Wave.gl = gl
  }
}