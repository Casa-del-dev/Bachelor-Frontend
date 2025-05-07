import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Abstract.css";
import StartRight from "./Start-right";
import { useCodeContext } from "../CodeContext";

interface AbstractProps {
  maybeStepTree?: Step[];
  maybestartright?: React.ReactNode;
  backToNormal?: any;
  rightWidth?: number;
  onRightWidthChange?: (widthPercent: number) => void;
  rightFontSize?: string;
  onRightFontSizeChange?: (fs: string) => void;
  problemId?: string;
  setProblemId?: (newId: string) => void;
}

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

const Abstract: React.FC<AbstractProps> = ({
  maybeStepTree,
  maybestartright,
  backToNormal,
  rightWidth,
  onRightWidthChange,
  rightFontSize,
  onRightFontSizeChange,
  problemId,
  setProblemId,
}) => {
  const [animateToRight, setAnimateToRight] = useState(false);
  const [selectedDetail, _] = useState(false); //for when we select a point or an edge on the graph
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //dropdown changing problem

  const { problemId: ctxProblemId, setProblemId: ctxSetProblemId } =
    useCodeContext();

  const activeProblemId = problemId ?? ctxProblemId;
  const updateProblemId = setProblemId ?? ctxSetProblemId;

  const [localRightWidth, setLocalRightWidth] = useState(30);
  const [localRightFontSize, setLocalRightFontSize] = useState("1vw");

  const activeRightWidth = rightWidth ?? localRightWidth;
  const activeRightFontSize = rightFontSize ?? localRightFontSize;

  const activeUpdateRightWidth = onRightWidthChange ?? setLocalRightWidth;
  const activeUpdateRightFontSize =
    onRightFontSizeChange ?? setLocalRightFontSize;

  const [stepTree, setStepTree] = useState<Step[]>([]);
  const draggingRef = useRef(false);

  const [problemList] = useState([
    "Problem 1",
    "Problem 2",
    "Problem 3",
    "Problem 4",
    "Problem 5",
    "Problem 6",
    "Problem 7",
    "Problem 8",
    "Problem 9",
  ]);

  useEffect(() => {
    if (!maybestartright) {
      //if maybeStepTree we simply wait for it to be updated automatically
      loadStepTreeFromBackend(activeProblemId)
        .then((loadedTree) => {
          if (loadedTree) setStepTree(loadedTree);
        })
        .catch((err) =>
          console.error("Abstract.loadStepTreeFromBackend failed:", err)
        );
    }
  }, [activeProblemId, maybeStepTree]);

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

  /*   ---------------------------------------------------
All effects to give the right fontsize / width START
----------------------------------------------------- */

  //initialization of the width of the step tree
  useEffect(() => {
    const current = getComputedStyle(document.documentElement).getPropertyValue(
      "--right-width"
    );
    if (!current) {
      document.documentElement.style.setProperty("--right-width", "30%");
    }
  }, []);

  const updateRightFontSize = useCallback(() => {
    const rightPx = (activeRightWidth / 100) * window.innerWidth;
    const fontSize = Math.min(Math.max(rightPx * 0.04, 15), 30);
    const computed = `${fontSize}px`;

    if (computed !== activeRightFontSize) {
      activeUpdateRightFontSize(computed);
      localStorage.setItem("rightFontSize", computed);
    }
  }, [activeRightWidth, activeRightFontSize, activeUpdateRightFontSize]);

  useEffect(() => {
    updateRightFontSize();
  }, [activeRightWidth, updateRightFontSize]);

  useEffect(() => {
    window.addEventListener("resize", updateRightFontSize);
    return () => {
      window.removeEventListener("resize", updateRightFontSize);
    };
  }, [updateRightFontSize]);

  // 1) declare the ref, seeded with the current width
  const rightWidthRef = useRef(activeRightWidth);

  // 2) keep it in sync whenever activeRightWidth changes
  useEffect(() => {
    rightWidthRef.current = activeRightWidth;
  }, [activeRightWidth]);

  //dragging the seperator
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const deltaPercent = (e.movementX / window.innerWidth) * 100;
      const newWidth = Math.min(
        Math.max(rightWidthRef.current + deltaPercent, 20),
        65
      );

      // 1) Instantly update the CSS var for width
      document.documentElement.style.setProperty(
        "--right-width",
        `${newWidth}%`
      );

      // 2) Instantly update the CSS var for font size
      const px = (newWidth / 100) * window.innerWidth;
      const fs = `${Math.min(Math.max(px * 0.04, 15), 30)}px`;
      document.documentElement.style.setProperty("--step-font-size", fs);

      // 3) Keep the ref up-to-date
      rightWidthRef.current = newWidth;
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
      // Only now tell React (or parent) about the final values
      activeUpdateRightWidth(rightWidthRef.current);
      activeUpdateRightFontSize(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--step-font-size"
        )
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeUpdateRightWidth, activeUpdateRightFontSize]);

  /*   ---------------------------------------------------
All effects to give the right fontsize / width END
----------------------------------------------------- */

  //Select problem id dropdown
  const handleSelect = (problem: string) => {
    updateProblemId(problem);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`main-container-abstract ${
        animateToRight ? "slide-right" : ""
      }`}
    >
      <div
        className="right-abstract-container"
        style={{
          ["--step-font-size" as any]: activeRightFontSize,
          ["--right-width" as any]: `${activeRightWidth}%`,
        }}
      >
        {maybestartright ? (
          maybestartright
        ) : (
          <StartRight
            fontSize={activeRightFontSize}
            hoveredStepId={null}
            loading={false}
            setLoading={() => {}}
            fromEditor={false}
            setFromEditor={() => {}}
            codeMap={{}}
            setCodeForFile={() => {}}
            currentFile={null}
            stepTree={stepTree}
            setStepTree={setStepTree}
          />
        )}
        <div
          className="divider"
          onMouseDown={() => {
            draggingRef.current = true;
          }}
          onDoubleClick={() => {
            setAnimateToRight(true);
            backToNormal();
          }}
        />
      </div>

      {selectedDetail && (
        <div className="details-abstract-container">
          <div className="details-abstract-main">ciao</div>
          <div className="divider" />
        </div>
      )}

      <div className="map-abstract-container">
        <div className="select-problem-abstract">
          <div
            className="dropdown-header"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {activeProblemId}
            <span className="arrow">{isDropdownOpen ? "▲" : "▼"}</span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-list">
              {problemList.map((problem) => (
                <div
                  key={problem}
                  className="dropdown-item"
                  onClick={() => handleSelect(problem)}
                >
                  {problem}
                </div>
              ))}
            </div>
          )}
        </div>
        ciao
      </div>
    </div>
  );
};

export default Abstract;
