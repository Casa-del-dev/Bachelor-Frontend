import React from "react";
import "./GradientSpinner.css";

interface GradientSpinnerProps {
  size?: number;
  strokeWidth?: number;
}

const GradientSpinner: React.FC<GradientSpinnerProps> = ({
  size = 100,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className="gradient-spinner"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {/* Define a circular gradient for the stroke */}
      <defs>
        <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="1" />
          <stop offset="70%" stopColor="#aaa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Draw a circle, but only stroke (no fill) */}
      <circle
        className="path"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#grad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.25}
      />
    </svg>
  );
};

export default GradientSpinner;
