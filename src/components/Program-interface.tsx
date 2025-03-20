import { useState } from "react";
import { useCodeContext } from "../CodeContext";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
import { Network } from "lucide-react";
import { useAuth } from "../AuthContext";
import { problemDetailsMap } from "./Problem_detail";
import ApiCallEditor from "./AI_Editor.tsx";
import { setStepsData, setChanged } from "./BuildingBlocks/StepsData.tsx";
import "./Program-interface.css";

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

export default function PythonPlayground() {
  const { code, setCode, currentFile } = useCodeContext();
  const [call, setCall] = useState(false);
  const isAuthenticated = useAuth();

  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  const systemStorageKey = `sysSelectedSystemProblem_${selectedProblemName}`;
  const storedTree = localStorage.getItem(systemStorageKey);
  const fileTree = storedTree ? JSON.parse(storedTree) : [];

  // Recursive function to find a file name by its id.
  const findFileNameById = (tree: FileItem[], id: number): string | null => {
    for (let item of tree) {
      if (item.id === id) {
        return item.name;
      }
      if (item.children) {
        const found = findFileNameById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentFileName = currentFile
    ? findFileNameById(fileTree, currentFile)
    : "No File Selected";

  /* --------------
  API Call
  -------------- */
  const onGenerateStepTreeFromCode = async () => {
    setCall(true);
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (code.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";

    if (selectedProblem === "Default Problem") return;

    const selectedProblemDetails = problemDetailsMap[selectedProblem];
    try {
      const gptResponse = await ApiCallEditor(selectedProblemDetails, code);
      setChanged(true);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract steps
      const stepsData = parsedResponse.steps || parsedResponse;
      setStepsData(stepsData);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setCall(false);
    }
  };

  return (
    <div className="container-programming-bro">
      <div className="title-middle-programming">
        <div className="Title-current-edit">
          {selectedProblemName} - {currentFileName}
        </div>
        {!call ? (
          <Network
            className="Network"
            style={{ padding: "0.5vw", cursor: "pointer" }}
            size={"1.5vw"}
            onClick={onGenerateStepTreeFromCode}
          />
        ) : (
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
      </div>
      {currentFile ? (
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
      ) : (
        ""
      )}
    </div>
  );
}
