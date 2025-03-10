import "./Custom-Lightbulb.css";

const CustomLightbulb = ({ number }: { number: number }) => {
  return (
    <div className="lightbulb-container">
      {/* Custom Lightbulb Icon */}
      <svg
        className="lightbulb-icon"
        viewBox="0 0 24 18"
        fill="yellow"
        stroke="black"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18h6" />
        <path d="M12 2a6 6 0 0 1 6 6c0 1.5-.5 3-1.5 4s-1.5 2.5-1.5 4h-6c0-1.5-.5-3-1.5-4S6 9.5 6 8a6 6 0 0 1 6-6z" />
      </svg>

      {/* Number Overlay (Centered Inside the Bulb) */}
      <span className="lightbulb-number">{number}</span>
    </div>
  );
};

export default CustomLightbulb;
