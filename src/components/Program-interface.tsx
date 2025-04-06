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
import step from "./Start-right.tsx";

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
  const [showModal, setShowModal] = useState(false);
  const [fadeClass, setFadeClass] = useState("");

  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  const systemStorageKey = `sysSelectedSystemProblem_${selectedProblemName}`;
  const StorageKey = "step" + `selectedSystemProblem_${selectedProblemName}`;

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
  const handleGenerateStepTree = () => {
    const dontAsk = localStorage.getItem("dontAskGenerateStepTree");
    if (dontAsk === "true") {
      onGenerateStepTreeFromCode();
    } else {
      setShowModal(true);
      setFadeClass("fade-in");
    }
  };

  const handleYes = () => {
    setTimeout(() => {
      setShowModal(false);
    }, 300);
    setFadeClass("fade-out");
    onGenerateStepTreeFromCode();
  };

  const handleNo = () => {
    setTimeout(() => {
      setShowModal(false);
    }, 300);
    setFadeClass("fade-out");
  };

  const handleYesDontAskAgain = () => {
    localStorage.setItem("dontAskGenerateStepTree", "true");
    setTimeout(() => {
      setShowModal(false);
    }, 300);
    setFadeClass("fade-out");
    onGenerateStepTreeFromCode();
  };

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
            onClick={handleGenerateStepTree}
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
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setTimeout(() => {
                setShowModal(false);
              }, 300);
              setFadeClass("fade-out");
            }
          }}
        >
          <div className={`modal-content ${fadeClass}`}>
            <p>
              Are you sure you want to create a new step tree from the editor?
            </p>
            <div className="modal-buttons">
              <div className="modal-row">
                <button className="yes" onClick={handleYes}>
                  Yes
                </button>
                <button className="no" onClick={handleNo}>
                  No
                </button>
              </div>
              <button className="skip" onClick={handleYesDontAskAgain}>
                ✔️ Yes and don't ask again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
