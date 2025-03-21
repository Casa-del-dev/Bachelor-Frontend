import "./Start.css";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import StartLeft from "./Start-left";
import StartRight from "./Start-right";
import StartMiddle from "./Start_middle";
import { CodeProvider } from "../CodeContext";

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

  useEffect(() => {
    localStorage.setItem("layoutDimensions", JSON.stringify(layout));
  }, [layout]);

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

  const updateLayout = (deltaX: number, divider: "left" | "right") => {
    const deltaPercent = (deltaX / window.innerWidth) * 100;

    setLayout((prev) => {
      let { left, middle, right } = { ...prev };

      if (divider === "left") {
        left += deltaPercent;
      } else {
        right -= deltaPercent;
      }

      if (left < MIN_LEFT) {
        left = MIN_LEFT;
      }
      if (right < MIN_RIGHT) {
        right = MIN_RIGHT;
      }

      const maxLeft = 80 - right;
      const maxRight = 80 - left;
      if (left > maxLeft) {
        left = maxLeft;
      }

      if (right > maxRight) {
        right = maxRight;
      }

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
    if (draggingLeftDivider.current || draggingRightDivider.current) {
      draggingLeftDivider.current = false;

      draggingRightDivider.current = false;
    }
  };

  const startDragLeft = () => {
    draggingLeftDivider.current = true;
  };

  const startDragRight = () => {
    draggingRightDivider.current = true;
  };

  useEffect(() => {
    const updateFontSize = () => {
      if (rightRef.current) {
        const widthPx = rightRef.current.offsetWidth;
        const fontSize = widthPx * 0.05; // adjust this ratio as needed
        setRightFontSize(`${fontSize}px`);
      }
    };

    updateFontSize(); // initial
    window.addEventListener("resize", updateFontSize);

    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, [layout]);

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
          <StartMiddle />
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
        <StartRight />
      </div>
    </div>
  );
};

export default Start;
