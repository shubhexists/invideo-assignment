defmodule Api.Gemini do
  @moduledoc false

  @gemini_url "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

  def generate_content(text) do
    api_key = System.get_env("GEMINI_API")

    if api_key do
      url = "#{@gemini_url}?key=#{api_key}"

      body = %{
        "contents" => [
          %{
            "parts" => [
              %{
                "text" =>
                  "I want you to generate a WebGL shader that:\n #{text} \n Shader Requirements: \n
1. Must use two main uniforms:
 - u_time (for animation)
 - u_resolution (for canvas dimensions)
2. Precision should be set to mediump float
3. Use a standard 2D coordinate system transformation
4. Include comments explaining key algorithmic steps
5. Create visually interesting effects
Shader Generation Requirements:
1. GLSL Version: Use GLSL ES 1.00 (for WebGL 1 compatibility)
- Add #version 100 as the first line
- Use 'attribute' for vertex attributes
- Use 'varying' for passing data between shaders
- Use 'gl_FragColor' for fragment output
2. Precision Specification:
- Always include precision qualifier
- Use 'precision mediump float;'
3. Vertex Shader Constraints:
- Use 'attribute' for input
- Standard full-screen quad transformation
4. Fragment Shader Constraints:
- Use 'gl_FragColor' for output
- Implement color logic
- Handle coordinate normalization
Desired Output:
GIVE A JSON with keys and their corresponding logics -
- Vertex Shader (standard full-screen quad version)
- Fragment Shader (main visual logic)"
              }
            ]
          }
        ],
        "generationConfig" => %{"response_mime_type" => "application/json"}
      }

      headers = [{"Content-Type", "application/json"}]
      options = [timeout: 30_000, recv_timeout: 30_000]

      case HTTPoison.post(url, Jason.encode!(body), headers, options) do
        {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
          {:ok, Jason.decode!(body)}

        {:ok, %HTTPoison.Response{status_code: status, body: body}} ->
          {:error, "Error #{status}: #{body}"}

        {:error, %HTTPoison.Error{reason: reason}} ->
          {:error, reason}
      end
    else
      {:error, "API key not found. Please set GEMINI_API_KEY in the environment."}
    end
  end
end
