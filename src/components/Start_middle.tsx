import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useCodeContext } from "../CodeContext";
import { useAuth } from "../AuthContext";
import "./Start_middle.css";
import PythonPlayground from "./Program-interface";
import { getActionMessage } from "./BuildingBlocks/ActionMessage";
import { Step } from "./Start";

interface PythonPlaygroundProps {
  setHoveredStep: (step: Step | null) => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setFromEditor: Dispatch<SetStateAction<boolean>>;
  codeMap: Record<string, string>;
  setCodeForFile: (fileId: number, code: string) => void;
  currentFile: number | null;
  currentFileName: string | null;
}

export default function ResizableSplitView({
  setHoveredStep,
  loading,
  setLoading,
  setFromEditor,
  codeMap,
  setCodeForFile,
  currentFile,
  currentFileName,
}: PythonPlaygroundProps) {
  const [topHeight, setTopHeight] = useState<number>(() => {
    return parseFloat(localStorage.getItem("terminal-height") || "50");
  });

  const isResizing = useRef(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const { test } = useCodeContext();
  const { isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const inputBuffer = useRef("");
  const waitingForInputRef = useRef(false);

  const cursorPos = useRef(0);

  /** Setup xterm.js on mount */
  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      cursorWidth: 10,
      theme: {
        background: "#f1f1f1",
        foreground: "#000",
        cursor: "black",
      },
      // @ts-ignore: cursorAccentColor is supported in xterm@5.3.0
      cursorAccentColor: "#f1f1f1",
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
        // Enter: finish the input, send it via WebSocket, then reset the buffer.
        term.current?.writeln("");
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const payload = waitingForInputRef.current
            ? { action: "input_response", value: inputBuffer.current }
            : { action: "run", code: inputBuffer.current };
          socketRef.current.send(JSON.stringify(payload));
          waitingForInputRef.current = false;
        }
        inputBuffer.current = "";
        cursorPos.current = 0;
      } else if (key === "\u007F") {
        // Backspace: delete the character before the cursor if one exists.
        if (cursorPos.current > 0) {
          inputBuffer.current =
            inputBuffer.current.slice(0, cursorPos.current - 1) +
            inputBuffer.current.slice(cursorPos.current);
          cursorPos.current--;
          // Use ANSI codes to move the cursor back, erase the character and reprint the rest
          term.current?.write("\b \b");
        } else {
          // Bell sound if there's nothing to remove
          term.current?.write("\x07");
        }
      } else if (key === "\x1B[D") {
        // Left arrow: only move left if not at start
        if (cursorPos.current > 0) {
          cursorPos.current--;
          term.current?.write("\x1b[D");
        } else {
          term.current?.write("\x07"); // beep if already at left end
        }
      } else if (key === "\x1B[C") {
        // Right arrow: only move right if there is text to the right
        if (cursorPos.current < inputBuffer.current.length) {
          cursorPos.current++;
          term.current?.write("\x1b[C");
        } else {
          term.current?.write("\x07"); // beep if already at right end
        }
      } else if (key === "\x1B[A" || key === "\x1B[B") {
        // Up or down arrow: disable by emitting a bell sound.
        term.current?.write("\x07");
      } else {
        // Normal character input: insert at the current position.
        inputBuffer.current =
          inputBuffer.current.slice(0, cursorPos.current) +
          key +
          inputBuffer.current.slice(cursorPos.current);
        term.current?.write(key);
        cursorPos.current++;
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
      try {
        const message = JSON.parse(event.data);
        if (message.action === "input_request") {
          term.current?.writeln(message.prompt);
          waitingForInputRef.current = true;
          return; // Don't print the raw JSON
        }
      } catch (err) {
        // If the message isn't JSON or doesn't match, simply print it.
      }
      const lines = event.data.split(/\r?\n/);
      for (const line of lines) {
        term.current?.writeln(line);
      }
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

    if (!currentFile) return;
    const code = codeMap[currentFile];
    if (action === "test") {
      socketRef.current.send(JSON.stringify({ action, code, tests: test }));
    } else {
      socketRef.current.send(JSON.stringify({ action, code }));
    }
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
        <PythonPlayground
          setHoveredStep={setHoveredStep}
          loading={loading}
          setLoading={setLoading}
          setFromEditor={setFromEditor}
          codeMap={codeMap}
          setCodeForFile={setCodeForFile}
          currentFile={currentFile}
          currentFileName={currentFileName}
        />
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
            onClick={() => {
              sendCodeToBackend("test");
            }}
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
