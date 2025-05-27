import React from "react";
import "./AbstractionOverlay.css"; // Optional: use this for custom styles if needed

interface AbstractionItem {
  steps: { id: string }[][]; // array of arrays of `{ id: string }`
  general_hint: string;
  detailed_hint: string;
  correct_answer: {
    stepsTree: {
      [key: string]: {
        content: string;
        general_hint: string;
        detailed_hint: string;
        substeps: Record<string, { content: string; substeps: any }>;
      };
    };
  };
}

interface AbstractionOverlayProps {
  onClose: () => void;
  abstraction: AbstractionItem | null;
}

const AbstractionOverlay: React.FC<AbstractionOverlayProps> = ({
  onClose,
  abstraction,
}) => {
  return (
    <div className="container-abstract-hover-overlay" onClick={onClose}>
      <div
        className="building-abstraction-container"
        onClick={(e) => {
          e.stopPropagation(); // never bubble up into the parent container
        }}
      >
        ciao
        <pre>{JSON.stringify(abstraction, null, 2)}</pre>
      </div>
      <div className="divider-abstraction-overlay" />
      <div className="right-abstraction-overlay">ciao</div>
    </div>
  );
};

export default AbstractionOverlay;
