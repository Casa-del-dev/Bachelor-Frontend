import { useState, useRef, useEffect, ReactNode } from "react";
import "./InformationToolTip.css";

interface InfoWithTooltipProps {
  children: ReactNode; // your icon
  tooltip: ReactNode; // the content to show
}

export function InfoWithTooltip({ children, tooltip }: InfoWithTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<number>(undefined);

  const handleMouseEnter = (e: React.MouseEvent) => {
    // capture initial position
    setPos({ x: e.clientX, y: e.clientY });
    // after 2s, show tooltip
    timerRef.current = window.setTimeout(() => setVisible(true), 1000);
    // track mouse moves so we can reposition
    window.addEventListener("mousemove", handleMouseMove);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    // hide & cleanup
    clearTimeout(timerRef.current);
    setVisible(false);
    window.removeEventListener("mousemove", handleMouseMove);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <span
      className="info-tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div
          className="tooltip-box"
          style={{
            position: "fixed",
            left: pos.x + 8,
            top: pos.y + 16,
            pointerEvents: "none",
          }}
        >
          {tooltip}
        </div>
      )}
    </span>
  );
}
