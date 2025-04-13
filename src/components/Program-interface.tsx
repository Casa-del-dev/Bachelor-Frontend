import { useState, useMemo, Dispatch, SetStateAction, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import {
  ViewPlugin,
  Decoration,
  DecorationSet,
  EditorView,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { Network, Paintbrush } from "lucide-react";
import { useAuth } from "../AuthContext";
import { problemDetailsMap } from "./Problem_detail";
import ApiCallEditor from "./AI_Editor.tsx";
import { setStepsData, setChanged } from "./BuildingBlocks/StepsData.tsx";
import "./Program-interface.css";
import { Step } from "./Start.tsx";
import { useCodeContext } from "../CodeContext.tsx";

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

export interface Tree {
  rootNode: TreeNode;
}

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

interface PythonPlaygroundProps {
  setHoveredStep: (step: Step | null) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setFromEditor: Dispatch<SetStateAction<boolean>>;
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, code: string) => void;
  currentFile: number | null;
  currentFileName: string | null;
}

export default function PythonPlayground({
  setHoveredStep,
  loading,
  setLoading,
  setFromEditor,
  codeMap,
  setCodeForFile,
  currentFile,
  currentFileName,
}: PythonPlaygroundProps) {
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [fadeClass, setFadeClass] = useState("");
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("colorMode") === "true";
  });

  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  const StorageKey = `stepselectedSystemProblem_${selectedProblemName}`;

  const { fileTree } = useCodeContext();

  function loadStepsTree(): Step[] {
    const stored = localStorage.getItem(StorageKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing step tree from local storage:", e);
      return [];
    }
  }

  const editorExtensions = useMemo(() => {
    const extensions = [python(), EditorView.lineWrapping];

    if (!colorMode) {
      extensions.push(createStepHighlightPlugin(setHoveredStep, loadStepsTree));
    }

    return extensions;
  }, [colorMode, setHoveredStep]);

  function findMatchingStepForLine(
    lineText: string,
    steps: Step[]
  ): Step | null {
    for (const step of steps) {
      if (
        lineText.trim() !== "" &&
        step.code &&
        step.code.includes(lineText.trim())
      ) {
        return step;
      }
      if (step.children && step.children.length > 0) {
        const match = findMatchingStepForLine(lineText, step.children);
        if (match) return match;
      }
    }
    return null;
  }

  function createStepHighlightPlugin(
    onHoverStep: (step: Step | null) => void,
    loadStepsTree: () => Step[]
  ) {
    return ViewPlugin.fromClass(
      class {
        decorations: DecorationSet = Decoration.none;
        hoveredLine: number | null = null;

        constructor(public view: EditorView) {
          this.attachListeners(view);
        }

        attachListeners(view: EditorView) {
          view.dom.addEventListener("mousemove", this.handleMouseMove);
          view.dom.addEventListener("mouseleave", this.handleMouseLeave);
        }

        handleMouseMove = (e: MouseEvent) => {
          const pos = this.view.posAtCoords({ x: e.clientX, y: e.clientY });
          if (pos == null) {
            if (this.hoveredLine !== null) {
              this.clearDecoration();
            }
            onHoverStep(null);
            return;
          }

          const line = this.view.state.doc.lineAt(pos);
          const steps = loadStepsTree();
          const match = findMatchingStepForLine(line.text, steps);

          if (!match) {
            if (this.hoveredLine !== null) {
              this.clearDecoration();
            }
            onHoverStep(null);
            return;
          }

          onHoverStep(match);

          if (this.hoveredLine !== line.number) {
            this.hoveredLine = line.number;
            this.updateDecorations(line);
          }
        };

        handleMouseLeave = () => {
          this.clearDecoration();
          onHoverStep(null);
        };

        updateDecorations(line: { from: number; number: number }) {
          const builder = new RangeSetBuilder<Decoration>();
          builder.add(
            line.from,
            line.from,
            Decoration.line({ attributes: { class: "cm-hover-step-line" } })
          );
          this.decorations = builder.finish();
          this.view.dispatch({ effects: [] });
        }

        clearDecoration() {
          this.hoveredLine = null;
          this.decorations = Decoration.none;
          this.view.dispatch({ effects: [] });
        }

        update(update: ViewUpdate) {
          if (this.hoveredLine !== null) {
            const line = update.state.doc.line(this.hoveredLine);
            const builder = new RangeSetBuilder<Decoration>();
            builder.add(
              line.from,
              line.from,
              Decoration.line({ attributes: { class: "cm-hover-step-line" } })
            );
            this.decorations = builder.finish();
          }
        }

        destroy() {
          this.view.dom.removeEventListener("mousemove", this.handleMouseMove);
          this.view.dom.removeEventListener(
            "mouseleave",
            this.handleMouseLeave
          );
        }
      },
      {
        decorations: (plugin) => plugin.decorations,
      }
    );
  }

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
    if (loading) return;

    setLoading(true);
    setFromEditor(true);
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (currentFile === null || codeMap[currentFile]?.trim() === "") return;

    const selectedProblem = "Problem 1";

    const selectedProblemDetails = problemDetailsMap[selectedProblem];
    try {
      const code = codeMap[currentFile];
      const gptResponse = await ApiCallEditor(selectedProblemDetails, code);

      setChanged(true);

      const rawMessage = gptResponse.choices?.[0]?.message?.content;
      if (!rawMessage) {
        throw new Error("GPT response missing content");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawMessage);
      } catch (e) {
        console.error("Failed to parse GPT response:", rawMessage);
        throw e;
      }

      // Only update code if there's a valid parsed `code` object
      if (parsedResponse.code) {
        if (typeof parsedResponse.code === "object") {
          Object.entries(parsedResponse.code).forEach(([fileId, codeValue]) => {
            if (typeof codeValue === "string") {
              setCodeForFile(Number(fileId), codeValue);
            } else {
              console.warn(`Invalid code for fileId ${fileId}:`, codeValue);
            }
          });
        } else if (typeof parsedResponse.code === "string") {
          // Apply to the currently active file
          if (currentFile !== null) {
            setCodeForFile(currentFile, parsedResponse.code);
          } else {
            console.warn(
              "Received single code string, but no current file is selected."
            );
          }
        } else {
          console.warn(
            "Unexpected type for 'code':",
            typeof parsedResponse.code
          );
        }
      } else {
        console.warn(
          "No 'code' field found in parsed response:",
          parsedResponse
        );
      }

      const stepsData = parsedResponse.steps || parsedResponse;
      setStepsData(stepsData);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    }
  };

  useEffect(() => {
    // Just to demonstrate dependency
  }, [codeMap]);

  useEffect(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    setColorMode(storedColorMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode.toString());
  }, [colorMode]);

  function convertFileItemToTreeNode(item: FileItem): TreeNode {
    return {
      id: item.id.toString(), // Convert number id to string
      name: item.name,
      type: item.type,
      children: item.children
        ? item.children.map(convertFileItemToTreeNode)
        : [],
    };
  }

  function saveCodeToBackend(updatedCode: string) {
    const token = localStorage.getItem("authToken");
    if (!token || currentFile == null) return;

    // Convert fileTree (FileItem[]) to the expected tree structure for the backend
    const treeToSubmit: Tree = {
      rootNode: {
        id: "root",
        name: "root",
        type: "folder",
        children: fileTree.map(convertFileItemToTreeNode),
      },
    };

    // Create a codeMap object for the currently active file.
    const updatedCodeMap = { [currentFile]: updatedCode };

    // IMPORTANT: Note the property key here is "tree", which the backend expects.
    fetch("https://bachelor-backend.erenhomburg.workers.dev/problem/v1/save", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problemId: selectedProblemName,
        tree: treeToSubmit,
        codeMap: updatedCodeMap,
      }),
    }).catch((err) => console.error("Failed to save from playground:", err));
  }

  return (
    <div className="container-programming-bro">
      <div className="title-middle-programming">
        <div className="Title-current-edit">
          {selectedProblemName} - {currentFileName}
        </div>
        <div className="middlepart-title-right">
          <Paintbrush
            className="Network"
            style={{
              padding: "0.5vw",
              cursor: "pointer",
              color: colorMode ? "#999" : "#0077cc",
            }}
            size={"1.5vw"}
            onClick={() => {
              setColorMode((prev) => {
                const newValue = !prev;
                if (newValue) {
                  setHoveredStep(null);
                }
                return newValue;
              });
            }}
          />
          <Network
            className="Network"
            style={{ padding: "0.5vw", cursor: "pointer" }}
            size={"1.5vw"}
            onClick={handleGenerateStepTree}
          />
        </div>
      </div>
      {currentFile !== null && currentFile !== undefined && (
        <CodeMirror
          className="ILoveEprogg"
          value={codeMap[currentFile] || ""}
          extensions={[editorExtensions]}
          onChange={(newCode) => {
            setCodeForFile(currentFile, newCode);
            saveCodeToBackend(newCode);
          }}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
          }}
        />
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
