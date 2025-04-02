import React from "react";
import { Pen, TableRowsSplit } from "lucide-react";
import "./The_muskeltiers.css";

interface TheMuskeltiersProps {
  onEditStep?: () => void;
  onSplitStep: () => void;
  selected: number[] | null;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  onEditStep,
  onSplitStep,
  selected,
}) => {
  return (
    <div className="container-for-triplets">
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
