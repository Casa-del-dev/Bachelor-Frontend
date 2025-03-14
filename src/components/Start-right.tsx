import { useState, useEffect, useRef, JSX } from "react";
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

const StartRight = () => {
  const [text, setText] = useState(""); // state for input text
  const [steps, setSteps] = useState<Step[]>([]); // state for parsed step tree
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Get the problem name from localStorage and build the storage key
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "Default Problem";
  const StorageKey = "step" + `selectedSystemProblem_${selectedProblemName}`;

  // On component mount, load any saved steps from localStorage
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

  // Save the steps tree to localStorage whenever it changes
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(StorageKey, JSON.stringify(steps));
    }
  }, [steps, StorageKey]);

  // Dynamically adjust the textarea height on input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto"; // reset height
    target.style.height = `${target.scrollHeight}px`; // expand to fit content
    setText(target.value);
  };

  // Recursively transform the JSON structure into our Step interface.
  // Extracts the 'prompt' alongside 'content' and 'children'
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

  // Parse the JSON input into a tree structure.
  // The JSON is expected to have a top-level "steps" property.
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

  // When submit is triggered, parse and set the steps
  const handleSubmit = () => {
    if (text.trim() === "") return;
    const parsedTree = parseJSONSteps(text);
    setSteps(parsedTree);
    console.log("Parsed Steps:", parsedTree);
    // Reset the input field
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Reset the textarea height when clicking outside
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

      // Extract the steps if available, otherwise assume the entire object is steps.
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      // Transform the steps object into an array
      const stepsArray = transformStepsObject(stepsData);

      // Save to localStorage and update state
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  };

  const HandleDeleteTree = () => {
    setSteps([]);
    localStorage.setItem(StorageKey, "");
  };

  // Helper: update the content of a step at the given path (using 0-indexed positions)
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

  // Helper: remove a step at the given path (0-indexed)
  const removeStepAtPath = (steps: Step[], path: number[]): Step[] => {
    // Clone steps array
    const updatedSteps = steps.map((step) => ({
      ...step,
      children: [...step.children],
    }));
    if (path.length === 1) {
      // Remove the step at the top level
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

  // Handler to remove a step given its path
  const handleRemoveStep = (path: number[]) => {
    setSteps((prevSteps) => removeStepAtPath(prevSteps, path));
  };

  /**
   * Recursively render the steps.
   * We pass down the current "path" (an array of 0-indexed positions) so we can update or remove the correct step.
   * For display, we add 1 to each index (e.g., index 0 becomes "1").
   */
  const renderTree = (
    steps: Step[],
    parentPath: number[] = []
  ): JSX.Element[] => {
    return steps.map((step, index) => {
      const currentPath = [...parentPath, index];
      const displayPath = currentPath.map((i) => i + 1).join(".");
      return (
        <>
          {/* Step Box */}
          <div key={currentPath.join("-")} className="step-box">
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
            {!step.hasparent && step.children.length <= 0 && (
              <PlusbetweenSteps />
            )}
            {step.children && step.children.length > 0 && (
              <div className="substeps">
                <PlusbetweenSteps />
                {renderTree(step.children, currentPath)}
              </div>
            )}
          </div>

          <PlusbetweenSteps />
        </>
      );
    });
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
                  <button className="Check-button" /*onClick={apiCall}*/>
                    <div className="Check">Check</div>
                  </button>
                </div>
                <PlusbetweenSteps />
              </>
            ) : (
              ""
            )}
            {steps && steps.length > 0 ? (
              renderTree(steps)
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
