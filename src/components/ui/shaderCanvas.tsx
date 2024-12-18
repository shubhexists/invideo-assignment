import React, { useRef, useEffect } from "react";

interface ShaderCanvasProps {
  vertexShader: string;
  fragmentShader: string;
  width?: number;
  height?: number;
  uniforms?: Record<string, number | number[]>;
  onError?: () => void;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  vertexShader,
  fragmentShader,
  width = 500,
  height = 500,
  uniforms = {},
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      onError?.();
      return;
    }
    glRef.current = gl;

    const vertexShaderObj = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragmentShaderObj = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShader
    );

    if (!vertexShaderObj || !fragmentShaderObj) {
      console.error("Failed to create shaders");
      onError?.();
      return;
    }

    const program = createProgram(gl, vertexShaderObj, fragmentShaderObj);
    if (!program) {
      console.error("Failed to create program");
      onError?.();
      return;
    }
    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const animate = (time: number) => {
      if (!canvas || !gl || !program) return;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      const positionAttributeLocation = gl.getAttribLocation(
        program,
        "a_position"
      );
      gl.enableVertexAttribArray(positionAttributeLocation);

      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      const timeUniformLocation = gl.getUniformLocation(program, "u_time");
      const resolutionUniformLocation = gl.getUniformLocation(
        program,
        "u_resolution"
      );

      if (timeUniformLocation) {
        gl.uniform1f(timeUniformLocation, time / 1000);
      }

      if (resolutionUniformLocation) {
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      }

      Object.entries(uniforms).forEach(([name, value]) => {
        const location = gl.getUniformLocation(program, name);
        if (location) {
          if (typeof value === "number") {
            gl.uniform1f(location, value);
          } else if (Array.isArray(value)) {
            switch (value.length) {
              case 2:
                gl.uniform2f(location, value[0], value[1]);
                break;
              case 3:
                gl.uniform3f(location, value[0], value[1], value[2]);
                break;
              case 4:
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
            }
          }
        }
      });

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (program) gl.deleteProgram(program);
      if (vertexShaderObj) gl.deleteShader(vertexShaderObj);
      if (fragmentShaderObj) gl.deleteShader(fragmentShaderObj);
    };
  }, [vertexShader, fragmentShader, uniforms, width, height, onError]);

  const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(program)
      );
      return null;
    }

    return program;
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="shader-canvas"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "block",
      }}
    />
  );
};

export default ShaderCanvas;
