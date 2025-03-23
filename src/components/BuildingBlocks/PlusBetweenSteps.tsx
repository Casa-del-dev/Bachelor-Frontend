import { Plus } from "lucide-react";
import "./PlusbetweenSteps.css";

interface PlusBetweenStepsProps {
  onClick?: () => void;
}

const PlusbetweenSteps: React.FC<PlusBetweenStepsProps> = ({ onClick }) => {
  return (
    <div className="container-plus-right-start">
      <div className="straightline-left" />
      <Plus
        style={{
          width: "calc(var(--step-font-size, 1vw) * 1.6)",
          height: "calc(var(--step-font-size, 1vw) * 1.6)",
        }}
        className="plusbetweensteps"
        onClick={onClick}
      />
      <div className="straightline-right" />
    </div>
  );
};

export default PlusbetweenSteps;
