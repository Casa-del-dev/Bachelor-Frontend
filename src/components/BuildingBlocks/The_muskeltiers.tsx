import React, { useState, useEffect } from "react";
import { ShieldCheck, Pen, X, FileText } from "lucide-react";
import CustomLightbulb from "./Custom-Lightbulb";
import "./The_muskeltiers.css";
import LShapedArrow from "./LShapedArrow";

interface TheMuskeltiersProps {
  number?: number;
  fill?: string;
  content: string;
  stepNumber: string;
  prompt?: string;
  onUpdateContent: (newContent: string) => void;
  onAddChild?: () => void;
}

const The_muskeltiers: React.FC<TheMuskeltiersProps> = ({
  number,
  fill = "yellow",
  prompt,
  content,
  stepNumber,
  onUpdateContent,
  onAddChild,
}) => {
  const [isOverlayOpen, setOverlayOpen] = useState(false);
  const [what, setWhat] = useState<"" | "prompt" | "edit">("");
  const [editableContent, setEditableContent] = useState(content);

  /**
   * For viewing/adding multiple prompts. If your data model only
   * has one prompt string, you can keep it as a single string,
   * but here's how to handle a list of prompts.
   */
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState("");

  // On mount or if the prop changes, store the single prompt in the array:
  useEffect(() => {
    if (prompt) {
      setPreviousPrompts([prompt]);
    } else {
      setPreviousPrompts([]);
    }
  }, [prompt]);

  // Whenever overlay is opened for editing, reset the editable content
  useEffect(() => {
    if (isOverlayOpen && what === "edit") {
      setEditableContent(content);
    }
  }, [isOverlayOpen, what, content]);

  // Close overlay with ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleOverlayClose();
      }
    };

    if (isOverlayOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOverlayOpen]);

  /**
   * Handlers for opening overlays
   */
  const handleOverlayOpenPrompt = () => {
    setOverlayOpen(false); //maybe it's not a good idea
    setWhat("prompt");
  };
  const handleOverlayOpenEditing = () => {
    setOverlayOpen(true);
    setWhat("edit");
  };

  /**
   * Close overlay
   */
  const handleOverlayClose = () => {
    setOverlayOpen(false);
    setWhat("");
  };

  /**
   * Stop click from bubbling when clicking inside overlay so it doesn't
   * close automatically if the user clicks inside the content
   */
  const handleOverlayContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  /**
   * For saving the updated `content`
   */
  const handleSaveContent = () => {
    onUpdateContent(editableContent);
    handleOverlayClose();
  };

  /**
   * For adding a new prompt to the list
   */
  const handleSendNewPrompt = () => {
    if (!newPrompt.trim()) return;
    setPreviousPrompts([...previousPrompts, newPrompt.trim()]);
    setNewPrompt("");
    // If you want to do something else with the new prompt,
    // like pass it up to the parent, do it here:
    //
    // onSomeParentHandler(newPrompt);
  };

  return (
    <div className="container-for-triplets">
      <ShieldCheck className="Check-tree" size="1.5vw" strokeWidth="1" />
      <CustomLightbulb number={number} fill={fill} />

      {/* Open PROMPT overlay */}
      <FileText
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={handleOverlayOpenPrompt}
      />

      {/* Open EDIT overlay */}
      <Pen
        className="Filetext-tree"
        size="1.5vw"
        strokeWidth="1"
        onClick={handleOverlayOpenEditing}
      />

      <div className="Lshapedarrow">
        <LShapedArrow onClick={onAddChild} />
      </div>
      {/* If overlay is open, show it */}
      {isOverlayOpen && (
        <div className="overlay" onClick={handleOverlayClose}>
          <div className="overlay-content" onClick={handleOverlayContentClick}>
            <X
              className="close-button"
              width={"1vw"}
              onClick={handleOverlayClose}
            />

            {what === "edit" && (
              <>
                <div className="step-number-title">Step {stepNumber}</div>
                <textarea
                  className="editable-textarea"
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  rows={5}
                />
                <div className="save-button-div">
                  <button className="save-button" onClick={handleSaveContent}>
                    Save
                  </button>
                </div>
              </>
            )}

            {what === "prompt" && (
              <>
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
                  placeholder="Modify this step"
                  onChange={(e) => setNewPrompt(e.target.value)}
                  rows={3}
                />

                <div className="save-button-div">
                  <button className="save-button" onClick={handleSendNewPrompt}>
                    Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default The_muskeltiers;
