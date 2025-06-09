import { forwardRef, useEffect, useState } from "react";
import "./Problem_left.css";

type ProblemLeftProps = {
  onSelect: (problem: string) => void;
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
];

const Problem_left = forwardRef<HTMLDivElement, ProblemLeftProps>(
  ({ onSelect }, ref) => {
    const [selected, setSelected] = useState<string>("");
    const [theChosen, setTheChosen] = useState<string>("");

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
      <div className="left-side" ref={ref}>
        <div className="left-side-content">
          {problems.map((p, index) => (
            <div
              key={index}
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
    );
  }
);

export default Problem_left;
