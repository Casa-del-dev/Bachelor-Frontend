import React, { useState, useEffect } from "react";
import { ShieldCheck, Pen, X } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";

interface TheMuskeltiersProps {
  number?: number;
  fill?: string;
  content: string;
  stepNumber: string;
  onUpdateContent: (newContent: string) => void;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  number,
  fill = "yellow",
  content,
  stepNumber,
  onUpdateContent,
}) => {
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [editableContent, setEditableContent] = useState(content);

  useEffect(() => {
    if (isOverlayOpen) {
      setEditableContent(content);
    }
  }, [isOverlayOpen, content]);

  const handleOverlayOpen = () => {
    setOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
  };

  // Close overlay when ESC key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverlayOpen(false);
      }
    };

    if (isOverlayOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOverlayOpen]);

  const handleOverlayContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = () => {
    onUpdateContent(editableContent);
    setOverlayOpen(false);
  };

  return (
    <div className="container-for-triplets">
      <ShieldCheck className="Check-tree" size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} fill={fill} />
      <Pen
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={handleOverlayOpen}
      />

      {isOverlayOpen && (
        <div className="overlay" onClick={handleOverlayClose}>
          <div className="overlay-content" onClick={handleOverlayContentClick}>
            <X
              className="close-button"
              width={"1vw"}
              onClick={handleOverlayClose}
            />

            {/* Display Step Number */}
            <div className="step-number-title">Step {stepNumber}</div>
            <textarea
              className="editable-textarea"
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows={5}
            />
            <div className="save-button-div">
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default The_muskeltiers;
