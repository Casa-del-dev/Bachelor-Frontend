import { problemDetailsMap } from "./BuildingBlocks/ProblemDetailsText";
import "./Problem_detail.css";

type ProblemDetailsProps = {
  selectedProblem: string;
  refFirst?: React.Ref<HTMLButtonElement>;
};

const Problem_details = ({
  selectedProblem,
  refFirst,
}: ProblemDetailsProps) => {
  // Check if selectedProblem is empty (initial state)
  const isInitial = !selectedProblem;

  // Get problem details, or set to null if missing
  const details = problemDetailsMap[selectedProblem]?.trim() || null;

  const handleCheckClick = () => {
    localStorage.setItem("selectedProblem", selectedProblem);
    localStorage.setItem("selectedSection", "Problem");
    window.location.href = `/start/${selectedProblem}`;
  };

  return (
    <div className="problem-details-container">
      {isInitial ? (
        <div className="problem-text-no-details">
          Please select a problem from the left.
        </div>
      ) : (
        <>
          <div className="problem-title">
            {selectedProblem}
            <button
              className="check-button"
              ref={refFirst}
              onClick={handleCheckClick}
            >
              Solve
            </button>
          </div>
          <pre className={"problem-text"}>{details}</pre>
        </>
      )}
    </div>
  );
};

export default Problem_details;
