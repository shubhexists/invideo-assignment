import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeDisplay } from "./CodeDisplay";
import ShaderCanvas from "@/components/ui/shaderCanvas";
import { shaders } from "./Fallbacks";

export default function ShaderGenerator() {
  const [text, setText] = useState("");
  const [vertexShader, setVertexShader] = useState("");
  const [fragmentShader, setFragmentShader] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCanvasError, setHasCanvasError] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setVertexShader("");
    setFragmentShader("");
    setHasCanvasError(false);

    try {
      const response = await fetch(
        " https://invideo-assignment-1.onrender.com/api/generate_content",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.data.candidates[0].content.parts[0].text;

      const parsedData = JSON.parse(rawText);

      setVertexShader(parsedData["Vertex Shader"]);
      setFragmentShader(parsedData["Fragment Shader"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to generate shader. Using a fallback shader.");
      const fallback = shaders[Math.floor(Math.random() * shaders.length)];
      setVertexShader(fallback.Vertex);
      setFragmentShader(fallback.Fragment);
    } finally {
      setLoading(false);
    }
  };

  const handleCanvasError = () => {
    const random = Math.floor(Math.random() * (shaders.length - 1));
    setRandomIndex(random);
    setHasCanvasError(true);
  };

  return (
    <div className="space-y-4 p-4">
      <Input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text to generate shader"
        className="w-full text-white"
      />
      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Generating..." : "Generate Shader"}
      </Button>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasCanvasError ? (
        <>
          <ShaderCanvas
            vertexShader={shaders[randomIndex].Vertex}
            fragmentShader={shaders[randomIndex].Fragment}
          />
          <CodeDisplay
            title="Fallback Vertex Shader"
            code={shaders[randomIndex].Vertex}
          />
          <CodeDisplay
            title="Fallback Fragment Shader"
            code={shaders[randomIndex].Fragment}
          />
        </>
      ) : (
        vertexShader &&
        fragmentShader && (
          <>
            <ShaderCanvas
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              onError={handleCanvasError}
            />
            <CodeDisplay title="Vertex Shader" code={vertexShader} />
            <CodeDisplay title="Fragment Shader" code={fragmentShader} />
          </>
        )
      )}
    </div>
  );
}
