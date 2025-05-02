import { useState, useLayoutEffect, useRef } from "react";

interface Props {
  text: string;
  maxLines?: number;
}

export default function LineClampedComment({ text, maxLines = 3 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);

  /* ----------  measure overflow once, after the first layout  --------- */
  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;

    // ensure the clamp is ON while measuring
    el.style.webkitLineClamp = String(maxLines);

    // if scrollHeight > clientHeight, the text was clipped
    setHasOverflow(el.scrollHeight - el.clientHeight > 1); // 1 px tolerance
  }, [text, maxLines]); // runs again if the review text ever changes

  /* ----------  render  ------------------------------------------------- */
  return (
    <div className="comment-wrapper">
      <p
        ref={pRef}
        className={`review-comment ${expanded ? "expanded" : ""}`}
        style={!expanded ? { WebkitLineClamp: maxLines } : undefined}
      >
        {text}
      </p>

      {hasOverflow && (
        <button
          type="button"
          className="read-more"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "show less" : "more"}
        </button>
      )}
    </div>
  );
}
