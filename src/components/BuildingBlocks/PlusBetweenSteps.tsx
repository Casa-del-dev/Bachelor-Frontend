import { Plus } from "lucide-react";
import "./PlusbetweenSteps.css";

interface PlusBetweenStepsProps {
  onClick?: () => void;
}

const PlusbetweenSteps: React.FC<PlusBetweenStepsProps> = ({ onClick }) => {
  return (
    <div className="container-plus-right-start">
      <div className="straightline-left" />
      <Plus size={"2vw"} className="plusbetweensteps" onClick={onClick} />
      <div className="straightline-right" />
    </div>
  );
};

export default PlusbetweenSteps;
