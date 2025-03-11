import { useState, useEffect, useRef, JSX } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";

interface Step {
  // We only store the content and children.
  // We won't rely on the JSON key for numbering.
  content: string;
  children: Step[];
}

const StartRight = () => {
  const [text, setText] = useState(""); // state for input text
  const [steps, setSteps] = useState<Step[] | null>(null); // state for parsed step tree
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
    if (steps !== null) {
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
  // We'll simply pull out the `content` from each step and recursively
  // transform any `subSteps` into children.
  const transformStep = (stepData: any): Step => {
    return {
      content: stepData.content || "",
      children: stepData.subSteps
        ? transformStepsObject(stepData.subSteps)
        : [],
    };
  };

  const transformStepsObject = (obj: any): Step[] => {
    // obj is an object whose keys might be "1", "2", "subStep 1", etc.
    // We just transform each key’s data into a Step.
    return Object.keys(obj).map((key) => transformStep(obj[key]));
  };

  // Parse the JSON input into a tree structure.
  // The JSON is expected to have a top-level "steps" property.
  const parseJSONSteps = (input: string): Step[] => {
    try {
      const parsed = JSON.parse(input);
      if (parsed.steps) {
        // If we have a top-level "steps" object, transform that
        return transformStepsObject(parsed.steps);
      }
      // Fallback if "steps" is missing
      return transformStepsObject(parsed);
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
   * Recursively render the steps.
   *
   * @param steps The array of steps to render
   * @param parentNumber A string representing the parent step's number, e.g. "1" or "1.2"
   *
   * The approach:
   * - For each step, compute its own stepNumber:
   *    if parentNumber is not empty => parentNumber + "." + (index + 1)
   *    else => (index + 1).toString()
   * - Display "Step {stepNumber}:" and the content
   * - Recursively render the children with the new stepNumber as the parentNumber
   */
  const renderTree = (
    steps: Step[],
    parentNumber: string = ""
  ): JSX.Element[] => {
    return steps.map((step, index) => {
      // e.g. If parentNumber = "1", child step number = "1.(index+1)" => "1.1", "1.2", etc.
      // if parentNumber = "" (top-level), child step number = index+1 => "1", "2", etc.
      const stepNumber = parentNumber
        ? `${parentNumber}.${index + 1}`
        : (index + 1).toString();

      return (
        <div key={index} className="step-box">
          <div className="step-title">
            Step {stepNumber}: <The_muskeltiers number={3} />
          </div>
          <div className="step-content">{step.content}</div>
          {step.children && step.children.length > 0 && (
            <div className="substeps">
              {renderTree(step.children, stepNumber)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">Step Tree</div>
        <div className="right-main-main">
          <div className="container-step-tree">
            {steps && steps.length > 0 ? (
              <div className="button-container">
                <button className="Check-button">
                  <div className="Check">Check</div>
                </button>
              </div>
            ) : (
              ""
            )}
            {steps && steps.length > 0 ? (
              renderTree(steps)
            ) : (
              <div className="default-text-right-start">
                Your step tree will appear here
              </div>
            )}
          </div>
        </div>

        <div className="right-text-main">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInput}
              className="text-input"
              placeholder={`Enter your JSON (e.g.,
{
  "steps": {
    "1": {
      "content": "Top step 1 content",
      "subSteps": {
        "subStep 1": {
          "content": "Child step => displayed as 1.1",
          "subSteps": {}
        }
      }
    },
    "2": {
      "content": "Top step 2 content",
      "subSteps": {}
    }
  }
}
`}
              style={{
                minHeight: "50px",
                height: "auto",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              rows={1}
            />
            <div className="arrow-container">
              <HiArrowRight className="submit-icon" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartRight;
