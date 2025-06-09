import { useState, useRef, useEffect, useLayoutEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import "./InformationToolTip.css";

interface InfoWithTooltipProps {
  children: ReactNode;
  tooltip: ReactNode;
}

export function InfoWithTooltip({ children, tooltip }: InfoWithTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const timerRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    timerRef.current = window.setTimeout(() => setVisible(true), 1000);
  };
  const handleMouseLeave = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    setVisible(false);
  };

  // When the tooltip actually appears, measure and clamp to viewport:
  useLayoutEffect(() => {
    if (!visible || !wrapperRef.current || !tooltipRef.current) return;

    const iconRect = wrapperRef.current.getBoundingClientRect();
    const tipRect = tooltipRef.current.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    // default: right & vertically centered
    let left = iconRect.right + 8;
    let top = iconRect.top + (iconRect.height - tipRect.height) / 2;

    // flip if it would overflow
    if (left + tipRect.width > innerWidth)
      left = iconRect.left - tipRect.width - 8;
    if (top + tipRect.height > innerHeight)
      top = innerHeight - tipRect.height - 8;
    if (top < 8) top = 8;

    setCoords({ left, top });
  }, [visible]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <span
        ref={wrapperRef}
        className="info-tooltip-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="tooltip-box"
            style={{
              position: "fixed",
              left: coords.left,
              top: coords.top,
              zIndex: "1000000",
              pointerEvents: "none",
            }}
          >
            {tooltip}
          </div>,
          document.body
        )}
    </>
  );
}
