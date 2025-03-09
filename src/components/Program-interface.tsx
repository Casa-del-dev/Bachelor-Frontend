import { useCodeContext } from "../CodeContext";

export default function PythonPlayground() {
  const { code, setCode } = useCodeContext();

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
      </div>
    </div>
  );
}
