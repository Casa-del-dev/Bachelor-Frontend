import "./LShapedArrow.css";

interface AddSubstep {
  onClick?: () => void;
}

const LShapedArrow: React.FC<AddSubstep> = ({ onClick }) => {
  return (
    <svg
      style={{
        width: "calc(var(--step-font-size, 1vw) * 1.4)",
        height: "calc(var(--step-font-size, 1vw) * 1.2)",
      }}
      viewBox="0 -7 100 100"
      fill="none"
      stroke="black"
      strokeWidth="3"
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
