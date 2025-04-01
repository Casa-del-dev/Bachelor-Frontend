import React from "react";
import { Pen, TableRowsSplit } from "lucide-react";
import "./The_muskeltiers.css";
import LShapedArrow from "./LShapedArrow";

interface TheMuskeltiersProps {
  onAddChild?: () => void;
  onEditStep?: () => void;
  onSplitStep: () => void;
  onShowImplemented: () => void;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  onAddChild,
  onEditStep,
  onSplitStep,
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
      />
      <TableRowsSplit
        className="Filetext-tree"
        strokeWidth="1.2"
        onClick={() => onSplitStep()}
      />
      {/* Pen icon now calls `onEditStep` instead of opening an edit overlay */}
      {/* L-shaped arrow to add a substep */}
      <div className="Lshapedarrow">
        <LShapedArrow onClick={onAddChild} />
      </div>
    </div>
  );
};

export default The_muskeltiers;
