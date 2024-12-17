import { useState, useEffect } from "react";
import init, { add, subtract, multiply, divide } from "./wasm/backend";

const App = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    init();
  }, []);

  const handleCalculation = (operation: string) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    let res = 0;
    switch (operation) {
      case "add":
        res = add(numA, numB);
        break;
      case "subtract":
        res = subtract(numA, numB);
        break;
      case "multiply":
        res = multiply(numA, numB);
        break;
      case "divide":
        res = divide(numA, numB);
        break;
      default:
        res = 0;
    }
    setResult(res);
  };

  return (
    <div>
      <h1>Calculator</h1>
      <input
        type="number"
        value={a}
        onChange={(e) => setA(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={b}
        onChange={(e) => setB(e.target.value)}
        placeholder="Enter second number"
      />
      <div>
        <button onClick={() => handleCalculation("add")}>Add</button>
        <button onClick={() => handleCalculation("subtract")}>Subtract</button>
        <button onClick={() => handleCalculation("multiply")}>Multiply</button>
        <button onClick={() => handleCalculation("divide")}>Divide</button>
      </div>
      {result !== null && <h2>Result: {result}</h2>}
    </div>
  );
};

export default App;
