import { useState, useRef } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa"; // FontAwesome icons
import Programming from "./Program-interface";
import { handleRunCode } from "./BuildingBlocks/RunCode";
import { useCodeContext } from "../CodeContext";
import { useAuth } from "../AuthContext";
import "./Start_middle.css";

export default function ResizableSplitView() {
  const [topHeight, setTopHeight] = useState(() => {
    return parseFloat(localStorage.getItem("terminal-height") || `${50}`);
  }); // Initial height in percentage

  const { code, codeOutput, setCodeOutput } = useCodeContext();
  const isResizing = useRef(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { isAuthenticated } = useAuth();

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleClickOnTerminal = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current) return;
    event.preventDefault();

    const newHeight = ((event.clientY - 42) / window.innerHeight) * 100; //  42 because of the header
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
        <Programming />
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} />

      <div className="bottom-section" style={{ height: `${100 - topHeight}%` }}>
        <div className="icon-terminal">
          <FaPlay
            size={20}
            className="play-icon"
            onClick={() =>
              handleRunCode(
                code,
                codeOutput,
                setCodeOutput,
                isAuthenticated,
                setOutput
              )
            }
          />

          <FaCog size={20} />
          <FaHourglassHalf size={20} />
        </div>
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
                let newOutput = output;
                newOutput += "$ " + input + "\n";
                switch (input) {
                  case "ls":
                    newOutput += "List of projects" + "\n";
                    break;
                  case "pwd":
                    newOutput += "" + "\n";
                    break;
                  default:
                    newOutput += "Unknown command" + "\n";
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
