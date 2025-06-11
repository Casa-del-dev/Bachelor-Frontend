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

const stepTutorialHope: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: `# Step 1
    roman_map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }`,
    content: "Create a mapping of Roman numerals to their integer values.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-2602",
    code: `# Step 2
    total = 0
    prev_value = 0`,
    content: "Initialize total and previous value variables.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-1176",
    code: `# Step 3
    for char in reversed(s):`,
    content:
      "Iterate over the characters in the reversed Roman numeral string.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "Consider breaking down the iteration process into smaller steps.",
    detailed_hint:
      "Each iteration involves multiple actions: retrieving the value, comparing it, and updating the total and previous value.",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-224",
    code: `# Step 4
    return total`,
    content: "Return the total integer value.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-8468",
    code: `# Step 3.1
        value = roman_map[char]`,
    content:
      "Retrieve the integer value for the current Roman numeral character.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-9166",
    code: `# Step 3.2
        if value < prev_value:
            total -= value  # Subtract if a smaller value precedes a larger one
        else:
            total += value
            prev_value = value`,
    content:
      "Compare the current value with the previous value to decide whether to add or subtract.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialFile = `def roman_to_int(s):
    roman_map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }
    
    total = 0
    prev_value = 0

    for char in reversed(s):
        value = roman_map[char]
        if value < prev_value:
            total -= value  # Subtract if a smaller value precedes a larger one
        else:
            total += value
            prev_value = value

    return total`;

const tutorialFileCommented = `def roman_to_int(s):
    # Step 1
    roman_map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }
    
    # Step 2
    total = 0
    prev_value = 0

    # Step 3
    for char in reversed(s):
        # Step 3.1
        value = roman_map[char]
        # Step 3.2
        if value < prev_value:
            total -= value  # Subtract if a smaller value precedes a larger one
        else:
            total += value
            prev_value = value

    # Step 4
    return total
