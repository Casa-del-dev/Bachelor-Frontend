import React, { useEffect, useRef, useState } from "react";
import "./Building-Block.css";

const steps = ["Step One", "Step Two", "Step Three", "Step Four"];

const BB: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>(0);

  // A small step height so a tiny scroll triggers the animation.
  const stepHeight = 50;

  useEffect(() => {
    const container = scrollContainerRef.current;
    const updateScroll = () => {
      if (container) {
        setScrollY(container.scrollTop);
      }
    };

    if (container) {
      container.addEventListener("scroll", updateScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScroll);
      }
    };
  }, []);

  // Determine current step index and transition fraction (0 to 1) within that step.
  const i = Math.floor(scrollY / stepHeight);
  const fraction = (scrollY % stepHeight) / stepHeight;

  // Folding logic:
  // • Cards before the active one are fully folded upward (rotated –90°).
  // • The active card (index i) rotates gradually from 0° to –90°.
  // • The incoming card (index i+1) rotates from 90° down to 0°.
  // • Cards after remain folded (90°).
  const getCardRotation = (j: number): number => {
    if (j < i) return -90;
    if (j === i) return fraction * -90;
    if (j === i + 1) return 90 + fraction * -90;
    return 90;
  };

  // We'll set transform origins so that:
  // • Cards above the active one hinge from their bottom.
  // • Active and incoming cards hinge from the top.
  const getTransformOrigin = (j: number): string => {
    return j < i ? "bottom" : "top";
  };

  // Adjust z-index so that the incoming card appears above the active one.
  const getZIndex = (j: number): number => {
    if (j === i + 1) return 3;
    if (j === i) return 2;
    return 1;
  };

  return (
    <div className="bb-scroll-container" ref={scrollContainerRef}>
      <div className="bb-wrapper">
        <div className="bb-sticky-container">
          <div className="bb-card-stack">
            {steps.map((label, j) => {
              const rotation = getCardRotation(j);
              const transformOrigin = getTransformOrigin(j);
              const zIndex = getZIndex(j);
              return (
                <div
                  key={j}
                  className="bb-card"
                  style={{
                    transform: `rotateX(${rotation}deg)`,
                    transformOrigin,
                    zIndex,
                    transition: "transform 0.3s ease",
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BB;
