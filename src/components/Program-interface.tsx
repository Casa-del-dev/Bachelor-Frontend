import _, { useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

export default function PythonPlayground() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const { isAuthenticated } = useAuth();

  const handleRunCode = async () => {
    setOutput("Running...");
    if (!isAuthenticated) {
      setOutput("Need to login");
    } else {
      try {
        const response = await axios.post("http://127.0.0.1:8000/run-python/", {
          code: code,
        });

        setOutput(response.data.output);
      } catch (error) {
        console.error("Error:", error);
        setOutput("Error: Could not connect to backend.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Python Playground</h1>
      <div className="border p-4 rounded-lg">
        <textarea
          className="w-full h-40 border rounded-lg p-2"
          placeholder="Write your Python code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleRunCode}
        >
          Run Python Code
        </button>
        <h2 className="mt-4 font-semibold">Output:</h2>
        <textarea
          className="mt-2 w-full border p-2 rounded-lg"
          readOnly
          value={output}
        />
      </div>
    </div>
  );
}
