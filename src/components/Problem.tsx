import { useState } from "react";
import "./Problem.css";
import Problem_left from "./Problem_left";
import Problem_details from "./Problem_detail";

const Problem = () => {
  const [selectedProblem, setSelectedProblem] = useState<string>("");

  return (
    <div className="container-problem">
      {/* Left Side: Problem List */}
      <Problem_left onSelect={setSelectedProblem} />

      {/* Separator */}
      <div className="container-separator-problem">
        <div className="custom-line"></div>
      </div>

      {/* Right Side: Problem Details */}
      <div className="right-side-problem">
        <Problem_details selectedProblem={selectedProblem} />
      </div>
    </div>
  );
};

export default Problem;
