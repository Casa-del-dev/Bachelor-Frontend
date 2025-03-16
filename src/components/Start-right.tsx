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
  };
}

const StartRight = () => {
  const [text, setText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

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
        console.error("Error parsing saved steps from localStorage:", error);
      }
    } else {
      setSteps([]);
    }
  }, [StorageKey]);

  // Save steps to localStorage when they change.
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(StorageKey, JSON.stringify(steps));
    }
  }, [steps, StorageKey]);

  // Adjust textarea height on input.
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setText(target.value);
  };

  // Transform JSON data into the Step interface recursively.
  const transformStep = (stepData: any, hasParent: boolean = false): Step => {
    return {
      id:
        stepData.id ||
        `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      code: stepData.code || "",
      content: stepData.content || "",
      correctStep: stepData.correctStep || "",
      prompt: stepData.prompt || "",
      status: stepData.status || "",
      general_hint: stepData.generalHint || "",
      detailed_hint: stepData.generalHint || "",
      hasparent: hasParent,
      children: stepData.subSteps
        ? transformStepsObject(stepData.subSteps, true)
        : [],
      isDeleting: false,
    };
  };

  const transformStepsObject = (
    obj: any,
    hasParent: boolean = false
  ): Step[] => {
    return Object.keys(obj).map((key) => transformStep(obj[key], hasParent));
  };

  // Parse JSON input into a tree structure.
  const parseJSONSteps = (input: string): Step[] => {
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
  };

  // Trigger parsing and setting the steps tree.
  const handleSubmit = () => {
    if (text.trim() === "") return;
    const parsedTree = parseJSONSteps(text);
    setSteps(parsedTree);
    console.log("Parsed Steps:", parsedTree);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Reset textarea height when clicking outside.
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

  /**
   * API Call to generate steps with ChatGPT.
   */
  const handleGenerateWithChatGPT = async (Context: string) => {
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
      console.log(gptResponse);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract the steps if available.
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
  };

  /**
   * Recursively converts an array of Step objects into a string.
   * Each step is numbered according to its level in the hierarchy.
   *
   * @param steps - An array of Step objects.
   * @param prefix - A string prefix to keep track of the numbering (used recursively).
   * @returns A string representation of the steps tree.
   */
  const stepsToString = (steps: Step[], prefix: string = ""): string => {
    return steps
      .map((step, index) => {
        // Build a numbering prefix (e.g., "1", "1.2", "1.2.3", etc.)
        const currentPrefix = prefix
          ? `${prefix}.${index + 1}`
          : `${index + 1}`;
        // Start with the step header and its content
        let stepStr = `Step ${currentPrefix}: ${step.content}\n`;

        // Optionally include code if it exists
        if (step.code) {
          stepStr += `  Code: ${step.code}\n`;
        }

        // Optionally include hints if they exist
        if (step.general_hint || step.detailed_hint) {
          stepStr += `  Hints: ${step.general_hint} ${step.detailed_hint}\n`;
        }

        // Recursively process children (sub-steps)
        if (step.children && step.children.length > 0) {
          stepStr += stepsToString(step.children, currentPrefix);
        }

        return stepStr;
      })
      .join("");
  };

  const handleGenerateWithChatGPTCheck = async (Context: string) => {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    setLoading(true);
    console.log("Steps", stepsToString(steps));

    try {
      const gptResponse = await apiCallCheck(
        selectedProblemDetails,
        stepsToString(steps)
      );
      console.log(gptResponse);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract the steps if available.
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
  };

  // Delete the entire tree.
  const HandleDeleteTree = () => {
    setSteps([]);
    localStorage.setItem(StorageKey, "[]");
  };

  // Update the content of a step at the given path.
  const updateStepContentAtPath = (
    steps: Step[],
    path: number[],
    newContent: string
  ): Step[] => {
    const updatedSteps = steps.map((step) => ({ ...step }));
    let current: Step[] = updatedSteps;
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
  };

  // ==============================================
  // === REMOVAL with Fade-Out (by id)
  // ==============================================
  const handleRemoveStep = (id: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => markStepAndChildrenAsDeleting(step, id))
    );

    setTimeout(() => {
      setSteps((prevSteps) => removeStepById(prevSteps, id));
    }, 300); // Matches animation duration
  };

  const markStepAndChildrenAsDeleting = (step: Step, id: string): Step => {
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
  };

  // Helper: Remove a step (and its children) by id.
  function removeStepById(steps: Step[], id: string): Step[] {
    return steps.reduce<Step[]>((acc, step) => {
      if (step.id === id) {
        // Skip this step (i.e. remove it)
        return acc;
      }
      const newStep = { ...step };
      if (newStep.children && newStep.children.length > 0) {
        newStep.children = removeStepById(newStep.children, id);
      }
      acc.push(newStep);
      return acc;
    }, []);
  }

  // ==============================================
  // === INSERT (Top-Level, SubStep) with Fade-In + Scroll
  // ==============================================
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
    }, 0);
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

  // ================================================================
  // === EDITING LOGIC (Inline Editing)
  // ================================================================
  const [editingPath, setEditingPath] = useState<number[] | null>(null);
  const [tempContent, setTempContent] = useState("");

  const handleStartEditing = (path: number[], initialValue: string) => {
    setEditingPath(path);
    setTempContent(initialValue);
  };

  const handleBlur = () => {
    if (editingPath !== null) {
      setSteps((prev) =>
        updateStepContentAtPath(prev, editingPath!, tempContent)
      );
      setEditingPath(null);
      setTempContent("");
    }
  };

  // ================================================================
  // RENDER THE TREE
  // ================================================================
  const renderTree = (
    steps: Step[],
    parentPath: number[] = []
  ): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    // Render a plus button at the beginning.
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

      const isCurrentlyEditing =
        editingPath &&
        editingPath.length === currentPath.length &&
        editingPath.every((val, i) => val === currentPath[i]);

      elements.push(
        <Fragment key={`step-${currentPath.join("-")}`}>
          <div
            className={`step-box ${step.isDeleting ? "fade-out" : ""}`}
            id={step.id}
          >
            <div className="step-title">
              Step {displayPath}:{" "}
              <div className="icon-container-start-right">
                <The_muskeltiers
                  fill={"none"}
                  prompt={step.prompt}
                  stepNumber={displayPath}
                  onAddChild={() => insertSubStepAtPath(currentPath, 0)}
                  onEditStep={() =>
                    handleStartEditing(currentPath, step.content)
                  }
                />
                <Trash
                  onClick={() => handleRemoveStep(step.id)}
                  cursor="pointer"
                  strokeWidth={1}
                  width={"1.5vw"}
                  className="trash"
                />
              </div>
            </div>

            {isCurrentlyEditing ? (
              <textarea
                autoFocus
                className="inline-edit-textarea"
                rows={3}
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div className="step-content">{step.content}</div>
            )}

            {step.children && step.children.length > 0 && (
              <div className="substeps">
                {renderTree(step.children, currentPath)}
              </div>
            )}
          </div>

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
  };

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">
          Step Tree{" "}
          {steps && steps.length > 0 ? (
            <Trash
              color="black"
              size={"1vw"}
              strokeWidth={1}
              cursor="pointer"
              onClick={HandleDeleteTree}
              className="trash"
            />
          ) : (
            ""
          )}
        </div>
        <div className="right-main-main">
          <div className="container-step-tree">
            {steps && steps.length > 0 ? (
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
                  placeholder={`Enter Your Thoughts`}
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
    </div>
  );
};

export default StartRight;
