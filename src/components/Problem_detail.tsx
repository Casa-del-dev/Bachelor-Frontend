import { useNavigate } from "react-router-dom";
import "./Problem_detail.css";

type ProblemDetailsProps = {
  selectedProblem: string;
};

const problemDetailsMap: { [key: string]: string } = {
  "Problem 1": `
Roman to Integer

Description:
Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
Given a roman numeral, convert it to an integer.

Example 1:
Input: "III"
Output: 3

Example 2:
Input: "LVIII"
Output: 58

Example 3:
Input: "MCMXCIV"
Output: 1994
  `,
  "Problem 2": "Details for Problem 2 go here...",
  // Add additional details for other problems as needed.
};

const Problem_details = ({ selectedProblem }: ProblemDetailsProps) => {
  const navigate = useNavigate();

  // Check if selectedProblem is empty (initial state)
  const isInitial = !selectedProblem;

  // Get problem details, or set to null if missing
  const details = problemDetailsMap[selectedProblem]?.trim() || null;

  const handleCheckClick = () => {
    localStorage.setItem("selectedProblem", selectedProblem);
    navigate(`/start/${selectedProblem}`);
  };

  return (
    <div className="problem-details-container">
      {isInitial ? (
        <p className="problem-text-no-details">
          Please select a problem from the left.
        </p>
      ) : (
        <>
          <div className="problem-title">
            {selectedProblem}
            <button className="check-button" onClick={handleCheckClick}>
              Solve
            </button>
          </div>
          <pre
            className={
              details !== null ? "problem-text" : "problem-text-no-details"
            }
          >
            {details !== null ? details : "No details available."}
          </pre>
        </>
      )}
    </div>
  );
};

export default Problem_details;
