import { useState, useEffect, useRef, JSX } from "react";
import axios from "axios";
import "./Start-right.css";
import { HiArrowRight } from "react-icons/hi";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";
import { problemDetailsMap } from "./Problem_detail";
import { useAuth } from "../AuthContext";

interface Step {
  content: string;
  prompt: string; // Prompt field from the JSON
  children: Step[];
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
  const transformStep = (stepData: any): Step => {
    return {
      content: stepData.content || "",
      prompt: stepData.prompt || "",
      children: stepData.subSteps
        ? transformStepsObject(stepData.subSteps)
        : [],
    };
  };

  const transformStepsObject = (obj: any): Step[] => {
    return Object.keys(obj).map((key) => transformStep(obj[key]));
  };

  // Parse the JSON input into a tree structure.
  // The JSON is expected to have a top-level "steps" property.
  const parseJSONSteps = (input: string): Step[] => {
    try {
      const parsed = JSON.parse(input);
      if (parsed.steps) {
        return transformStepsObject(parsed.steps);
      }
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
      const res = await axios.post(
        "https://bachelor-backend.erenhomburg.workers.dev/openai/v1/",
        {
          Prompt: text,
          Problem: selectedProblemDetails,
          Tree: steps ?? {},
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const gptResponse = res.data;
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

  /**
   * Recursively render the steps.
   * Pass each step's prompt to The_muskeltiers component.
   */
  const renderTree = (
    steps: Step[],
    parentNumber: string = ""
  ): JSX.Element[] => {
    return steps.map((step, index) => {
      const stepNumber = parentNumber
        ? `${parentNumber}.${index + 1}`
        : (index + 1).toString();

      return (
        <div key={index} className="step-box">
          <div className="step-title">
            Step {stepNumber}:{" "}
            <The_muskeltiers fill={"none"} prompt={step.prompt} />
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
  "context": "Input Text",
  "full_code": "",
  "tree": "",
  "steps": {
    "1": {
      "content": "Extracted step description from the Content.",
      "prompt": "Highlighted portion of the text that explains this step.",
      "subSteps": {
        "1": {
          "content": "Extracted substep description.",
          "prompt": "Highlighted portion of the text that explains this substep."
        }
      }
    },
    "2": {
      "content": "Another identified step.",
      "prompt": "Highlighted portion of the text.",
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
        </div>
      </div>
    </div>
  );
};

export default StartRight;
