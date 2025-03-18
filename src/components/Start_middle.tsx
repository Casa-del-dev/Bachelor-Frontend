import { useEffect, useRef, useState } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useCodeContext } from "../CodeContext";
import { useAuth } from "../AuthContext";
import "./Start_middle.css";
import PythonPlayground from "./Program-interface"; // your editor

export default function ResizableSplitView() {
  const [topHeight, setTopHeight] = useState<number>(() => {
    return parseFloat(localStorage.getItem("terminal-height") || "50");
  });

  const isResizing = useRef(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const { code } = useCodeContext(); // Editor code
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);

  // We'll store the current typed line in inputBuffer
  const inputBuffer = useRef("");

  /** Setup xterm.js on mount */
  useEffect(() => {
    if (!terminalRef.current || term.current) return; // Prevent multiple init

    term.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#f1f1f1", // black background
        foreground: "#000", // white text
        cursor: "black",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);
    term.current.open(terminalRef.current);
    fitAddon.current.fit();
    term.current.focus();

    // Handle user input
    term.current.onData((key) => {
      if (key === "\r") {
        // ENTER pressed
        // Move to a new line in the local terminal
        term.current?.writeln("");

        // Send the typed line to the server
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ code: inputBuffer.current }));
        }
        // Clear the input buffer
        inputBuffer.current = "";
      } else if (key === "\u007F") {
        // BACKSPACE
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          // Erase the last char on the screen
          term.current?.write("\b \b");
        }
      } else {
        // Normal character
        inputBuffer.current += key;
        term.current?.write(key);
      }
    });

    term.current.writeln("Attempting WebSocket connection...");
  }, []);

  /** Connect to backend WebSocket */
  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = new WebSocket("wss://python-api.erenhomburg.com/ws");

    socketRef.current.onopen = () => {
      term.current?.writeln("✅ Connected to Python backend.");
    };

    socketRef.current.onmessage = (event) => {
      // Print each message on its own line
      term.current?.writeln(event.data);
    };

    socketRef.current.onclose = () => {
      term.current?.writeln("\r\n⚠️ WebSocket disconnected.");
    };

    socketRef.current.onerror = (err) => {
      term.current?.writeln(`\r\n⚠️ WebSocket error: ${err}`);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [isAuthenticated]);

  /**
   * When you click RUN (or COMPILE / TEST),
   * we clear the terminal and send the entire editor code.
   */
  const sendCodeToBackend = (action: "run" | "compile" | "test") => {
    if (!isAuthenticated || !socketRef.current) {
      term.current?.writeln("⚠️ Not authenticated. Please log in.");
      return;
    }
    // Clear the terminal
    term.current?.clear();
    term.current?.writeln(`$ Running ${action}...\r\n`);

    // Send the code from the editor
    socketRef.current.send(JSON.stringify({ code }));
  };

  /** Handle Resizing */
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current) return;
    event.preventDefault();

    const newHeight = ((event.clientY - 42) / window.innerHeight) * 100; // adjust for header
    if (newHeight > 10 && newHeight < 90) {
      setTopHeight(newHeight);
      localStorage.setItem("terminal-height", newHeight.toString());
    }
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="container">
      {/* Editor (top) */}
      <div className="top-section" style={{ height: `${topHeight}%` }}>
        <PythonPlayground />
      </div>

      {/* Resizer */}
      <div className="resizer" onMouseDown={handleMouseDown} />

      {/* Terminal (bottom) */}
      <div className="bottom-section" style={{ height: `${100 - topHeight}%` }}>
        <div className="icon-terminal">
          <FaPlay
            className="icons-for-terminal"
            size={"2vw"}
            onClick={() => sendCodeToBackend("run")}
            style={{ cursor: "pointer" }}
          />
          <FaCog
            className="icons-for-terminal"
            size={"2vw"}
            onClick={() => sendCodeToBackend("compile")}
            style={{ cursor: "pointer" }}
          />
          <FaHourglassHalf
            className="icons-for-terminal"
            size={"2vw"}
            onClick={() => sendCodeToBackend("test")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="simple-line"></div>
        <div className="bottom-terminal-start">
          <div
            ref={terminalRef}
            style={{ height: "100%", width: "100%", cursor: "pointer" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
