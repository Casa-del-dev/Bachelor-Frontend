import { Plus } from "lucide-react";
import "./PlusbetweenSteps.css";
import { useEffect, useState } from "react";

interface PlusBetweenStepsProps {
  onClick?: () => void;
  style?: React.CSSProperties;
  plus?: boolean;
  empty?: boolean;
  tooltip?: string;
}

const PlusbetweenSteps: React.FC<PlusBetweenStepsProps> = ({
  onClick,
  style,
  plus = true,
  empty = true,
  tooltip,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.body.classList.contains("dark-mode") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.body.classList.contains("dark-mode") ? "dark" : "light"
      );
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container-plus-right-start" style={style}>
      {plus && empty && <div className="straightline-left" />}

      <div
        className="container-forplus-hovering-text"
        data-tooltip={tooltip}
        onMouseMove={(e) => {
          // record mouse coords into CSS vars
          e.currentTarget.style.setProperty("--tooltip-x", `${e.clientX}px`);
          e.currentTarget.style.setProperty("--tooltip-y", `${e.clientY}px`);
        }}
      >
        <Plus
          style={{
            width: plus
              ? "calc(var(--step-font-size, 1vw) * 1.6)"
              : "calc(var(--step-font-size, 1vw) * 0.8)",
            height: plus
              ? "calc(var(--step-font-size, 1vw) * 1.6)"
              : "calc(var(--step-font-size, 1vw) * 0.8)",
            border:
              plus && empty
                ? `1px solid ${theme === "dark" ? "white" : "black"}`
                : !empty
                ? "1px solid #b8b8b8"
                : "",
          }}
          className="plusbetweensteps"
          onClick={onClick}
        />
      </div>

      {plus && empty && <div className="straightline-right" />}
    </div>
  );
};

export default PlusbetweenSteps;
