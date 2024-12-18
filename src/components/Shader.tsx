import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShaderCanvas from "@/components/ui/shaderCanvas";

export default function ShaderGenerator() {
  const [text, setText] = useState("");
  const [vertexShader, setVertexShader] = useState("");
  const [fragmentShader, setFragmentShader] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:4000/api/generate_content",
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

      console.log("VERTEX :: ", parsedData["Vertex Shader"]);
      console.log("FRAGMENT :: ", parsedData["Fragment Shader"]);

      setVertexShader(parsedData["Vertex Shader"]);
      setFragmentShader(parsedData["Fragment Shader"]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to generate shader. Please try again.");
    } finally {
      setLoading(false);
    }
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
      {error && <p className="text-red-500">{error}</p>}
      {vertexShader && fragmentShader && (
        <ShaderCanvas
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      )}
    </div>
  );
}
