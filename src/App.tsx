import { useState } from "react";
import Calculator from "./components/Calculator";
import RenderCanvas from "./components/Shader";

const CalculatorComponent = () => (
  <div className="text-lg text-gray-700 w-screen">
    <Calculator />
  </div>
);
const Shader = () => (
  <div className="p-6 text-lg text-gray-700 w-screen">
    <RenderCanvas />
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  const renderContent = () => {
    switch (activeTab) {
      case "calculator":
        return <CalculatorComponent />;
      case "shader":
        return <Shader />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex w-full border-b border-gray-300">
        <button
          className={`flex-1 py-4 text-center ${
            activeTab === "calculator"
              ? "border-b-4 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("calculator")}
        >
          Calculator
        </button>
        <button
          className={`flex-1 py-4 text-center ${
            activeTab === "shader"
              ? "border-b-4 border-blue-500 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab("shader")}
        >
          Shader
        </button>
      </div>
      <div className="flex-1 w-full  bg-[#2C2C2C] p-8">{renderContent()}</div>
    </div>
  );
};

export default App;
