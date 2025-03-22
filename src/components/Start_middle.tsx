import { useEffect, useRef, useState } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useCodeContext } from "../CodeContext";
import { useAuth } from "../AuthContext";
import "./Start_middle.css";
import PythonPlayground from "./Program-interface";
import { getActionMessage } from "./BuildingBlocks/ActionMessage";

export default function ResizableSplitView() {
  const [topHeight, setTopHeight] = useState<number>(() => {
    return parseFloat(localStorage.getItem("terminal-height") || "50");
  });

  const isResizing = useRef(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const { code } = useCodeContext();
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const inputBuffer = useRef("");

  /** Setup xterm.js on mount */
  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#f1f1f1",
        foreground: "#000",
        cursor: "black",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    term.current.attachCustomKeyEventHandler((e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "r") {
        return false; // allow browser refresh
      }
      return true;
    });

    setTimeout(() => {
      if (term.current && terminalRef.current) {
        term.current.open(terminalRef.current);
        fitAddon.current?.fit();
      }
    }, 100);

    term.current.onData((key) => {
      if (key === "\r") {
        term.current?.writeln("");

        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ code: inputBuffer.current }));
        }

        inputBuffer.current = "";
      } else if (key === "\u007F") {
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.current?.write("\b \b");
        }
      } else {
        inputBuffer.current += key;
        term.current?.write(key);
      }
    });

    term.current.writeln("Attempting WebSocket connection...");

    return () => {
      term.current?.dispose();
      term.current = null;
    };
  }, []);

  /** Setup WebSocket connection */
  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = new WebSocket("wss://python-api.erenhomburg.com/ws");

    socketRef.current.onopen = () => {
      term.current?.writeln("✅ Connected to Python backend.");
    };

    socketRef.current.onmessage = (event) => {
      term.current?.writeln(event.data);
    };

    socketRef.current.onclose = () => {
      term.current?.writeln("\r\n>> ⚠️ WebSocket disconnected.");
    };

    socketRef.current.onerror = (err) => {
      term.current?.writeln(`\r\n>> ⚠️ WebSocket error: ${err}`);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [isAuthenticated]);

  const sendCodeToBackend = (action: "run" | "compile" | "test") => {
    if (!isAuthenticated || !socketRef.current) {
      term.current?.writeln(">>⚠️ Not authenticated. Please log in.");
      return;
    }

    const actionMessage = getActionMessage(action);
    term.current?.clear();
    term.current?.writeln(`${actionMessage}...\r\n`);
    socketRef.current.send(JSON.stringify({ code }));
    term.current?.focus();
  };

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizing.current) return;
    event.preventDefault();

    const newHeight = ((event.clientY - 40) / window.innerHeight) * 100;
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
      <div className="top-section" style={{ height: `${topHeight}%` }}>
        <PythonPlayground />
      </div>

      <div className="resizer" onMouseDown={handleMouseDown} />

      <div className="bottom-section" style={{ height: `${100 - topHeight}%` }}>
        <div className="icon-terminal">
          <FaPlay
            className="icons-for-terminal"
            size={"1.5vw"}
            onClick={() => sendCodeToBackend("run")}
            style={{ cursor: "pointer" }}
          />
          <FaCog
            className="icons-for-terminal"
            size={"1.5vw"}
            onClick={() => sendCodeToBackend("compile")}
            style={{ cursor: "pointer" }}
          />
          <FaHourglassHalf
            className="icons-for-terminal"
            size={"1.5vw"}
            onClick={() => sendCodeToBackend("test")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="simple-line"></div>
        <div className="bottom-terminal-start">
          <div
            ref={terminalRef}
            onClick={() => {
              setTimeout(() => {
                term.current?.focus();
              }, 0);
            }}
            style={{ height: "100%", width: "100%", cursor: "text" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
