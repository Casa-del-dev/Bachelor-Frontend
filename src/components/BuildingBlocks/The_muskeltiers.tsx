import React, { useState, useEffect } from "react";
import { ShieldCheck, Pen, X, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";
import LShapedArrow from "./LShapedArrow";

interface TheMuskeltiersProps {
  number?: number;
  fill?: string;
  stepNumber: string;
  prompt?: string;
  onAddChild?: () => void;
  onEditStep?: () => void;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  number,
  fill = "yellow",
  prompt,
  stepNumber,
  onAddChild,
  onEditStep,
}) => {
  /**
   * We'll keep the prompt overlay only. The edit overlay is removed
   * because inline editing is done in StartRight.
   */
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState("");

  // If there's a single prompt coming in from props, store it
  useEffect(() => {
    if (prompt) {
      setPreviousPrompts([prompt]);
    } else {
      setPreviousPrompts([]);
    }
  }, [prompt]);

  const handleOverlayClose = () => {
    setIsPromptOpen(false);
  };

  const handleSendNewPrompt = () => {
    if (!newPrompt.trim()) return;
    setPreviousPrompts([...previousPrompts, newPrompt.trim()]);
    setNewPrompt("");
  };

  return (
    <div className="container-for-triplets">
      <ShieldCheck className="Check-tree" size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} fill={fill} />

      {/* Prompt overlay icon */}
      <FileText
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={() => setIsPromptOpen(true)}
      />

      {/* Pen icon now calls `onEditStep` instead of opening an edit overlay */}
      <Pen
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={() => {
          if (onEditStep) {
            onEditStep();
          }
        }}
      />

      {/* L-shaped arrow to add a substep */}
      <div className="Lshapedarrow">
        <LShapedArrow onClick={onAddChild} />
      </div>

      {/* PROMPT OVERLAY ONLY */}
      {isPromptOpen && (
        <div className="overlay" onClick={handleOverlayClose}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <X
              className="close-button"
              width={"1vw"}
              onClick={handleOverlayClose}
            />
            <div className="step-number-title">Step {stepNumber}</div>

            <div className="previous-prompts-container">
              {previousPrompts.length > 0 ? (
                previousPrompts.map((p, idx) => (
                  <div key={idx} className="single-prompt">
                    {p}
                  </div>
                ))
              ) : (
                <div>No prompts yet.</div>
              )}
            </div>

            <textarea
              className="editable-textarea-for-prompt"
              value={newPrompt}
              placeholder="Add a new prompt"
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={3}
            />
            <div className="save-button-div">
              <button className="save-button" onClick={handleSendNewPrompt}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default The_muskeltiers;
