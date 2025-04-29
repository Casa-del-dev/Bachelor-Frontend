import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
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
  codeMap: Record<string, string | null>;
  setCodeForFile: (fileId: number, code: string | null) => void;
  currentFile: number | null;
  currentFileName: string | null;
  fileTree: any;
  test: string;
  problemId: string;
  stepTree: any;
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
  test,
  fileTree,
  problemId,
  stepTree,
}: PythonPlaygroundProps) {
  const [topHeight, setTopHeight] = useState<number>(() => {
    return parseFloat(localStorage.getItem("terminal-height") || "50");
  });
  const isResizing = useRef(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const { isAuthenticated } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const inputBuffer = useRef("");
  const waitingForInputRef = useRef(false);
  const cursorPos = useRef(0);

  const PROMPT = "> ";

  const refreshLine = () => {
    if (!term.current) return;
    term.current.write("\x1b[2K\r");
    term.current.write(PROMPT + inputBuffer.current);
    const offset = inputBuffer.current.length - cursorPos.current;
    if (offset > 0) {
      term.current.write(`\x1b[${offset}D`);
    }
  };

  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      cursorWidth: 10,
      theme: {
        background: "#f1f1f1",
        foreground: "#000000",
        cursor: "black",
      },
    });

    fitAddon.current = new FitAddon();
    term.current.loadAddon(fitAddon.current);

    term.current.attachCustomKeyEventHandler((e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "r") {
        return false;
      }
      return true;
    });

    setTimeout(() => {
      if (term.current && terminalRef.current) {
        term.current.open(terminalRef.current);
        fitAddon.current?.fit();
        term.current.write(PROMPT);
        term.current.focus();
      }
    }, 100);

    term.current.onKey(({ domEvent }) => {
      const key = domEvent.key;
      switch (key) {
        case "Backspace":
          if (cursorPos.current > 0) {
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current - 1) +
              inputBuffer.current.slice(cursorPos.current);
            cursorPos.current--;
          } else {
            term.current?.write("\x07");
          }
          break;

        case "Delete":
          if (cursorPos.current < inputBuffer.current.length) {
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current) +
              inputBuffer.current.slice(cursorPos.current + 1);
          } else {
            term.current?.write("\x07");
          }
          break;

        case "ArrowLeft":
          if (cursorPos.current > 0) {
            cursorPos.current--;
          } else {
            term.current?.write("\x07");
          }
          break;

        case "ArrowRight":
          if (cursorPos.current < inputBuffer.current.length) {
            cursorPos.current++;
          } else {
            term.current?.write("\x07");
          }
          break;

        case "Enter":
          term.current?.write("\r\n");
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            const payload = waitingForInputRef.current
              ? { action: "input_response", value: inputBuffer.current }
              : { action: "run", code: inputBuffer.current };
            socketRef.current.send(JSON.stringify(payload));
            waitingForInputRef.current = false;
          }
          inputBuffer.current = "";
          cursorPos.current = 0;
          term.current?.write(PROMPT);
          return;

        default:
          if (key.length === 1) {
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current) +
              key +
              inputBuffer.current.slice(cursorPos.current);
            cursorPos.current++;
          } else {
            return;
          }
      }
      refreshLine();
    });

    const ro = new ResizeObserver(() => fitAddon.current?.fit());
    if (terminalRef.current) ro.observe(terminalRef.current);

    return () => {
      term.current?.dispose();
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    fitAddon.current?.fit();
  }, [topHeight]);

  useEffect(() => {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          if (term.current) {
            const isDark = document.body.classList.contains("dark-mode");
            term.current.options = {
              theme: {
                background: isDark ? "#121212" : "#f1f1f1",
                foreground: isDark ? "#f0f0f0" : "#000000",
                cursor: isDark ? "#f0f0f0" : "#000000",
              },
            };
          }
        }
      }
    });
    obs.observe(document.body, { attributes: true });
    return () => obs.disconnect();
  }, []);

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
          return;
        }
      } catch {}
      const lines = event.data.split(/\r?\n/);
      for (const line of lines) {
        term.current?.writeln(line);
      }
    };

    socketRef.current.onclose = () => {
      term.current?.writeln(`\r
>> ⚠️ WebSocket disconnected.`);
    };

    socketRef.current.onerror = (err) => {
      term.current?.writeln(`\r
>> ⚠️ WebSocket error: ${err}`);
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
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    e.preventDefault();
    // calculate percentage directly from cursor Y
    const newHeight = (e.clientY / window.innerHeight) * 100;
    if (newHeight > 10 && newHeight < 90) {
      setTopHeight(newHeight);
      localStorage.setItem("terminal-height", newHeight.toString());
      fitAddon.current?.fit();
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
          fileTree={fileTree}
          problemId={problemId}
          stepTree={stepTree}
        />
      </div>

      <div className="resizer" onMouseDown={handleMouseDown} />

      <div className="bottom-section" style={{ height: `${100 - topHeight}%` }}>
        <div className="icon-terminal">
          <FaPlay
            className="icons-for-terminal"
            size="1.5vw"
            onClick={() => sendCodeToBackend("run")}
          />
          <FaCog
            className="icons-for-terminal"
            size="1.5vw"
            onClick={() => sendCodeToBackend("compile")}
          />
          <FaHourglassHalf
            className="icons-for-terminal"
            size="1.5vw"
            onClick={() => sendCodeToBackend("test")}
          />
        </div>
        <div className="simple-line" />
        <div className="bottom-terminal-start">
          <div
            ref={terminalRef}
            onClick={() => setTimeout(() => term.current?.focus(), 0)}
            style={{ width: "100%", height: "100%", cursor: "text" }}
          />
        </div>
      </div>
    </div>
  );
}
