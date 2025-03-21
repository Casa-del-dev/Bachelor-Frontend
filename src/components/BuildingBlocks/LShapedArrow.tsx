import "./LShapedArrow.css";

interface AddSubstep {
  onClick?: () => void;
}

const LShapedArrow: React.FC<AddSubstep> = ({ onClick }) => {
  return (
    <svg
      width="1.5vw"
      height="1.5vw"
      viewBox="0 -10 100 100"
      fill="none"
      stroke="black"
      strokeWidth="5"
      className="LshapedArrow"
      onClick={onClick}
    >
      {/* L-shaped line */}
      <path d="M 20 10 V 75 H 80" stroke="black" strokeWidth="3" fill="none" />

      {/* Arrowhead at the end */}
      <polygon points="80,75 70,65 70,85" fill="black" />
    </svg>
  );
};

export default LShapedArrow;
