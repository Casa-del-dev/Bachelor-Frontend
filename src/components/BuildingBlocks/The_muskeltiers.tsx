import React, { useState, useEffect } from "react";
import { ShieldCheck, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";

interface TheMuskeltiersProps {
  number?: number;
  fill?: string;
  prompt?: string;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  number,
  fill = "yellow",
  prompt,
}) => {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  const handleOverlayOpen = () => {
    if (prompt) {
      setOverlayOpen(true);
    }
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);
  };

  // Prevent overlay closure when clicking inside the modal content
  const handleOverlayContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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

  return (
    <div className="container-for-triplets">
      <ShieldCheck className="Check-tree" size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} fill={fill} />
      <FileText
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={handleOverlayOpen}
      />

      {isOverlayOpen && (
        <div className="overlay" onClick={handleOverlayClose}>
          <div className="overlay-content" onClick={handleOverlayContentClick}>
            <button className="close-button" onClick={handleOverlayClose}>
              X
            </button>
            <div className="prompt-text">{prompt}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default The_muskeltiers;
