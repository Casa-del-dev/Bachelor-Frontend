import React from "react";
import { Pen, TableRowsSplit } from "lucide-react";
import "./The_muskeltiers.css";

interface TheMuskeltiersProps {
  onEditStep?: () => void;
  onSplitStep: () => void;
  selected: number[] | null;
  vertical?: boolean | false;
  ref1?: any;
  ref2?: any;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  onEditStep,
  onSplitStep,
  selected,
  vertical,
  ref1,
  ref2,
}) => {
  return (
    <div className={`container-for-triplets ${vertical ? "vertical" : ""}`}>
      <div
        ref={ref1}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pen
          className="Filetext-tree"
          strokeWidth="1.2"
          onClick={() => {
            if (onEditStep) {
              onEditStep();
            }
          }}
          ref={ref1}
          style={{ fill: selected ? "lightgray" : "" }}
        />
      </div>
      <div
        ref={ref2}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TableRowsSplit
          className="Filetext-tree"
          strokeWidth="1.2"
          onClick={() => onSplitStep()}
        />
      </div>
    </div>
  );
};

export default The_muskeltiers;
