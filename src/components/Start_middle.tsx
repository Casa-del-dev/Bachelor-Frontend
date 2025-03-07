import { useState, useRef } from "react";
import "./Start_middle.css";

export default function ResizableSplitView() {
  const [topHeight, setTopHeight] = useState(() => {
    return parseFloat(localStorage.getItem("terminal-height") || `${50}`);
  }); // Initial height in percentage

  const isResizing = useRef(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleClickOnTerminal = () => {
    if (inputRef.current) inputRef.current.focus();
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
        <div className="icon-terminal">CIAOOO</div>
        <div className="simple-line"></div>
        <div className="bottom-terminal-start" onClick={handleClickOnTerminal}>
          <div className="terminal">{output}</div>
          <input
            type="text"
            value={input}
            ref={inputRef}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let newOutput = "";
                newOutput = output + "\n" + "$ " + input + "\n";
                switch (input) {
                  case "ls":
                    newOutput += "List of projects";
                    break;
                  case "pwd":
                    newOutput += "";
                    break;
                  default:
                    newOutput += "Unknown command";
                }
                setOutput(newOutput);
                setInput("");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
