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
  return (
    <div className="problem-details-container">
      {selectedProblem ? (
        <>
          <h2 className="problem-title">{selectedProblem}</h2>
          <pre className="problem-text">
            {problemDetailsMap[selectedProblem] || "No details available."}
          </pre>
        </>
      ) : (
        <p>Please select a problem from the left.</p>
      )}
    </div>
  );
};

export default Problem_details;
