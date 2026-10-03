import { fragmentShader, vertexShader } from './shaders'

export interface OceanUniforms {
  time: number
  depth: number
  descent: number
  pointer: [x: number, y: number, strength: number]
}

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'shader')
  return shader
}

export function createRenderer(canvas: HTMLCanvasElement) {
  try {
    return setup(canvas)
  } catch {
    return null
  }
}

function setup(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' })
  if (!gl) return null
  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader))
  gl.linkProgram(program)
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const locations = { res: uniform('uRes'), time: uniform('uTime'), depth: uniform('uDepth'), descent: uniform('uDescent'), pointer: uniform('uPointer') }

  return {
    resize(width: number, height: number) {
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.uniform2f(locations.res, width, height)
    },
    render({ time, depth, descent, pointer }: OceanUniforms) {
      gl.uniform1f(locations.time, time)
      gl.uniform1f(locations.depth, depth)
      gl.uniform1f(locations.descent, descent)
      gl.uniform3f(locations.pointer, ...pointer)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}
