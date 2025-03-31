import { Plus } from "lucide-react";
import "./PlusbetweenSteps.css";

interface PlusBetweenStepsProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  plus?: boolean;
}

const PlusbetweenSteps: React.FC<PlusBetweenStepsProps> = ({
  onClick,
  style,
  plus = true,
}) => {
  return (
    <div className="container-plus-right-start" style={style}>
      {plus && <div className="straightline-left" />}

      <Plus
        style={{
          width: plus
            ? "calc(var(--step-font-size, 1vw) * 1.6)"
            : "calc(var(--step-font-size, 1vw) * 0.8)",
          height: plus
            ? "calc(var(--step-font-size, 1vw) * 1.6)"
            : "calc(var(--step-font-size, 1vw) * 0.8)",
          border: plus ? "1px solid black" : "",
        }}
        className="plusbetweensteps"
        onClick={onClick}
      />

      {plus && <div className="straightline-right" />}
    </div>
  );
};

export default PlusbetweenSteps;
