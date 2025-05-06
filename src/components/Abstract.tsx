import React, { useEffect, useRef, useState } from "react";
import "./Abstract.css";
import { useCodeContext } from "../CodeContext";
import StartRight from "./Start-right";

interface AbstractProps {
  maybeStepTree?: Step[];
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

const Abstract: React.FC<AbstractProps> = ({ maybeStepTree }) => {
  const { codeMap, problemId, setProblemId } = useCodeContext();
  const [stepTree, setStepTree] = useState<Step[]>([]);

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

  return (
    <div className="main-container-abstract">
      <StartRight
        fontSize="12"
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
    </div>
  );
};

export default Abstract;
