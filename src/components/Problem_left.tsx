import { useEffect, useState } from "react";
import "./Problem_left.css";
import { Plus } from "lucide-react";

type ProblemLeftProps = {
  onSelect: (problem: string) => void;
  firstRef?: React.Ref<HTMLDivElement>;
  secondRef?: React.Ref<HTMLDivElement>;
  tutorial?: string;
  tutorialPass?: boolean;
  setOverlayOpen: (open: boolean) => void;
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

const Problem_left = ({
  onSelect,
  firstRef,
  secondRef,
  tutorial,
  tutorialPass,
  setOverlayOpen,
}: ProblemLeftProps) => {
  const [selected, setSelected] = useState<string>("");
  const [theChosen, setTheChosen] = useState<string>("");

  useEffect(() => {
    if (tutorial) {
      onSelect(tutorial);
      setSelected(tutorial);
    }
    if (tutorialPass) {
      setTheChosen("Problem 1");
    }
  }, [tutorial, tutorialPass]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedProblem");
    if (stored) {
      setTheChosen(stored);
      onSelect(stored);
    }
  }, []);

  const handleClick = (problem: string) => {
    setSelected(problem);
    onSelect(problem);
  };

  return (
    <div className="left-side" ref={firstRef}>
      <div className="left-side-content">
        <div className="default-problem-title">Default Problems</div>
        <div className="default-problems-parent">
          <div className="default-problems">
            {problems.map((p, index) => (
              <div
                key={index}
                ref={index === 0 ? secondRef : null}
                className={`general-button 
                ${theChosen === p ? "activeA" : ""} 
                ${selected === p && theChosen !== p ? "activeB" : ""}
              `}
                onClick={() => handleClick(p)}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
        <hr className="custom-line-problem" />
        <div className="custom-problem-title">
          Custom Problems{" "}
          <Plus
            className="plus-custom-problems"
            onClick={() => setOverlayOpen(true)}
          />
        </div>
        <div className="custom-problems-parent">
          <div className="custom-problems">
            {problems.map((p, index) => (
              <div
                key={index}
                ref={index === 0 ? secondRef : null}
                className={`general-button 
                ${theChosen === p ? "activeA" : ""} 
                ${selected === p && theChosen !== p ? "activeB" : ""}
              `}
                onClick={() => handleClick(p)}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem_left;
