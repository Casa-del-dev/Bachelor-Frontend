import "./Custom-Lightbulb.css";

const CustomLightbulb = ({
  number,
  fill = "yellow",
  onGiveHint = () => {},
  color,
  abstract = false,
}: {
  number: number | null;
  fill: string;
  onGiveHint: () => void;
  color: string;
  abstract?: boolean;
}) => {
  return (
    <div className={`lightbulb-container ${abstract ? "abstract" : ""}`}>
      {/* Custom Lightbulb Icon */}
      <svg
        className="lightbulb-icon"
        viewBox="0 0 24 20"
        fill={fill}
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={() => onGiveHint()}
        style={{ stroke: color }}
      >
        <path d="M9 18h6" />
        <path d="M12 2a6 6 0 0 1 6 6c0 1.5-.5 3-1.5 4s-1.5 2.5-1.5 4h-6c0-1.5-.5-3-1.5-4S6 9.5 6 8a6 6 0 0 1 6-6z" />
      </svg>

      {/* Number Overlay (Centered Inside the Bulb) */}
      {number && (
        <span
          className={`lightbulb-number ${abstract ? "abstract" : ""}`}
          onClick={() => onGiveHint()}
          style={{ cursor: "pointer" }}
        >
          {number}
        </span>
      )}
    </div>
  );
};

export default CustomLightbulb;