`;

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
  codeMap: Record<number, string | null>;
  setCodeForFile: (fileId: number, code: string | null) => void;
  currentFile: number | null;
  currentFileName: string | null;
  fileTree: FileItem[];
  problemId: string;
  stepTree: any;
  currentIndex?: number;
  ref1?: React.RefObject<HTMLDivElement>;
  ref2?: React.RefObject<HTMLDivElement>;
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
  fileTree,
  problemId,
  stepTree,
  currentIndex,
  ref1,
  ref2,
}: PythonPlaygroundProps) {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [fadeClass, setFadeClass] = useState("");
  const [colorMode, setColorMode] = useState(() => {
    return localStorage.getItem("colorMode") === "true";
  });

  const [isDarkMode, setIsDarkMode] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
    };

    checkDarkMode(); // Check once immediately
    const observer = new MutationObserver(checkDarkMode);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const selectedProblemName = problemId;

  function loadStepsTree(): Step[] {
    return stepTree;
  }

  const editorExtensions = useMemo(() => {
    const extensions = [python(), EditorView.lineWrapping];
    if (!colorMode) {
      extensions.push(
        createStepHighlightPlugin(setHoveredStep, loadStepsTree, currentIndex)
      );
    }

    return extensions;
    // note: include stepTree here so plugin sees new value
  }, [colorMode, setHoveredStep, stepTree, currentIndex]);

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
    loadStepsTree: () => Step[],
    currentIndex: number = 0
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
          const match = findMatchingStepForLine(
            line.text,
            localStorage.getItem("tutorialStep") &&
              currentIndex! < 25 &&
              23 <= currentIndex!
              ? stepTutorialHope
              : steps
          );

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

  function findItemById(tree: FileItem[], targetId: number): FileItem | null {
    for (const item of tree) {
      if (item.id === targetId) return item;
      if (item.type === "folder" && item.children) {
        const found = findItemById(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
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

    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (
      currentFile === null ||
      codeMap[currentFile]?.trim() === "" ||
      currentFile === -1
    )
      return;

    setLoading(true);
    setFromEditor(true);
    const selectedProblem = problemId;

    const selectedProblemDetails = problemDetailsMap[selectedProblem];
    try {
      const code = codeMap[currentFile];

      if (!code) return;

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
              setTimeout(() => {
                saveCodeToBackend(codeValue);
              }, 0);
            } else {
              console.warn(`Invalid code for fileId ${fileId}:`, codeValue);
            }
          });
        } else if (typeof parsedResponse.code === "string") {
          // Apply to the currently active file
          if (currentFile !== null) {
            setCodeForFile(currentFile, parsedResponse.code);
            setTimeout(() => {
              saveCodeToBackend(parsedResponse.code);
            }, 0);
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
    if (currentFile && codeMap[currentFile])
      saveCodeToBackend(codeMap[currentFile]);
  }, [codeMap]);

  useEffect(() => {
    const storedColorMode = localStorage.getItem("colorMode");
    setColorMode(storedColorMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("colorMode", colorMode.toString());
  }, [colorMode]);

  //click ESC in modal modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTimeout(() => {
          setShowModal(false);
        }, 300);
        setFadeClass("fade-out");
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  //click outside of the modal
  useEffect(() => {
    if (!showModal) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(e.target as Node)) {
        // If the click is NOT inside the modal -> close it
        setTimeout(() => {
          setShowModal(false);
        }, 300);
        setFadeClass("fade-out");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

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

  //Handle the network click when no file is selected
  // -------------------------------------------------------------
  // 1) New “tooltip” state to track visibility, coords, fade‐class
  // -------------------------------------------------------------
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });

  const [hoverTimer, setHoverTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // -------------------------------------------------------------
  // 2) Extract exactly the same “disabled” condition you had inline
  // -------------------------------------------------------------
  const isNetworkDisabled =
    currentFile === null ||
    codeMap[currentFile]?.trim() === "" ||
    currentFile === -1 ||
    findItemById(fileTree, currentFile)?.type === "folder" ||
    currentFile === undefined;

  // --------------------------------------------
  // 3) New click handler that shows a tooltip
  // --------------------------------------------
  const handleMouseEnterNetwork = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isNetworkDisabled) return;

    // record where we hovered
    let leftShift = 0;
    if (localStorage.getItem("authToken") === null) {
      leftShift = 140;
    } else {
      leftShift = 220;
    }
    const x = e.clientX - leftShift;
    const y = e.clientY + 15; // a little “below” the cursor

    // start a 2 second timer.
    const id = setTimeout(() => {
      setTooltip({ visible: true, x, y });
    }, 2000);

    setHoverTimer(id);
  };

  const handleMouseLeaveNetwork = () => {
    // If the user leaves before 2 seconds, cancel the timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    // If the tooltip was already visible, hide it immediately
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const [tutorialFileActually, setTutorialFileActually] = useState<string>("");
  useEffect(() => {
    if (currentIndex === 1) {
      setColorMode(true);
    }
    if (currentIndex === 11) {
      setTutorialFileActually(tutorialFile);
    }
    if (currentIndex === 20) {
      setTutorialFileActually(tutorialFileCommented);
    }
    if (currentIndex === 23) {
      setColorMode(false);
    }
  }, [currentIndex]);

  return (
    <div className="container-programming-bro">
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            zIndex: 1000,
          }}
        >
          {localStorage.getItem("authToken") === null
            ? "Please Login first"
            : "Select a valid file with code first"}
        </div>
      )}
      <div className="title-middle-programming">
        <div className="Title-current-edit">
          {selectedProblemName} - {currentFileName}
        </div>
        <div className="middlepart-title-right">
          <div
            ref={ref2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
          </div>
          <div
            ref={ref1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Network
              className={`Network ${isNetworkDisabled ? "disabled" : ""}`}
              style={{ padding: "0.5vw" }}
              size={"1.5vw"}
              onMouseEnter={handleMouseEnterNetwork}
              onMouseLeave={handleMouseLeaveNetwork}
              onClick={() => {
                if (!isNetworkDisabled) {
                  handleGenerateStepTree();
                }
              }}
            />
          </div>
        </div>
      </div>
      {isAuthenticated ? (
        currentFile !== null &&
        currentFile !== undefined &&
        codeMap[currentFile] !== null ? (
          <CodeMirror
            className="ILoveEprogg"
            value={codeMap[currentFile] || ""}
            extensions={[editorExtensions]}
            onChange={(newCode) => {
              setCodeForFile(currentFile, newCode);
              saveCodeToBackend(newCode);
            }}
            theme={isDarkMode === "dark" ? "dark" : "light"}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
            }}
          />
        ) : (
          <div className="blank-file-selector">Select A File</div>
        )
      ) : localStorage.getItem("tutorialStep") && currentFile ? (
        <CodeMirror
          className="ILoveEprogg"
          value={tutorialFileActually || ""}
          extensions={[editorExtensions]}
          theme={isDarkMode === "dark" ? "dark" : "light"}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
          }}
        />
      ) : (
        <div className="blank-file-selector">Login Needed</div>
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
