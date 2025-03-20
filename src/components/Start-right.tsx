import { useState, useEffect, useRef, JSX, Fragment } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";
import { Trash } from "lucide-react";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";
import { problemDetailsMap } from "./Problem_detail";
import { useAuth } from "../AuthContext";
import { apiCall } from "./AI_Prompt";
import PlusbetweenSteps from "./BuildingBlocks/PlusBetweenSteps";
import { apiCallCheck } from "./AI_Check";
import {
  getStepsData,
  getChanged,
  setChanged,
} from "./BuildingBlocks/StepsData";

function Collapsible({
  isOpen,
  children,
  id,
  toggleHint,
  stepId,
  what,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  id?: string;
  toggleHint: (type: "general" | "detailed", stepId: string) => void;
  stepId: string;
  what: "general" | "detailed";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add both max-height AND opacity transitions
    el.style.transition = "max-height 0.4s ease, margin-top 0.4s ease";

    if (isOpen) {
      // Force from 0 → expanded
      el.style.maxHeight = "0px";
      el.style.marginTop = "-2vh";
      el.getBoundingClientRect(); // Force reflow
      el.style.marginTop = "0.5vh";
      el.style.maxHeight = el.scrollHeight + "px";
    } else {
      // Force from expanded → 0
      const currentHeight = el.scrollHeight;
      el.style.maxHeight = currentHeight + "px";
      el.style.marginTop = "0.5vh";
      el.getBoundingClientRect(); // Force reflow
      el.style.marginTop = "-2vh";
      el.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      id={id}
      className="hint-block"
      style={{
        // Start with these defaults; they’ll be overwritten by JS.
        maxHeight: "0px",
        overflow: "hidden",
      }}
      // Toggle the hint on click (optional if you want that behavior).
      onClick={() => toggleHint(what, stepId)}
    >
      {children}
    </div>
  );
}

// ======================
// CORRECT STEP OVERLAY
// ======================
interface CorrectStepOverlayProps {
  onClose: () => void;
  onConfirm: () => void;
  saveChecked: boolean;
  setSaveChecked: (val: boolean) => void;
}
const CorrectStepOverlay: React.FC<CorrectStepOverlayProps> = ({
  onClose,
  onConfirm,
  saveChecked,
  setSaveChecked,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [fadeState, setFadeState] = useState("fade-in-correctStep"); // Initial fade-in

  // Handle fade-out before closing
  const handleClose = () => {
    setFadeState("fade-out-correctStep");
    setTimeout(() => onClose(), 300); // Delay removal after fade-out
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        handleClose(); // Trigger fade-out
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`fullscreen-overlay ${fadeState}`}>
      <div className="overlay-box" ref={overlayRef}>
        <h3>Are you sure you want to reveal the correct step?</h3>
        <label className="mini-overlay-save">
          <input
            type="checkbox"
            checked={saveChecked}
            onChange={() => setSaveChecked(!saveChecked)}
          />
          Save this answer for future
        </label>
        <div className="overlay-buttons">
          <button className="overlay-button" onClick={onConfirm}>
            Yes, Reveal
          </button>
          <button className="overlay-button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================
// STEPS
// ======================

export interface Step {
  id: string; // unique ID for each step
  code: string;
  content: string;
  correctStep: string;
  prompt: string;
  status: {
    correctness: "correct" | "incorrect" | "missing" | "";
    can_be_further_divided: "can" | "cannot" | "";
  };
  general_hint: string;
  detailed_hint: string;
  children: Step[];
  hasparent: boolean;
  isDeleting: boolean;

  showGeneralHint1: boolean;
  showDetailedHint1: boolean;
  showCorrectStep1: boolean;
  showGeneralHint2: boolean;
  showDetailedHint2: boolean;
}

function createBlankStep(): Step {
  return {
    id: `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    code: "",
    content: "New Step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,

    // '1' means the user has unlocked this hint at all
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,

    // '2' means is currently open or collapsed
    showGeneralHint2: false,
    showDetailedHint2: false,
  };
}

const StartRight = () => {
  const [text, setText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // For revealing correct steps
  const [showCorrectStepOverlay, setShowCorrectStepOverlay] = useState<
    number[] | null
  >(null);
  const [saveCorrectStep, setSaveCorrectStep] = useState(false);
  const [savedCorrectSteps, setSavedCorrectSteps] = useState<string[]>([]);

  // ephemeral for fade-in
  const [justUnlockedHintId, setJustUnlockedHintId] = useState<string | null>(
    null
  );

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCorrectSteps") || "[]");
    setSavedCorrectSteps(saved);
  }, []);

  // Build a storage key based on the selected problem name.
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "Default Problem";
  const StorageKey = "step" + `selectedSystemProblem_${selectedProblemName}`;

  // Load saved steps from localStorage on mount.
  useEffect(() => {
    const savedSteps = localStorage.getItem(StorageKey);
    if (savedSteps) {
      try {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
      } catch (error) {
        console.error("Error parsing saved steps:", error);
      }
    } else {
      setSteps([]);
    }
  }, [StorageKey]);

  // Save steps to localStorage whenever they change
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(StorageKey, JSON.stringify(steps));
    }
  }, [steps, StorageKey]);

  // Adjust textarea height on input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setText(target.value);
  };

  // reset textarea height when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        event.target instanceof Node &&
        !textareaRef.current.contains(event.target)
      ) {
        textareaRef.current.style.height = "auto";
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Transform JSON -> Step
  function transformStep(stepData: any, hasParent: boolean = false): Step {
    return {
      id:
        stepData.id ||
        `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      code: stepData.code || "",
      content: stepData.content || "",
      correctStep: stepData.correctStep || "",
      prompt: stepData.prompt || "",
      status: stepData.status || {
        correctness: "",
        can_be_further_divided: "",
      },
      general_hint: stepData.generalHint || "",
      detailed_hint: stepData.detailedHint || "",
      hasparent: hasParent,
      children: stepData.subSteps
        ? transformStepsObject(stepData.subSteps, true)
        : [],
      isDeleting: false,

      showGeneralHint1: false,
      showDetailedHint1: false,
      showCorrectStep1: false,
      showGeneralHint2: false,
      showDetailedHint2: false,
    };
  }

  function transformStepsObject(obj: any, hasParent: boolean = false): Step[] {
    return Object.keys(obj).map((key) => transformStep(obj[key], hasParent));
  }

  // parse JSON input -> Step Tree
  function parseJSONSteps(input: string): Step[] {
    try {
      const parsed = JSON.parse(input);
      if (parsed.steps) {
        return transformStepsObject(parsed.steps, false);
      }
      return transformStepsObject(parsed, false);
    } catch (error) {
      console.error("Invalid JSON input:", error);
      return [];
    }
  }

  // Trigger parse
  const handleSubmit = () => {
    if (text.trim() === "") return;
    const parsedTree = parseJSONSteps(text);
    setSteps(parsedTree);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  async function handleGenerateWithChatGPT(Context: string) {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }
    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    setLoading(true);

    try {
      const gptResponse = await apiCall(text, selectedProblemDetails);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract steps
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  }

  //This is for editor to steptree
  useEffect(() => {
    const fetchStepsData = () => {
      if (getChanged()) {
        const newStepsData = getStepsData();
        if (!newStepsData) return;

        try {
          const stepsArray = transformStepsObject(newStepsData);
          localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
          setSteps(stepsArray);
          setText("");
        } catch (error) {
          console.error("Error processing steps data:", error);
        } finally {
          setLoading(false);
          setChanged(false);
        }
      }
    };

    // Poll every 5 seconds for changes
    const interval = setInterval(fetchStepsData, 5000);
    return () => clearInterval(interval);
  }, [StorageKey]);

  function stepsToString(steps: Step[], prefix: string = ""): string {
    return steps
      .map((step, index) => {
        const currentPrefix = prefix
          ? `${prefix}.${index + 1}`
          : `${index + 1}`;
        let stepStr = `Step ${currentPrefix}: ${step.content}\n`;

        if (step.code) {
          stepStr += `  Code: ${step.code}\n`;
        }
        if (step.general_hint || step.detailed_hint) {
          stepStr += `  Hints: ${step.general_hint} ${step.detailed_hint}\n`;
        }
        if (step.children && step.children.length > 0) {
          stepStr += stepsToString(step.children, currentPrefix);
        }
        return stepStr;
      })
      .join("");
  }

  async function handleGenerateWithChatGPTCheck(Context: string) {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }
    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    setLoading(true);

    try {
      const gptResponse = await apiCallCheck(
        selectedProblemDetails,
        stepsToString(steps)
      );
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  }

  // Delete entire tree
  const HandleDeleteTree = () => {
    setSteps([]);
    localStorage.setItem(StorageKey, "[]");
  };

  // update step content
  function updateStepContentAtPath(
    steps: Step[],
    path: number[],
    newContent: string
  ): Step[] {
    const updatedSteps = steps.map((step) => ({ ...step }));
    let current = updatedSteps;
    for (let i = 0; i < path.length; i++) {
      const idx = path[i];
      if (i === path.length - 1) {
        current[idx] = { ...current[idx], content: newContent };
      } else {
        current[idx] = {
          ...current[idx],
          children: current[idx].children.map((child) => ({ ...child })),
        };
        current = current[idx].children;
      }
    }
    return updatedSteps;
  }

  // Removal with fade-out
  const handleRemoveStep = (id: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => markStepAndChildrenAsDeleting(step, id))
    );
    setTimeout(() => {
      setSteps((prevSteps) => removeStepById(prevSteps, id));
    }, 300);
  };

  function markStepAndChildrenAsDeleting(step: Step, id: string): Step {
    if (step.id === id) {
      return {
        ...step,
        isDeleting: true,
        children: step.children.map((child) => ({
          ...child,
          isDeleting: true,
        })),
      };
    }
    return {
      ...step,
      children: step.children.map((child) =>
        markStepAndChildrenAsDeleting(child, id)
      ),
    };
  }

  function removeStepById(steps: Step[], id: string): Step[] {
    return steps.reduce<Step[]>((acc, step) => {
      if (step.id === id) return acc; // skip
      const newStep = { ...step };
      if (newStep.children && newStep.children.length > 0) {
        newStep.children = removeStepById(newStep.children, id);
      }
      acc.push(newStep);
      return acc;
    }, []);
  }

  // Insert with fade-in
  const insertTopLevelStepAt = (index: number) => {
    const newStep = createBlankStep();
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.splice(index, 0, newStep);
      return newSteps;
    });
    setTimeout(() => {
      animateAndScrollTo(newStep.id);
    }, 0);
  };

  const insertSubStepAtPath = (
    parentPath: number[],
    insertionIndex: number
  ) => {
    const newSubStep = createBlankStep();
    newSubStep.content = "New Substep";
    newSubStep.hasparent = true;

    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps));
      let parent = newSteps;
      for (let i = 0; i < parentPath.length; i++) {
        parent = parent[parentPath[i]].children;
      }
      parent.splice(insertionIndex, 0, newSubStep);
      return newSteps;
    });
    setTimeout(() => {
      animateAndScrollTo(newSubStep.id);
    }, 300);
  };

  function animateAndScrollTo(elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add("fade-in");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const handleAnimationEnd = () => {
      el.classList.remove("fade-in");
      el.removeEventListener("animationend", handleAnimationEnd);
    };
    el.addEventListener("animationend", handleAnimationEnd);
  }

  // Editing logic
  const [editingPath, setEditingPath] = useState<number[] | null>(null);
  const [tempContent, setTempContent] = useState("");

  function handleStartEditing(path: number[], initialValue: string) {
    setEditingPath(path);
    setTempContent(initialValue);
  }

  function handleBlur() {
    if (editingPath !== null) {
      setSteps((prev) =>
        updateStepContentAtPath(prev, editingPath!, tempContent)
      );
      setEditingPath(null);
      setTempContent("");
    }
  }

  // HINT Logic
  function getNumberForStep(step: Step): number | null {
    if (step.general_hint && !step.showGeneralHint1) return 3;
    else if (step.detailed_hint && !step.showDetailedHint1) return 2;
    else if (step.correctStep && !step.showCorrectStep1) return 1;
    return null;
  }

  // Actually open/close an unlocked hint
  const hintKeys = {
    general: "showGeneralHint2",
    detailed: "showDetailedHint2",
  } as const;

  function toggleHint(type: "general" | "detailed", stepId: string) {
    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        if (step.id !== stepId) return step;
        const key = hintKeys[type];
        return {
          ...step,
          [key]: !step[key],
        };
      })
    );
  }

  // Reveal correct step
  function revealCorrectStep(path: number[]) {
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      current[stepIndex].showCorrectStep1 = true;
      current[stepIndex].content = current[stepIndex].correctStep; // Overwrite content
      return newSteps;
    });
    const stepId = `step-${path.join("-")}-correct`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  function handleGiveCorrectStep() {
    if (!showCorrectStepOverlay) return;
    // reveal correct
    revealCorrectStep(showCorrectStepOverlay);

    // save?
    if (saveCorrectStep) {
      const stepId = `step-${showCorrectStepOverlay.join("-")}-correct`;
      const updated = [...savedCorrectSteps, stepId];
      setSavedCorrectSteps(updated);
      localStorage.setItem("savedCorrectSteps", JSON.stringify(updated));
    }
    // done
    setShowCorrectStepOverlay(null);
    setSaveCorrectStep(false);
  }

  // handleGiveHint
  function handleGiveHint(path: number[], hintNumber: number | null) {
    if (hintNumber === null) return;

    // correct step => show overlay or reveal immediately if saved
    if (hintNumber === 1) {
      const stepId = `step-${path.join("-")}-correct`;
      if (savedCorrectSteps.includes(stepId)) {
        revealCorrectStep(path);
      } else {
        setShowCorrectStepOverlay(path); // triggers overlay
      }
      return;
    }

    // otherwise, general/detailed hints
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      const step = current[stepIndex];
      if (hintNumber === 3) step.showGeneralHint1 = true;
      else if (hintNumber === 2) step.showDetailedHint1 = true;
      return newSteps;
    });

    const stepId = `step-${path.join("-")}-${hintNumber}`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  // Rendering logic
  function getBackgroundColor(step: Step): string {
    if (
      step.status.correctness === "" &&
      step.status.can_be_further_divided === ""
    )
      return "transparent";
    if (
      step.status.correctness === "correct" &&
      step.status.can_be_further_divided === "cannot"
    )
      return "rgb(96, 230, 96)";
    if (
      step.status.correctness === "incorrect" &&
      step.status.can_be_further_divided === "cannot"
    )
      return "rgb(255, 99, 99)";
    if (step.status.can_be_further_divided === "can") return "lightblue";
    return "transparent";
  }

  function getBorder(step: Step): string {
    if (step.status.correctness === "missing") return "dashed";
    return "solid";
  }

  function renderTree(steps: Step[], parentPath: number[] = []): JSX.Element[] {
    const elements: JSX.Element[] = [];
    // plus top
    if (parentPath.length === 0) {
      elements.push(
        <PlusbetweenSteps
          key={`plus-top-0`}
          onClick={() => insertTopLevelStepAt(0)}
        />
      );
    } else {
      elements.push(
        <PlusbetweenSteps
          key={`${parentPath.join("-")}-plus-0`}
          onClick={() => insertSubStepAtPath(parentPath, 0)}
        />
      );
    }

    steps.forEach((step, index) => {
      const currentPath = [...parentPath, index];
      const displayPath = currentPath.map((i) => i + 1).join(".");
      const hintNumber = getNumberForStep(step);
      const isCurrentlyEditing =
        editingPath &&
        editingPath.length === currentPath.length &&
        editingPath.every((val, i) => val === currentPath[i]);

      elements.push(
        <Fragment key={`step-${currentPath.join("-")}`}>
          <div
            className={`step-box ${step.isDeleting ? "fade-out" : ""}`}
            id={step.id}
            style={{
              backgroundColor: getBackgroundColor(step),
              border: "1px " + getBorder(step) + " black",
            }}
          >
            <div className="step-title">
              Step {displayPath}:
              <div className="icon-container-start-right">
                <The_muskeltiers
                  number={hintNumber}
                  fill={hintNumber ? "yellow" : "none"}
                  prompt={step.prompt}
                  stepNumber={displayPath}
                  onAddChild={() => insertSubStepAtPath(currentPath, 0)}
                  onEditStep={() =>
                    handleStartEditing(currentPath, step.content)
                  }
                  onGiveHint={() => handleGiveHint(currentPath, hintNumber)}
                />
                <div className="trash">
                  <Trash
                    onClick={() => handleRemoveStep(step.id)}
                    cursor="pointer"
                    strokeWidth={1}
                    width={"1.5vw"}
                    className="trash-icon"
                  />
                </div>
              </div>
            </div>

            {isCurrentlyEditing ? (
              <textarea
                autoFocus
                className="inline-edit-textarea-editing"
                rows={10}
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div
                className={`step-content ${
                  !step.showCorrectStep1 ? "" : "step-content-hinted"
                }`}
              >
                {step.content}
              </div>
            )}

            {/* substeps */}
            {step.children && step.children.length > 0 && (
              <div className="substeps">
                {renderTree(step.children, currentPath)}
              </div>
            )}
          </div>

          {/* Collapsible containers for hints */}
          <div className="hint-container">
            {step.detailed_hint && step.showDetailedHint1 && (
              <Collapsible
                isOpen={step.showDetailedHint2}
                id={`hint-detailed-${step.id}`}
                toggleHint={toggleHint}
                stepId={step.id}
                what={"detailed"}
              >
                {/* Show fade-in if we just unlocked it */}
                <div
                  className={
                    "hint-inner " +
                    (step.showDetailedHint2 ? "extended " : "fade-out-hint") +
                    (justUnlockedHintId === `step-${currentPath.join("-")}-2`
                      ? "fade-in-hint "
                      : "")
                  }
                >
                  {step.showDetailedHint2 ? (
                    <>
                      <strong>Detailed Hint:</strong>
                      <span className="hint-content">{step.detailed_hint}</span>
                    </>
                  ) : (
                    <div className="not-extented-hint">
                      <strong>Detailed Hint:</strong>
                      <span
                        className="hint-content"
                        style={{ visibility: "hidden" }}
                      >
                        {step.detailed_hint}
                      </span>
                    </div>
                  )}
                </div>
              </Collapsible>
            )}

            {step.general_hint && step.showGeneralHint1 && (
              <Collapsible
                isOpen={step.showGeneralHint2}
                id={`hint-general-${step.id}`}
                toggleHint={toggleHint}
                stepId={step.id}
                what={"general"}
              >
                <div
                  className={
                    "hint-inner " +
                    (step.showGeneralHint2 ? "extended " : "") +
                    (justUnlockedHintId === `step-${currentPath.join("-")}-3`
                      ? "fade-in-hint "
                      : "")
                  }
                >
                  {step.showGeneralHint2 ? (
                    <>
                      <strong>General Hint:</strong>
                      <span className="hint-content">{step.general_hint}</span>
                    </>
                  ) : (
                    <div className="not-extented-hint">
                      <strong>General Hint</strong>
                      <span
                        className="hint-content"
                        style={{ visibility: "hidden" }}
                      >
                        {step.general_hint}
                      </span>
                    </div>
                  )}
                </div>
              </Collapsible>
            )}
          </div>

          {/* plus between steps */}
          {parentPath.length === 0 ? (
            <PlusbetweenSteps
              key={`plus-top-${index + 1}`}
              onClick={() => insertTopLevelStepAt(index + 1)}
            />
          ) : (
            <PlusbetweenSteps
              key={`${parentPath.join("-")}-plus-${index + 1}`}
              onClick={() => insertSubStepAtPath(parentPath, index + 1)}
            />
          )}
        </Fragment>
      );
    });

    return elements;
  }

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">
          Step Tree
          {steps.length > 0 && (
            <div className="trash">
              <Trash
                color="black"
                size={"1vw"}
                strokeWidth={1}
                cursor="pointer"
                onClick={HandleDeleteTree}
                className="trash-icon"
              />
            </div>
          )}
        </div>
        <div className="right-main-main">
          <div className="container-step-tree">
            {steps.length > 0 ? (
              <>
                <div className="button-container">
                  <button
                    className="Check-button"
                    onClick={() => handleGenerateWithChatGPTCheck("Check")}
                    disabled={loading}
                    style={{
                      padding: "6px 12px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="Check">
                      {loading ? "Checking..." : "Check"}
                    </div>
                  </button>
                </div>
                {renderTree(steps)}
              </>
            ) : (
              <div className="input-container">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleInput}
                  className="text-input"
                  placeholder="Enter Your Thoughts"
                  style={{
                    height: "75vh",
                    minHeight: "75vh",
                    maxHeight: "75vh",
                    overflowY: "auto",
                  }}
                  rows={1}
                />
                <div className="arrow-container">
                  <HiArrowRight
                    className="submit-icon"
                    onClick={handleSubmit}
                  />
                  <button
                    className="button-cahtgpt"
                    onClick={() => handleGenerateWithChatGPT("From Prompt")}
                    disabled={loading}
                    style={{
                      padding: "6px 12px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== FULLSCREEN OVERLAY ========== */}
      {showCorrectStepOverlay && (
        <CorrectStepOverlay
          onClose={() => setShowCorrectStepOverlay(null)}
          onConfirm={handleGiveCorrectStep}
          saveChecked={saveCorrectStep}
          setSaveChecked={setSaveCorrectStep}
        />
      )}
    </div>
  );
};

export default StartRight;
