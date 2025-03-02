import { useEffect, useState } from "react";
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

const Problem_left = ({ onSelect }: ProblemLeftProps) => {
  const [selected, setSelected] = useState<string>("");

  // On mount, load the last selected problem from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedProblem");
    if (stored) {
      setSelected(stored);
      onSelect(stored);
    }
  }, [onSelect]);

  const handleClick = (problem: string) => {
    setSelected(problem);
    localStorage.setItem("selectedProblem", problem);
    onSelect(problem);
  };

  return (
    <div className="left-side">
      <div className="left-side-title">Problems</div>
      <div className="custom-line-left-side"></div>
      <div className="left-side-content">
        {problems.map((p, index) => (
          <div
            key={index}
            className={`general-button ${selected === p ? "active" : ""}`}
            onClick={() => handleClick(p)}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Problem_left;
