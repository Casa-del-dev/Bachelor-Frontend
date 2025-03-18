// Collapsible.tsx
import React, { useRef, useEffect } from "react";
import "../Start-right.css";

interface CollapsibleProps {
  isOpen: boolean;
  children: React.ReactNode;
  id?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({ isOpen, children, id }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isOpen) {
      el.style.maxHeight = "0px";
      el.getBoundingClientRect(); // forces reflow
      el.style.maxHeight = el.scrollHeight + "px";
    } else {
      console.log("gy");
      const currentHeight = el.scrollHeight;
      el.style.maxHeight = currentHeight + "px";
      el.getBoundingClientRect(); // force reflow
      el.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      id={id}
      style={{
        maxHeight: "0px",
        overflow: "hidden",
        transition: "max-height 0.4s ease",
      }}
    >
      {children}
    </div>
  );
};

export default Collapsible;
