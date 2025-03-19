import { useCodeContext } from "../CodeContext";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import "./Program-interface.css";

export default function PythonPlayground() {
  const { code, setCode, currentFile } = useCodeContext();
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  return (
    <div className="container-programming-bro">
      <div className="Title-current-edit">
        {selectedProblemName} - {currentFile}
      </div>
      <CodeMirror
        className="ILoveEprogg"
        value={code}
        extensions={[python(), EditorView.lineWrapping]}
        onChange={(newCode) => setCode(newCode)}
        theme="light"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
        }}
      />
    </div>
  );
}
