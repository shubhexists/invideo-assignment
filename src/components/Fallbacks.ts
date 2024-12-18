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
  {
    Vertex: `#version 100
attribute vec2 a_position; // Vertex position
varying vec2 v_uv; //UV coordinates for fragment shader
void main() {
    //Standard full-screen quad transformation
    v_uv = (a_position + 1.0) / 2.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,
    Fragment: `#version 100
precision mediump float;
uniform vec2 u_resolution; // Canvas resolution
uniform float u_time; // Time uniform
varying vec2 v_uv; //UV coordinates from vertex shader

// Game of Life parameters
const int gridSize = 64;
const float cellSize = 1.0 / float(gridSize);

// Function to get the state of a cell at a given position
float getCell(vec2 uv) {
    vec2 gridCoord = floor(uv * float(gridSize));
    vec2 cellUV = fract(uv * float(gridSize));

    //Simulate a grid with oscillating cells
    float oscillation = sin(u_time + gridCoord.x * 0.2 + gridCoord.y * 0.3); 
    float cellState = step(0.5, oscillation); //Cell is alive if oscillation > 0.5
    return cellState;
}

// Function to count living neighbors
int countNeighbors(vec2 uv) {
    int count = 0;
    for (int i = -1; i <= 1; ++i) {
        for (int j = -1; j <= 1; ++j) {
            if (i == 0 && j == 0) continue; //Exclude the cell itself
            vec2 neighborUV = uv + vec2(float(i), float(j)) * cellSize;
            count += int(getCell(neighborUV));
        }
    }
    return count;
}

void main() {
    //Normalize UVs
    vec2 uv = v_uv;
    //Convert UV to grid coordinates
    vec2 gridCoord = floor(uv * float(gridSize));
    //Get current cell state
    float currentCell = getCell(uv);
    //Count living neighbors
    int liveNeighbors = countNeighbors(uv);

    //Apply Game of Life rules
    float nextCell = 0.0;
    if (currentCell > 0.0) {
        if (liveNeighbors < 2 || liveNeighbors > 3) nextCell = 0.0; //Underpopulation or overpopulation
        else nextCell = 1.0; //Survival
    } else {
        if (liveNeighbors == 3) nextCell = 1.0; //Reproduction
    }

    // Visual representation
    vec3 color = vec3(nextCell);
    //Add some visual effects
    color += vec3(0.2*sin(u_time+gridCoord.x*0.5 + gridCoord.y*0.7),0.3*cos(u_time + gridCoord.x*0.1 + gridCoord.y*0.3),0.1*sin(u_time+gridCoord.x*0.4+gridCoord.y*0.9));

    gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    Vertex: `#version 100
precision mediump float;
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position * 0.5 + 0.5; // Transform to 0-1 UV coordinates
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,
    Fragment: `#version 100
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = v_uv;
    // Scaling and time-based animation
    uv *= 2.0;
    uv -= 1.0;
    float t = u_time * 0.1; // Slow down time
    float scale = 2.0 + sin(t) * 0.5; // Animated scaling
    uv *= scale;
    // Color logic based on distance from center and time
    float dist = distance(uv, vec2(0.0));
    float colorValue = sin(dist + t) * 0.5 + 0.5;
    vec3 color = vec3(colorValue, 0.5 * colorValue, 1.0 - colorValue); //RGB color variation
    gl_FragColor = vec4(color, 1.0);
}`,
  },
  {
    Vertex: `#version 100
precision mediump float;
attribute vec2 a_position; //Vertex position
varying vec2 v_uv; //UV coordinates for fragment shader
void main() {
  //Standard full-screen quad transformation
  v_uv = (a_position + 1.0) / 2.0;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`,
    Fragment: `#version 100
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv; // normalized pixel coordinates (0-1)
  //Game of Life Implementation
  vec2 grid_uv = floor(uv * 100.0); //Adjust 100 for grid size
  float cell_index = grid_uv.x + grid_uv.y * 100.0; // 1D index
  //Simple rule: Conways Game of life
  //count neighbours
  int neighbours = 0;
  for(float dx = -1.0; dx <= 1.0; dx++){
    for(float dy = -1.0; dy <= 1.0; dy++){
      if(abs(dx) + abs(dy) == 1.0){ 
        vec2 neighbour_uv = grid_uv + vec2(dx, dy);
        float neighbour_index = neighbour_uv.x + neighbour_uv.y * 100.0;
        float neighbour_state = mod(floor(neighbour_index / 10.0 + u_time),2.0); //Simulate cell state based on time
        neighbours += int(neighbour_state);
      }
    }
  }
  //Apply rules
  float cell_state = mod(floor(cell_index / 10.0 + u_time), 2.0); //Simulate cell state based on time
  float next_state = 0.0; 
  if(cell_state == 1.0 && neighbours == 2 || neighbours == 3) next_state = 1.0;
  else if (cell_state == 0.0 && neighbours == 3) next_state = 1.0;
  //Color based on state
  vec3 color = vec3(next_state);
  gl_FragColor = vec4(color, 1.0);
}`,
  },
];
