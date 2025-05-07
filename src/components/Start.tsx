import "./Start.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import StartLeft from "./Start-left";
import StartRight from "./Start-right";
import StartMiddle from "./Start_middle";
import { CodeProvider, useCodeContext } from "../CodeContext";
import Abstract from "./Abstract";

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
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const [rightFontSize, setRightFontSize] = useState("1vw");
  const [leftFontSize, setLeftFontSize] = useState("1vw");

  const draggingLeftDivider = useRef(false);
  const draggingRightDivider = useRef(false);

  const [hoveredStep, setHoveredStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromEditor, setFromEditor] = useState(false);
  const {
    currentFile,
    setCurrentFile,
    codeMap,
    setCodeForFile,
    test,
    fileTree,
    setFileTree,
    currentFileName,
    problemId,
    setProblemId,
  } = useCodeContext();

  const [showAbstract, setShowAbstract] = useState(false);

  /* --------------------------------------
     API for StepTree START
  -------------------------------------- */

  const [stepTree, setStepTree] = useState<Step[]>([]);
  const hasInitializedStepTree = useRef(false);

  useEffect(() => {
    if (!problemId) return;

    setLoading(true);
    loadStepTreeFromBackend(problemId)
      .then((tree) => {
        setStepTree(tree ?? []);
        hasInitializedStepTree.current = true;
      })
      .catch((err) => console.error("Unexpected load error:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [problemId]);

  async function loadStepTreeFromBackend(
    problemId: string
  ): Promise<Step[] | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const res = await fetch(
        `https://bachelor-backend.erenhomburg.workers.dev/problem/v2/loadStepTree?id=${encodeURIComponent(
          problemId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Load failed (${res.status})`);
      }

      const data = (await res.json()) as { root: Step[] };
      return data.root;
    } catch (err) {
      console.error("Error in loadStepTreeFromBackend:", err);
      return null;
    }
  }

  const saveStepTree = useCallback(
    async (newTree: Step[]) => {
      if (!problemId) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          `https://bachelor-backend.erenhomburg.workers.dev/problem/v2/saveStepTree?id=${encodeURIComponent(
            problemId
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ problemId: problemId, stepTree: newTree }),
          }
        );
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
      } catch (err) {
        console.error("Error in saveStepTree:", err);
      }
    },
    [problemId]
  );

  useEffect(() => {
    if (!hasInitializedStepTree.current) return;
    saveStepTree(stepTree);
  }, [stepTree, saveStepTree]);

  /* --------------------------------------
     API for StepTree END
  -------------------------------------- */

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
    const stored = localStorage.getItem("selectedProblem");
    if (stored) {
      setProblemId(stored);
    }
  }, []);

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
      if (left >= maxLeft) left = maxLeft;
      if (right >= maxRight) right = maxRight;

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

  //right width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--right-width",
      `${layout.right}%`
    );
  }, [layout.right]);

  // Helper function to update font size
  const updateFontSize = useCallback(() => {
    if (rightRef.current) {
      const widthPx = rightRef.current.offsetWidth;
      const fontSizeValue = Math.min(Math.max(widthPx * 0.04, 15), 30);
      const computedRight = `${fontSizeValue}px`;
      if (computedRight !== rightFontSize) {
        setRightFontSize(computedRight);
        localStorage.setItem("rightFontSize", computedRight);
      }
    }

    if (leftRef.current) {
      const widthPx = leftRef.current.offsetWidth;
      const fontSizeValue = Math.min(Math.max(widthPx * 0.045, 15), 26); // slightly smaller max
      const computedLeft = `${fontSizeValue}px`;
      if (computedLeft !== leftFontSize) {
        setLeftFontSize(computedLeft);
        localStorage.setItem("leftFontSize", computedLeft);
      }
    }
  }, [rightFontSize, leftFontSize]);

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
    const storedRight = localStorage.getItem("rightFontSize");
    if (storedRight) setRightFontSize(storedRight);

    const storedLeft = localStorage.getItem("leftFontSize");
    if (storedLeft) setLeftFontSize(storedLeft);

    if (!storedLeft || !storedRight) {
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

  //animation for abstract part

  const [animateRightToLeft, setAnimateRightToLeft] = useState(false);

  const handleRightDoubleClick = () => {
    setAnimateRightToLeft(!animateRightToLeft);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAbstract(animateRightToLeft);
    }, 650);

    return () => clearTimeout(timeout);
  }, [animateRightToLeft]);

  // STARTRIGht component

  const startRightComponent = (
    <StartRight
      fontSize={rightFontSize}
      hoveredStepId={hoveredStep ? hoveredStep.id : null}
      loading={loading}
      setLoading={setLoading}
      fromEditor={fromEditor}
      setFromEditor={setFromEditor}
      codeMap={codeMap}
      setCodeForFile={setCodeForFile}
      currentFile={currentFile}
      stepTree={stepTree}
      setStepTree={setStepTree}
    />
  );

  return (
    <div className={`slide-wrapper ${animateRightToLeft ? "slide-left" : ""}`}>
      {showAbstract ? (
        <Abstract
          maybestartright={startRightComponent}
          backToNormal={handleRightDoubleClick}
        />
      ) : (
        <div className="container-main">
          {/* Left Column */}
          <div
            className="left-column"
            ref={leftRef}
            style={{
              width: `${layout.left}%`,
              ["--step-font-size" as any]: leftFontSize,
            }}
          >
            <StartLeft
              codeMap={codeMap}
              setCodeForFile={setCodeForFile}
              currentFile={currentFile}
              setCurrentFile={setCurrentFile}
              fileTree={fileTree}
              setFileTree={setFileTree}
              problemId={problemId}
              setProblemId={setProblemId}
            />
          </div>

          {/* First Divider */}
          <div className="divider" onMouseDown={startDragLeft} />

          {/* Middle Column */}
          <div className="middle-column" style={{ width: `${layout.middle}%` }}>
            <CodeProvider>
              <StartMiddle
                setHoveredStep={setHoveredStep}
                loading={loading}
                setLoading={setLoading}
                setFromEditor={setFromEditor}
                codeMap={codeMap}
                setCodeForFile={setCodeForFile}
                currentFile={currentFile}
                test={test}
                currentFileName={currentFileName}
                fileTree={fileTree}
                problemId={problemId}
                stepTree={stepTree}
              />
            </CodeProvider>
          </div>

          {/* Second Divider */}
          <div
            className="divider"
            onDoubleClick={handleRightDoubleClick}
            onMouseDown={startDragRight}
          />

          {/* Right Column */}
          <div
            className={`right-column`}
            ref={rightRef}
            style={{
              ["--step-font-size" as any]: rightFontSize,
              ["--right-width" as any]: `${layout.right}%`,
            }}
          >
            {startRightComponent}
          </div>
          <div className="divider" />
        </div>
      )}
    </div>
  );
};

export default Start;
