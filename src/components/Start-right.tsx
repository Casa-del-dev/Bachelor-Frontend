import { useState, useEffect, useRef, JSX } from "react";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";

const StartRight = () => {
  interface Step {
    description: string;
    children: Step[];
  }

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

  // Parse the input into a tree structure
  const parseSteps = (input: string): Step[] => {
    // Split input by newlines and filter out empty lines
    const lines = input.split("\n").filter((line) => line.trim() !== "");
    const tree: Step[] = [];
    // Stack to keep track of the last step at each level
    const stack: { step: Step; level: number }[] = [];

    for (const line of lines) {
      // Expected format: "level:1 = Description"
      const match = line.match(/level\s*:\s*(\d+)\s*=?\s*(.*)/i);
      if (!match) continue;

      const level = parseInt(match[1], 10);
      const description = match[2].trim();
      const newStep: Step = { description, children: [] };

      if (level === 1) {
        // For a level 1 step, push it directly into the tree.
        tree.push(newStep);
        // Clear the stack and add the new step.
        stack.length = 0;
        stack.push({ step: newStep, level });
      } else {
        // For levels > 1, find the proper parent.
        // Pop out any steps that are at the same level or deeper than the current one.
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length === 0) {
          // If no parent found, treat it as a new root.
          tree.push(newStep);
        } else {
          // Attach newStep as a child to the current parent.
          stack[stack.length - 1].step.children.push(newStep);
        }
        // Push the new step along with its level to the stack.
        stack.push({ step: newStep, level });
      }
    }

    return tree;
  };

  // When submit is triggered, parse and set the steps
  const handleSubmit = () => {
    if (text.trim() === "") return;
    const parsedTree = parseSteps(text);
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
      // Safely check references and types
      if (
        textareaRef.current &&
        event.target instanceof Node && // ensures we can use 'contains'
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

  // Render the parsed step tree
  const renderTree = (steps: Step[]): JSX.Element[] => {
    return steps.map((step, index) => (
      <div key={index} className="step-box">
        <div className="step-description">{step.description}</div>
        {step.children && step.children.length > 0 && (
          <div className="substeps"> {renderTree(step.children)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">Step Tree</div>
        <div className="right-main-main">
          <div className="container-step-tree">
            {steps.length > 0 ? (
              <button className="Check-button">
                <div className="Check">Check</div>
              </button>
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
              placeholder="Enter your text (e.g., level:1 = Main Step, level:2 = Sub Step)..."
              rows={1}
            />
            <HiArrowRight className="submit-icon" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartRight;
