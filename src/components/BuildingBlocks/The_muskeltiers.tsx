import React from "react";
import { Pen, TableRowsSplit } from "lucide-react";
import "./The_muskeltiers.css";

interface TheMuskeltiersProps {
  onEditStep?: () => void;
  onSplitStep: () => void;
  selected: number[] | null;
  vertical?: boolean | false;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  onEditStep,
  onSplitStep,
  selected,
  vertical,
}) => {
  return (
    <div className={`container-for-triplets ${vertical ? "vertical" : ""}`}>
      <Pen
        className="Filetext-tree"
        strokeWidth="1.2"
        onClick={() => {
          if (onEditStep) {
            onEditStep();
          }
        }}
        style={{ fill: selected ? "lightgray" : "" }}
      />
      <TableRowsSplit
        className="Filetext-tree"
        strokeWidth="1.2"
        onClick={() => onSplitStep()}
      />
    </div>
  );
};

export default The_muskeltiers;
