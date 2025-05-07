import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Abstract.css";
import { useCodeContext } from "../CodeContext";
import StartRight from "./Start-right";

interface AbstractProps {
  maybeStepTree?: Step[];
  maybestartright?: React.ReactNode;
  backToNormal?: any;
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
}) => {
  const [animateToRight, setAnimateToRight] = useState(false);
  const { problemId, setProblemId } = useCodeContext();
  const [stepTree, setStepTree] = useState<Step[]>([]);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (maybeStepTree) {
      setStepTree(maybeStepTree);
    } else {
      loadStepTreeFromBackend(problemId).then((loadedTree) => {
        if (loadedTree) setStepTree(loadedTree);
      });
    }
  }, [maybeStepTree, problemId]);

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

  //update the fontsize on drag
  const [rightFontSize, setRightFontSize] = useState("1vw");

  const updateRightFontSize = useCallback(() => {
    const widthVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--right-width")
      .trim()
      .replace("%", "");

    const rightPercent = parseFloat(widthVar || "30");
    const rightPx = (rightPercent / 100) * window.innerWidth;
    const fontSize = Math.min(Math.max(rightPx * 0.04, 15), 30);
    const computed = `${fontSize}px`;

    if (computed !== rightFontSize) {
      setRightFontSize(computed);
      localStorage.setItem("rightFontSize", computed);
    }
  }, [rightFontSize]);

  useEffect(() => {
    const stored = localStorage.getItem("rightFontSize");
    if (stored) setRightFontSize(stored);
    updateRightFontSize();
  }, [updateRightFontSize]);

  useEffect(() => {
    window.addEventListener("resize", updateRightFontSize);
    return () => {
      window.removeEventListener("resize", updateRightFontSize);
    };
  }, [updateRightFontSize]);

  //dragging the seperator
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const current = getComputedStyle(document.documentElement)
        .getPropertyValue("--right-width")
        .trim()
        .replace("%", "");
      const currentWidth = parseFloat(current || "30");
      const deltaPercent = (e.movementX / window.innerWidth) * 100;

      const newWidth = Math.min(Math.max(currentWidth + deltaPercent, 20), 65); // Clamp

      // Load existing layout or fallback
      const stored = localStorage.getItem("layoutDimensions");
      let left = 30;
      if (stored) {
        try {
          left = JSON.parse(stored).left ?? 30;
        } catch {}
      }

      const layout = {
        left,
        right: newWidth,
        middle: 100 - left - newWidth,
      };

      localStorage.setItem("layoutDimensions", JSON.stringify(layout));

      document.documentElement.style.setProperty(
        "--right-width",
        `${newWidth}%`
      );
      updateRightFontSize();
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  /*   ---------------------------------------------------
All effects to give the right fontsize / width END
----------------------------------------------------- */

  return (
    <div
      className={`main-container-abstract ${
        animateToRight ? "slide-right" : ""
      }`}
    >
      <div
        className="right-abstract-container"
        style={{ ["--step-font-size" as any]: rightFontSize }}
      >
        {maybestartright ? (
          maybestartright
        ) : (
          <StartRight
            fontSize="rightFontSize"
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
    </div>
  );
};

export default Abstract;
