import "./Start.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import StartLeft from "./Start-left";
import StartRight from "./Start-right";
import StartMiddle from "./Start_middle";
import { CodeProvider } from "../CodeContext";

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

  isNewlyInserted: boolean;
  isexpanded: boolean;
  isHyperExpanded: boolean;

  selected: boolean;
}

interface LayoutState {
  left: number;
  middle: number;
  right: number;
}

const MIN_LEFT = 15; // Minimum width for left column
const MIN_RIGHT = 20; // Minimum width for right column

const Start: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [_, setSelectedProblem] = useState<string>("");

  const rightRef = useRef<HTMLDivElement>(null);
  const [rightFontSize, setRightFontSize] = useState("1vw");

  const draggingLeftDivider = useRef(false);
  const draggingRightDivider = useRef(false);

  const [hoveredStep, setHoveredStep] = useState<Step | null>(null);

  const [layout, setLayout] = useState<LayoutState>(() => {
    const storedLayout = localStorage.getItem("layoutDimensions");
    if (storedLayout) {
      try {
        const parsed = JSON.parse(storedLayout) as LayoutState;
        if (parsed.left + parsed.middle + parsed.right === 100) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing stored layout dimensions:", error);
      }
    }
    return { left: 30, middle: 50, right: 20 };
  });

  // Save layout changes to local storage
  useEffect(() => {
    localStorage.setItem("layoutDimensions", JSON.stringify(layout));
  }, [layout]);

  // Set selected problem from URL or local storage
  useEffect(() => {
    if (id) {
      setSelectedProblem(id);
    } else {
      const stored = localStorage.getItem("selectedProblem");
      if (stored) {
        setSelectedProblem(stored);
      }
    }
  }, [id]);

  // Update layout based on divider dragging
  const updateLayout = (deltaX: number, divider: "left" | "right") => {
    const deltaPercent = (deltaX / window.innerWidth) * 100;
    setLayout((prev) => {
      let { left, middle, right } = { ...prev };

      if (divider === "left") {
        left += deltaPercent;
      } else {
        right -= deltaPercent;
      }

      if (left < MIN_LEFT) left = MIN_LEFT;
      if (right < MIN_RIGHT) right = MIN_RIGHT;

      const maxLeft = 80 - right;
      const maxRight = 80 - left;
      if (left > maxLeft) left = maxLeft;
      if (right > maxRight) right = maxRight;

      middle = 100 - (left + right);
      return { left, middle, right };
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingLeftDivider.current) {
      updateLayout(e.movementX, "left");
    } else if (draggingRightDivider.current) {
      updateLayout(e.movementX, "right");
    }
  };

  const handleMouseUp = () => {
    draggingLeftDivider.current = false;
    draggingRightDivider.current = false;
  };

  const startDragLeft = () => {
    draggingLeftDivider.current = true;
  };

  const startDragRight = () => {
    draggingRightDivider.current = true;
  };

  // Helper function to update font size
  const updateFontSize = useCallback(() => {
    if (rightRef.current) {
      const widthPx = rightRef.current.offsetWidth;
      const fontSizeValue = Math.min(Math.max(widthPx * 0.04, 15), 30);
      const computedFontSize = `${fontSizeValue}px`;
      if (computedFontSize !== rightFontSize) {
        setRightFontSize(computedFontSize);
        localStorage.setItem("rightFontSize", computedFontSize);
      }
    }
  }, [rightFontSize]);

  // Update font size when layout changes (e.g. during dragging)
  useEffect(() => {
    updateFontSize();
  }, [layout, updateFontSize]);

  // Update font size on window resize
  useEffect(() => {
    window.addEventListener("resize", updateFontSize);
    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, [updateFontSize]);

  // On mount, try to load font size from local storage or compute it
  useEffect(() => {
    const storedFontSize = localStorage.getItem("rightFontSize");
    if (storedFontSize) {
      setRightFontSize(storedFontSize);
    } else {
      updateFontSize();
    }
  }, [updateFontSize]);

  // Global mouse event listeners for divider dragging
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="container-main">
      {/* Left Column */}
      <div className="left-column" style={{ width: `${layout.left}%` }}>
        <StartLeft />
      </div>

      {/* First Divider */}
      <div className="divider" onMouseDown={startDragLeft} />

      {/* Middle Column */}
      <div className="middle-column" style={{ width: `${layout.middle}%` }}>
        <CodeProvider>
          <StartMiddle setHoveredStep={setHoveredStep} />
        </CodeProvider>
      </div>

      {/* Second Divider */}
      <div className="divider" onMouseDown={startDragRight} />

      {/* Right Column */}
      <div
        className="right-column"
        ref={rightRef}
        style={{
          width: `${layout.right}%`,
          ["--step-font-size" as any]: rightFontSize,
        }}
      >
        <StartRight
          fontSize={rightFontSize}
          hoveredStepId={hoveredStep ? hoveredStep.id : null}
        />
      </div>
    </div>
  );
};

export default Start;
