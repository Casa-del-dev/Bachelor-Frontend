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
    let currentParent: Step | null = null;
    lines.forEach((line) => {
      // Expected format: "level:1 = Description" or "level:2 = Sub-description"
      const match = line.match(/level\s*:\s*(\d+)\s*=?\s*(.*)/i);
      if (!match) return;

      if (match) {
        const level = parseInt(match[1], 10);
        const description = match[2].trim();
        if (level === 1) {
          // Create a new parent step
          const newStep = { description, children: [] };
          tree.push(newStep);
          currentParent = newStep;
        } else if (level === 2) {
          if (currentParent) {
            // Push a child Step with an empty children array
            currentParent.children.push({
              description,
              children: [],
            });
          }
        }
      }
    });
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
      <div key={index} className="level1-box">
        <div className="step-description">Step: {step.description}</div>
        {step.children && step.children.length > 0 && (
          <div className="substeps">
            {step.children.map((child, childIndex) => (
              <div key={childIndex} className="step-sub-description">
                &nbsp;&nbsp;- {child.description}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="Right-Side-main">
      <div className="custom-line-leftmiddle"></div>
      <div className="right-sidecontent-main">
        <div className="right-header-main">Step Tree</div>
        <div className="right-main-main">
          {steps.length > 0
            ? renderTree(steps)
            : "Your step tree will appear here"}
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
