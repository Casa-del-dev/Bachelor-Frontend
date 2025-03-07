import { useState, useRef } from "react";
import "./Start_middle.css";

export default function ResizableSplitView() {
  const [topHeight, setTopHeight] = useState(() => {
    return parseFloat(localStorage.getItem("terminal-height") || `${50}`);
  }); // Initial height in percentage

  const isResizing = useRef(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current) return;
    event.preventDefault();

    const newHeight = ((event.clientY - 43) / window.innerHeight) * 100; //  42 because of the header
    if (newHeight > 10 && newHeight < 90) {
      setTopHeight(newHeight);
      localStorage.setItem("terminal-height", topHeight.toString());
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  return (
    <div className="container">
      <div className="top-section" style={{ height: `${topHeight}%` }}>
        <h2>Top Content</h2>
      </div>

      <div className="resizer" onMouseDown={handleMouseDown} />

      <div className="bottom-section" style={{ height: `${100 - topHeight}%` }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              let newOutput = "";
              newOutput = output + "\n" + "$ " + input;
              setOutput(newOutput);
              setInput("");
            }
          }}
        />
        <div className="terminal"></div>
        {output}
      </div>
    </div>
  );
}
