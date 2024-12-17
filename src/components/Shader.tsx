import ShaderCanvas from "@/components/ui/shaderCanvas";

export default function RenderCanvas() {
  const vertexShader =
    "// Vertex Shader: Standard full-screen quad transformation\n#version 100\nattribute vec2 a_position;\nvarying vec2 v_uv;\nvoid main() {\n    // Pass normalized coordinates to the fragment shader\n    v_uv = a_position * 0.5 + 0.5;\n    // Transform the vertex position to clip space\n    gl_Position = vec4(a_position, 0.0, 1.0);\n}";

  const fragmentShader =
    "// Fragment Shader: Animated Game of Life\n#version 100\nprecision mediump float;\n\n// Uniforms\nuniform float u_time;          // Animation time\nuniform vec2 u_resolution;     // Canvas resolution\n\n// Varyings\nvarying vec2 v_uv;             // Interpolated UV coordinates from vertex shader\n\n// Hash function for randomness\nfloat hash(vec2 p) {\n    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);\n}\n\n// Game of Life rules\nfloat gameOfLife(vec2 coord, vec2 cellSize) {\n    // Get the integer grid position\n    vec2 gridPos = floor(coord / cellSize);\n\n    // Calculate neighbor positions\n    float sum = 0.0;\n    for (float y = -1.0; y <= 1.0; y++) {\n        for (float x = -1.0; x <= 1.0; x++) {\n            if (!(x == 0.0 && y == 0.0)) {\n                sum += hash(gridPos + vec2(x, y));\n            }\n        }\n    }\n\n    // Current cell state (alive or dead)\n    float current = hash(gridPos);\n\n    // Apply Game of Life rules\n    if (current > 0.5 && (sum < 2.0 || sum > 3.0)) {\n        return 0.0; // Die\n    }\n    if (current <= 0.5 && sum == 3.0) {\n        return 1.0; // Birth\n    }\n    return current; // Survive or stay dead\n}\n\nvoid main() {\n    // Normalize UV coordinates and adjust for aspect ratio\n    vec2 uv = v_uv * u_resolution.xy / u_resolution.y;\n\n    // Define cell size based on resolution and zoom level\n    vec2 cellSize = vec2(0.02);\n\n    // Calculate the state of the cell\n    float state = gameOfLife(uv + vec2(sin(u_time * 0.1), cos(u_time * 0.1)), cellSize);\n\n    // Interpolate color based on state\n    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.5), state);\n\n    // Add some animation glow\n    color += 0.1 * sin(u_time * 10.0) * vec3(1.0, 0.5, 0.2);\n\n    // Output the final color\n    gl_FragColor = vec4(color, 1.0);\n}";
  return (
    <ShaderCanvas
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      width={500}
      height={500}
      uniforms={{
        u_mouse: [0.5, 0.5],
      }}
    />
  );
}
