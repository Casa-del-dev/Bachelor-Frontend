import { useEffect, useState } from "react";
import "./Problem_left.css";
import { Plus } from "lucide-react";
import { useAuth } from "../AuthContext";

interface ProblemMeta {
  id: string;
  name: string;
  description: string;
}

type ProblemLeftProps = {
  items: ProblemMeta[];
  onSelect: (problemId: string) => void;
  firstRef?: React.Ref<HTMLDivElement>;
  secondRef?: React.Ref<HTMLDivElement>;
  tutorial?: string;
  tutorialPass?: boolean;
  setOverlayOpen: (open: boolean) => void;
  selectedProblem: string;
};

type Option = {
  id: string;
  label: string;
  description?: string;
};

const problems = [
  "Problem 1",
  "Problem 2",
  "Problem 3",
  "Problem 4",
  "Problem 5",
  "Problem 6",
  "Problem 7",
  "Problem 8",
  "Problem 9",
  "Problem 10",
  "Problem 11",
  "Problem 12",
  "Problem 13",
  "Problem 14",
  "Problem 15",
  "Problem 16",
  "Problem 17",
  "Problem 18",
  "Problem 19",
  "Problem 20",
  "Problem 21",
  "Problem 22",
  "Problem 23",
  "Problem 24",
  "Problem 25",
  "Problem 26",
  "Problem 27",
  "Problem 28",
  "Problem 29",
];

export default function Problem_left({
  items,
  onSelect,
  firstRef,
  secondRef,
  tutorial,
  tutorialPass,
  setOverlayOpen,
  selectedProblem,
}: ProblemLeftProps) {
  const [theChosen, setTheChosen] = useState<string>("");

  const isAuthenticated = useAuth();
  const [plusError, setPlusError] = useState<boolean>(false);

  // sync tutorial-driven selection
  useEffect(() => {
    if (tutorial) {
      onSelect(tutorial);
    }
    if (tutorialPass) {
      setTheChosen("Problem 1");
    }
  }, [tutorial, tutorialPass, onSelect]);

  // restore last-chosen from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedProblem");
    if (stored) {
      setTheChosen(stored);
      onSelect(stored);
    }
  }, [onSelect]);

  const handleClick = (id: string) => {
    onSelect(id);
  };

  // build uniform option lists
  const defaultOptions: Option[] = problems.map((p) => ({
    id: p,
    label: p,
  }));
  const customOptions: Option[] = items.map((p) => ({
    id: p.id,
    label: p.name,
    description: p.description,
  }));

  return (
    <div className="left-side" ref={firstRef}>
      <div className="left-side-content">
        {/* Default Problems */}
        <div className="default-problem-title">Default Problems</div>
        <div className="default-problems-parent">
          <div className="default-problems">
            {defaultOptions.map((opt, idx) => (
              <div
                key={opt.id}
                ref={idx === 0 ? secondRef : null}
                className={`general-button
                  ${theChosen === opt.id ? "activeA" : ""}
                  ${
                    selectedProblem === opt.id && theChosen !== opt.id
                      ? "activeB"
                      : ""
                  }
                `}
                onClick={() => handleClick(opt.id)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <hr className="custom-line-problem" />

        {/* Custom Problems */}
        <div className="custom-problem-title">
          Custom Problems{" "}
          <Plus
            className={`plus-custom-problems ${plusError ? "plus-error" : ""}`}
            onClick={() => {
              if (!isAuthenticated.isAuthenticated) {
                setPlusError(true);
                setTimeout(() => setPlusError(false), 2000);
                return;
              }
              setOverlayOpen(true);
            }}
          />
        </div>
        <div className="custom-problems-parent">
          <div className="custom-problems">
            {customOptions.map((opt, idx) => (
              <div
                key={opt.id}
                ref={idx === 0 ? secondRef : null}
                className={`general-button
                  ${theChosen === opt.id ? "activeA" : ""}
                  ${
                    selectedProblem === opt.id && theChosen !== opt.id
                      ? "activeB"
                      : ""
                  }
                `}
                onClick={() => handleClick(opt.id)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
