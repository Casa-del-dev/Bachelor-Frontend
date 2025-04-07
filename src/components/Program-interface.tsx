import { useState, useMemo, Dispatch, SetStateAction, useEffect } from "react";
import { useCodeContext } from "../CodeContext";
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

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface PythonPlaygroundProps {
  setHoveredStep: (step: Step | null) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setFromEditor: Dispatch<SetStateAction<boolean>>;
}

export default function PythonPlayground({
  setHoveredStep,
  loading,
  setLoading,
  setFromEditor,
}: PythonPlaygroundProps) {
  const { code, setCode, currentFile } = useCodeContext();
  const isAuthenticated = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [fadeClass, setFadeClass] = useState("");
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("colorMode") === "true";
  });

  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  const systemStorageKey = `sysSelectedSystemProblem_${selectedProblemName}`;
  const StorageKey = `stepselectedSystemProblem_${selectedProblemName}`;

  const storedTree = localStorage.getItem(systemStorageKey);
  const fileTree = storedTree ? JSON.parse(storedTree) : [];

  /*   --------------------------------------
  Code Mirror Line checking START
  -------------------------------------- */

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

  // Recursively check if the line text is part of any step.code.
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

  // Plugin factory: accepts a callback to update hovered step.
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
            // Mouse is outside the editor.
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
            // If no match is found on this line, clear the decoration.
            if (this.hoveredLine !== null) {
              this.clearDecoration();
            }
            onHoverStep(null);
            return;
          }

          // There is a matching step.
          onHoverStep(match);

          // Update decoration if hovering a different line.
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

  /*   --------------------------------------
  Code Mirror Line checking END
  -------------------------------------- */

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
    if (loading) return;

    setLoading(true);
    setFromEditor(true);
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

      setCode(parsedResponse.code);

      // Extract steps
      const stepsData = parsedResponse.steps || parsedResponse;
      setStepsData(stepsData);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
    }
  };

  /*   -----------------------------
  PaintBrush functions START
  ----------------------------- */

  useEffect(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    if (storedColorMode === "true") {
      setColorMode(true);
    } else {
      setColorMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode.toString());
  }, [colorMode]);

  /* -----------------------------
  PaintBrush functions END
  ----------------------------- */

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
      {currentFile ? (
        <CodeMirror
          className="ILoveEprogg"
          value={code}
          extensions={[editorExtensions]}
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
