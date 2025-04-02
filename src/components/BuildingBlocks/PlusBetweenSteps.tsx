import { Plus } from "lucide-react";
import "./PlusbetweenSteps.css";

interface PlusBetweenStepsProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  plus?: boolean;
  empty?: boolean;
}

const PlusbetweenSteps: React.FC<PlusBetweenStepsProps> = ({
  onClick,
  style,
  plus = true,
  empty = true,
}) => {
  return (
    <div className="container-plus-right-start" style={style}>
      {plus && empty && <div className="straightline-left" />}

      <Plus
        style={{
          width: plus
            ? "calc(var(--step-font-size, 1vw) * 1.6)"
            : "calc(var(--step-font-size, 1vw) * 0.8)",
          height: plus
            ? "calc(var(--step-font-size, 1vw) * 1.6)"
            : "calc(var(--step-font-size, 1vw) * 0.8)",
          border:
            plus && empty
              ? "1px solid black"
              : !empty
              ? "1px solid #b8b8b8"
              : "",
        }}
        className="plusbetweensteps"
        onClick={onClick}
      />

      {plus && empty && <div className="straightline-right" />}
    </div>
  );
};

export default PlusbetweenSteps;
