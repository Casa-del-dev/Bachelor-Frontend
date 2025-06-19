// ReviewCard.tsx
import { Pen, Plus, Trash2, Save, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./ReviewCard.css";

interface ReviewCardProps {
  username: string;
  rating: number; // 0–5
  message: string; // empty = no review yet
  onSave?: (msg: string, rating: number) => void;
  onDelete?: () => void;
}

export default function ReviewCard({
  username,
  rating,
  message,
  onSave,
  onDelete,
}: ReviewCardProps) {
  // ─────────────────────────────────────────────────────────────────────
  // Local state inside ReviewCard:
  // ─────────────────────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [workingText, setWorkingText] = useState(message);
  const [workingRating, setWorkingRating] = useState(rating);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [ratingError, setRatingError] = useState(false);

  // Refs for click‐outside and auto‐resizing:
  const cardRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setWorkingText(message);
    setWorkingRating(rating);
  }, [message, rating]);

  useEffect(() => {
    if (editMode) {
      setWorkingText(message);
      setWorkingRating(rating);
      setHoveredRating(null);
      setRatingError(false);
    }
  }, [editMode]);

  useEffect(() => {
    if (!editMode) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editMode]);

  useEffect(() => {
    if (!editMode) return;

    const handleDocumentClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        saveOrCancelOnBlur();
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [editMode, workingText, workingRating]);

  const flashRatingError = () => {
    setRatingError(true);
    setTimeout(() => {
      setRatingError(false);
    }, 800);
  };

  const saveOrCancelOnBlur = () => {
    // If no rating selected, flash error instead of exiting
    if (workingRating === 0) {
      flashRatingError();
      return;
    }
    // Otherwise, save (text may be empty)
    onSave?.(workingText.trim(), workingRating);
    setEditMode(false);
  };

  const handleSaveClick = () => {
    if (workingRating === 0) {
      flashRatingError();
      return;
    }
    onSave?.(workingText.trim(), workingRating);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditMode(false);
    setWorkingText(message);
    setWorkingRating(rating);
    setHoveredRating(null);
    setRatingError(false);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  const handleStarClick = (index: number) => {
    if (!editMode) return;
    setWorkingRating(index + 1);
  };

  const renderStars = () => {
    return (
      <div className="stars">
        {Array.from({ length: 5 }, (_, i) => {
          let color = "#ccc";

          if (ratingError) {
            // Flash all stars in red when error
            color = "#FF2400";
          } else if (editMode && hoveredRating !== null && i < hoveredRating) {
            // Hover color
            color = "#DAA520";
          } else if (i < workingRating) {
            // Filled star color
            color = "#FFD700";
          }

          return (
            <span
              key={i}
              className="star"
              style={{
                color,
                cursor: editMode ? "pointer" : "default",
                fontSize: "2rem",
                padding: "0.2rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={() => editMode && setHoveredRating(i + 1)}
              onMouseLeave={() => editMode && setHoveredRating(null)}
              onClick={() => handleStarClick(i)}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  if (rating === 0 && !editMode) {
    return (
      <div
        ref={cardRef}
        className="review-card empty-mode-card"
        style={{ padding: "1rem", boxSizing: "border-box" }}
      >
        <div className="review-header">
          <h4>{username}</h4>
          <div className="icon-buttons">
            {/* ➕ triggers edit mode */}
            <Plus
              className="icon plus-icon"
              onClick={() => setEditMode(true)}
            />
          </div>
        </div>
        <div className="empty-body">
          <p className="empty-text">Create your review</p>
        </div>
      </div>
    );
  }

  if (!editMode) {
    return (
      <div
        ref={cardRef}
        className={`review-card`}
        style={{ overflowY: "auto" }}
      >
        {workingRating === 5 ? (
          <div
            className="five-stars"
            style={{ padding: "1rem", minHeight: "calc(200px - 2rem)" }}
          >
            <div className="review-header">
              <h4>{username}</h4>
              <div className="icon-buttons">
                <Pen className="icon" onClick={() => setEditMode(true)} />
                <Trash2 className="icon" onClick={handleDelete} />
              </div>
            </div>

            {renderStars()}

            <p className="review-message">
              <em>{message}</em>
            </p>
          </div>
        ) : (
          <div style={{ minHeight: "calc(200px - 2rem)" }}>
            <div className="review-header">
              <h4>{username}</h4>
              <div className="icon-buttons">
                <Pen className="icon" onClick={() => setEditMode(true)} />
                <Trash2 className="icon" onClick={handleDelete} />
              </div>
            </div>

            {renderStars()}

            <p className="review-message">
              <em>{message}</em>
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={cardRef} className={`review-card editing `}>
      {workingRating === 5 ? (
        <div
          className="five-stars"
          style={{ padding: "1rem", minHeight: "calc(200px - 2rem)" }}
        >
          <div className="review-header">
            <h4>{username}</h4>
            <div className="icon-buttons">
              <Save
                className={`icon-rev save-icon ${
                  workingRating > 0 ? "" : "disabled"
                }`}
                onClick={handleSaveClick}
              />
              <X className="icon-rev" onClick={handleCancel} />
            </div>
          </div>

          {renderStars()}

          <textarea
            ref={textareaRef}
            className="edit-textarea"
            placeholder="Type your review"
            value={workingText}
            onChange={(e) => {
              setWorkingText(e.target.value);
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveClick();
              }
            }}
          />
        </div>
      ) : (
        <div style={{ padding: "1rem", minHeight: "calc(200px - 2rem)" }}>
          <div className="review-header">
            <h4>{username}</h4>
            <div className="icon-buttons">
              <Save
                className={`icon save-icon ${
                  workingRating > 0 ? "" : "disabled"
                }`}
                onClick={handleSaveClick}
              />
              <X className="icon" onClick={handleCancel} />
            </div>
          </div>

          {renderStars()}

          <textarea
            ref={textareaRef}
            className="edit-textarea"
            placeholder="Type your review"
            value={workingText}
            onChange={(e) => {
              setWorkingText(e.target.value);
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveClick();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
