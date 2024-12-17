import { useState, useEffect } from "react";
import init, { add, subtract, multiply, divide } from "../wasm/backend";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Calculator() {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    init();
  }, []);

  const handleInput = (value: string) => {
    setDisplay((prev) => prev + value);
  };

  const handleCalculate = () => {
    try {
      const [a, op, b] = display.split(/([+\-*/])/);
      const numA = parseFloat(a);
      const numB = parseFloat(b);

      let res: number;
      switch (op) {
        case "+":
          res = add(numA, numB);
          break;
        case "-":
          res = subtract(numA, numB);
          break;
        case "*":
          res = multiply(numA, numB);
          break;
        case "/":
          res = divide(numA, numB);
          break;
        default:
          throw new Error("Invalid operation");
      }
      setResult(res);
    } catch (error) {
      setResult(null);
      setDisplay("Error");
    }
  };

  const handleClear = () => {
    setDisplay("");
    setResult(null);
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "+",
    "=",
  ];

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex items-center justify-center p-4">
      <div className="calculator-body">
        <div className="display-container">
          <div className="display-glass">
            <div className="display-content">
              {display || "0"}
              {result !== null && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="result"
                  >
                    = {result}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
        <div className="keypad">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() =>
                btn === "=" ? handleCalculate() : handleInput(btn)
              }
              className="calculator-button"
            >
              {btn}
            </Button>
          ))}
        </div>
        <Button onClick={handleClear} className="clear-button">
          Clear
        </Button>
        <div className="gear gear-1"></div>
        <div className="gear gear-2"></div>
        <div className="gear gear-3"></div>
      </div>
    </div>
  );
}
