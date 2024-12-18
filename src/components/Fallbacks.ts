export const shaders = [
  {
    Vertex:
      "#version 100\n\
precision mediump float;\n\
\n\
attribute vec2 a_position; // The vertex position of the full-screen quad\n\
varying vec2 v_texCoord;  // Texture coordinates to pass to the fragment shader\n\
\n\
void main() {\n\
    // Map the quad coordinates to normalized device coordinates (NDC)\n\
    v_texCoord = a_position * 0.5 + 0.5;  // Transform from range [-1, 1] to [0, 1]\n\
    gl_Position = vec4(a_position, 0.0, 1.0); // Standard full-screen quad projection\n\
}",
    Fragment:
      "#version 100\n\
precision mediump float;\n\
\n\
uniform float u_time;  // Time uniform for animation\n\
uniform vec2 u_resolution;  // Resolution of the canvas (width, height)\n\
varying vec2 v_texCoord;  // Texture coordinates passed from the vertex shader\n\
\n\
void main() {\n\
    // Normalize pixel coordinates (from [0, resolution] to [0, 1])\n\
    vec2 p = v_texCoord * u_resolution.xy;\n\
\n\
    // Create ripple effect using sin function based on distance from the center\n\
    float dist = length(p - u_resolution * 0.5);  // Distance from the center of the canvas\n\
    float ripple = sin(dist * 0.1 - u_time * 2.0) * 0.5 + 0.5;  // Create a ripple effect over time\n\
\n\
    // Color logic: Water ripple effect with color gradient based on distance\n\
    vec3 color = vec3(0.0, 0.4, 0.7); // Base water color (light blue)\n\
    color *= ripple; // Apply ripple effect to color intensity\n\
\n\
    // Output the final color\n\
    gl_FragColor = vec4(color, 1.0);  // Set the output color with full opacity\n\
}",
  },
  {
    Vertex:
      "// Vertex Shader: Standard full-screen quad transformation\n#version 100\nattribute vec2 a_position;\nvarying vec2 v_uv;\nvoid main() {\n    // Pass normalized coordinates to the fragment shader\n    v_uv = a_position * 0.5 + 0.5;\n    // Transform the vertex position to clip space\n    gl_Position = vec4(a_position, 0.0, 1.0);\n}",
    Fragment:
      "// Fragment Shader: Water Ripple Effect\n#version 100\nprecision mediump float;\n\n// Uniforms\nuniform float u_time;          // Animation time\nuniform vec2 u_resolution;     // Canvas resolution\n\n// Varyings\nvarying vec2 v_uv;             // Interpolated UV coordinates from vertex shader\n\nvoid main() {\n    // Normalize coordinates to [-1, 1] and scale based on aspect ratio\n    vec2 uv = (v_uv - 0.5) * 2.0;\n    uv.x *= u_resolution.x / u_resolution.y;\n\n    // Calculate distance from the center\n    float dist = length(uv);\n\n    // Generate ripple effect using sine waves\n    float ripple = sin(10.0 * dist - u_time * 2.0);\n\n    // Attenuate the ripple effect as it moves outward\n    ripple *= exp(-dist * 2.0);\n\n    // Create color using the ripple effect\n    vec3 color = vec3(0.2, 0.4, 0.8) + ripple * vec3(0.1, 0.2, 0.3);\n\n    // Output final color\n    gl_FragColor = vec4(color, 1.0);\n}",
  },
];
