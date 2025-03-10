import { useState, useEffect, useRef, JSX } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";

interface Step {
  description: string;
  children: Step[];
  // You can optionally add extra fields here (e.g., status, hints)
}

const StartRight = () => {
  const [text, setText] = useState(""); // state for input text
  const [steps, setSteps] = useState<Step[]>([]); // state for parsed step tree
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Adjust the textarea height dynamically on input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto"; // reset
    target.style.height = `${target.scrollHeight}px`; // expand to fit content
    setText(target.value);
  };

  // Recursively transform the JSON structure into our Step interface.
  // Assumes each step object has a "content" field and optionally a "substeps" object.
  const transformStep = (step: any): Step => {
    return {
      description: step.content || "",
      children: step.substeps ? transformStepsObject(step.substeps) : [],
    };
  };

  const transformStepsObject = (obj: any): Step[] => {
    //console.log(Object.keys(obj).map((key) => transformStep(obj[key])));
    return Object.keys(obj).map((key) => transformStep(obj[key]));
  };

  // Parse the JSON input into a tree structure
  const parseJSONSteps = (input: string): Step[] => {
    try {
      const parsed = JSON.parse(input);
      // Assuming the parsed JSON is an object with keys like "step1", "step2", etc.
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
    // Reset input field
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

  // Render the parsed step tree recursively
  const renderTree = (steps: Step[]): JSX.Element[] => {
    return steps.map((step, index) => (
      <div key={index} className="step-box">
        <div className="step-description">{step.description}</div>
        {step.children && step.children.length > 0 && (
          <div className="substeps">{renderTree(step.children)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">
          Step Tree <The_muskeltiers />
        </div>
        <div className="right-main-main">
          <div className="container-step-tree">
            {steps.length > 0 ? (
              <div className="button-container">
                <button className="Check-button">
                  <div className="Check">Check</div>
                </button>
              </div>
            ) : (
              ""
            )}
            {steps.length > 0 ? (
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
              placeholder='Enter your JSON (e.g., {"step1": {"content": "Initialize...", "substeps": {}}})'
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
