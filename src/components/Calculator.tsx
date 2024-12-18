import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import init, {
  add,
  subtract,
  multiply,
  divide,
  calculate,
} from "../wasm/backend";

const WasmCalculator = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [expression, setExpression] = useState("");

  useEffect(() => {
    init();
  }, []);

  const handleOperation = async (operation: string) => {
    try {
      setError("");
      let calcResult;

      switch (operation) {
        case "add":
          calcResult = add(parseFloat(num1), parseFloat(num2));
          break;
        case "subtract":
          calcResult = subtract(parseFloat(num1), parseFloat(num2));
          break;
        case "multiply":
          calcResult = multiply(parseFloat(num1), parseFloat(num2));
          break;
        case "divide":
          calcResult = divide(parseFloat(num1), parseFloat(num2));
          break;
        default:
          throw new Error("Invalid operation");
      }
      setResult(calcResult.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleCalculate = async () => {
    try {
      setError("");
      const calcResult = calculate(expression);
      setResult(calcResult.toString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>WASM Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="num1">Number 1</Label>
              <Input
                id="num1"
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="Enter first number"
                className="mb-2"
              />
              <Label htmlFor="num2">Number 2</Label>
              <Input
                id="num2"
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="Enter second number"
                className="mb-2"
              />
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button onClick={() => handleOperation("add")}>Add</Button>
                <Button onClick={() => handleOperation("subtract")}>
                  Subtract
                </Button>
                <Button onClick={() => handleOperation("multiply")}>
                  Multiply
                </Button>
                <Button onClick={() => handleOperation("divide")}>
                  Divide
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="expression">Expression</Label>
              <Input
                id="expression"
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="(25+17)*34"
                className="mb-2"
              />
              <Button onClick={handleCalculate} className="w-full">
                Calculate Expression
              </Button>
            </div>

            <div className="mt-4">
              <Label className="font-bold">Result:</Label>
              {error ? (
                <div className="text-red-500 font-semibold">{error}</div>
              ) : (
                <div className="text-2xl font-bold">{result}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasmCalculator;
