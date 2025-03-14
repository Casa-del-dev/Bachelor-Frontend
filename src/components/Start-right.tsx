import { useState, useEffect, useRef, JSX, Fragment } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";
import { Trash } from "lucide-react";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";
import { problemDetailsMap } from "./Problem_detail";
import { useAuth } from "../AuthContext";
import { apiCall } from "./Check";
import PlusbetweenSteps from "./BuildingBlocks/PlusBetweenSteps";

export interface Step {
  code: string;
  content: string;
  correctStep: string;
  prompt: string;
  status: string;
  general_hint: string;
  detailed_hint: string;
  children: Step[];
  hasparent: boolean;
}

function createBlankStep(): Step {
  return {
    code: "",
    content: "New Step",
    correctStep: "",
    prompt: "",
    status: "",
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
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
  const handleGenerateWithChatGPT = async () => {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    const requestBody = {
      Prompt: text,
      Problem: selectedProblemDetails,
      Tree: steps ?? {},
    };

    console.log("Sending API Request:", requestBody);

    setLoading(true);

    try {
      const gptResponse = await apiCall(text, selectedProblemDetails, steps);
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

  // Remove a step at the given path.
  const removeStepAtPath = (steps: Step[], path: number[]): Step[] => {
    const updatedSteps = steps.map((step) => ({
      ...step,
      children: [...step.children],
    }));
    if (path.length === 1) {
      updatedSteps.splice(path[0], 1);
    } else {
      const index = path[0];
      updatedSteps[index].children = removeStepAtPath(
        updatedSteps[index].children,
        path.slice(1)
      );
    }
    return updatedSteps;
  };

  const handleRemoveStep = (path: number[]) => {
    setSteps((prevSteps) => removeStepAtPath(prevSteps, path));
  };

  // --- NEW: Insertion Functions ---

  // Insert a new top-level step at a specified index.
  const insertTopLevelStepAt = (index: number) => {
    setSteps((prevSteps) => {
      const newStep = {
        ...createBlankStep(),
        hasparent: false,
        content: "New Step",
      };
      const newSteps = [...prevSteps];
      newSteps.splice(index, 0, newStep);
      return newSteps;
    });
  };

  // Insert a new substep into the parent's children array at the given index.
  const insertSubStepAtPath = (
    parentPath: number[],
    insertionIndex: number
  ) => {
    setSteps((prevSteps) => {
      // Deep clone the steps.
      const newSteps = JSON.parse(JSON.stringify(prevSteps));
      let parent = newSteps;
      // Traverse to the parent's children array.
      for (let i = 0; i < parentPath.length; i++) {
        parent = parent[parentPath[i]].children;
      }
      parent.splice(insertionIndex, 0, {
        ...createBlankStep(),
        content: "New Substep",
        hasparent: true,
      });
      return newSteps;
    });
  };

  // --- Render Function ---
  // This function renders plus buttons between steps so you can insert new steps exactly where you want.
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
      elements.push(
        <Fragment key={`step-${currentPath.join("-")}`}>
          <div className="step-box">
            <div className="step-title">
              Step {displayPath}:{" "}
              <div className="icon-container-start-right">
                <The_muskeltiers
                  fill={"none"}
                  content={step.content}
                  prompt={step.prompt}
                  stepNumber={displayPath}
                  onUpdateContent={(newContent: string) => {
                    setSteps((prevSteps) =>
                      updateStepContentAtPath(
                        prevSteps,
                        currentPath,
                        newContent
                      )
                    );
                  }}
                />
                <Trash
                  onClick={() => handleRemoveStep(currentPath)}
                  cursor="pointer"
                  strokeWidth={1}
                  width={"1.5vw"}
                  className="trash"
                />
              </div>
            </div>
            <div className="step-content">{step.content}</div>
            {step.children && step.children.length > 0 && (
              <div className="substeps">
                {renderTree(step.children, currentPath)}
              </div>
            )}
          </div>
          {/* Plus button after each step */}
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
                  <button className="Check-button">
                    <div className="Check">Check</div>
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
                    onClick={handleGenerateWithChatGPT}
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
