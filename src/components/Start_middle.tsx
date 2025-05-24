import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FaCog, FaPlay, FaHourglassHalf } from "react-icons/fa";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { useAuth } from "../AuthContext";
import "./Start_middle.css";
import PythonPlayground from "./Program-interface";
import { Step } from "./Start";
import {
  runCode,
  compileCode,
  testCode,
} from "./BuildingBlocks/PythonCompiler";

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
  const inputBuffer = useRef("");
  const cursorPos = useRef(0);
  const terminalCols = () => term.current?.cols || 80; // default 80
  const startRow = useRef(0); // used to know what row it's writing on
  let previousCursorPos = useRef(0); // needed for making the char under the bar black or white again
  const hasWrittenInitialPrompt = useRef(false);

  const PROMPT = "> ";

  function getXtermTheme() {
    const isDark = document.body.classList.contains("dark-mode");
    return {
      background: isDark ? "#121212" : "#fff",
      foreground: isDark ? "#f0f0f0" : "#000000",
      cursor: isDark ? "#f0f0f0" : "#000000",
    };
  }

  useEffect(() => {
    if (!terminalRef.current || term.current) return;

    term.current = new Terminal({
      cursorBlink: true,
      cursorStyle: "bar",
      cursorWidth: 10,
      theme: getXtermTheme(),
      convertEol: true,
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
      if (
        term.current &&
        terminalRef.current &&
        !hasWrittenInitialPrompt.current
      ) {
        term.current.open(terminalRef.current);
        fitAddon.current?.fit();
        term.current.write(PROMPT);
        startRow.current = term.current.buffer.active.cursorY;
        hasWrittenInitialPrompt.current = true;
      }
    }, 300);

    term.current.onKey(({ domEvent }) => {
      const key = domEvent.key;
      switch (key) {
        case "Backspace":
          if (cursorPos.current > 0) {
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current - 1) +
              inputBuffer.current.slice(cursorPos.current);

            cursorPos.current--;

            const promptLength = PROMPT.length;
            const termWidth = terminalCols();
            const col = (promptLength + cursorPos.current) % termWidth;

            if (col === termWidth - 1) {
              // We crossed into the previous line
              term.current?.write("\x1b[A"); // move up one line
              term.current?.write(`\x1b[${termWidth}G`); // go to last column
            } else {
              term.current?.write("\x1b[D"); // move left normally
            }

            // Save cursor
            term.current?.write("\x1b[s");

            // Write rest of the text after the deleted character + space
            const afterCursor = inputBuffer.current.slice(cursorPos.current);
            term.current?.write(afterCursor + " ");

            // Restore cursor
            term.current?.write("\x1b[u");
          } else {
            term.current?.write("\x07"); // bell if can't backspace
          }

          refreshCursor();
          break;

        case "Delete":
          if (cursorPos.current < inputBuffer.current.length) {
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current) +
              inputBuffer.current.slice(cursorPos.current + 1);

            const afterCursor = inputBuffer.current.slice(cursorPos.current);

            // Save cursor position
            term.current?.write("\x1b[s");

            // Write the rest after the deleted character + a space to clear leftover
            term.current?.write(afterCursor + " ");

            // Restore cursor back
            term.current?.write("\x1b[u");
          } else {
            term.current?.write("\x07"); // Bell sound if nothing to delete
          }

          refreshCursor();
          break;

        case "ArrowLeft":
          if (cursorPos.current > 0) {
            cursorPos.current--;

            // calculate actual cursor position
            const col = (PROMPT.length + cursorPos.current) % terminalCols();

            if (col === terminalCols() - 1) {
              // if we wrapped back to previous line
              term.current?.write("\x1b[A"); // move cursor up
              term.current?.write(`\x1b[${terminalCols()}G`); // go to last column
            } else {
              term.current?.write("\x1b[D"); // move left normally
            }
          } else {
            term.current?.write("\x07"); // bell
          }

          refreshCursor();
          break;

        case "ArrowRight":
          if (cursorPos.current < inputBuffer.current.length) {
            const promptLength = PROMPT.length;
            const termWidth = terminalCols();

            const nextCursorPos = cursorPos.current + 1;
            const nextCol = (promptLength + nextCursorPos) % termWidth;

            cursorPos.current++;

            if (nextCol === 0) {
              // We wrapped onto a new line
              term.current?.write("\r\n"); // move to beginning of next line
            } else {
              term.current?.write("\x1b[C"); // move right normally
            }
          } else {
            term.current?.write("\x07"); // bell
          }

          refreshCursor();
          break;

        case "Enter": {
          if (!isAuthenticated) {
            printLinesAndReanchor(["⚠️ Please log in first."]);
            return;
          }
          const snippet = inputBuffer.current.trim();
          eraseCursorBar();

          // otherwise fall back to normal newline + prompt logic
          term.current?.write("\r\n");
          inputBuffer.current = "";
          cursorPos.current = 0;
          previousCursorPos.current = 0;
          const baseH = term.current!.buffer.active.cursorY;

          if (!snippet) {
            term.current?.writeln(PROMPT);
            term.current?.write(PROMPT);
            startRow.current = term.current!.buffer.active.cursorY + 2;
            return;
          }

          let linesPrinted = 0;
          runCode(snippet).then((output) => {
            output.split("\n").forEach((line) => {
              if (line === "✅ Code ran successfully.") {
                term.current?.writeln(`${PROMPT}`);
                linesPrinted++;
                return;
              }
              const lineLength = PROMPT.length + line.length;
              const lineWraps = Math.ceil(lineLength / terminalCols());
              linesPrinted += lineWraps > 0 ? lineWraps : 1;
              term.current?.writeln(`${PROMPT}${line}`);
            });

            term.current?.write(PROMPT);

            startRow.current = baseH + linesPrinted + 1;
            cursorPos.current = previousCursorPos.current = 0;
          });
          return;
        }
        default:
          if (key.length === 1) {
            // custom echo logic only, XTerm stdin disabled
            inputBuffer.current =
              inputBuffer.current.slice(0, cursorPos.current) +
              key +
              inputBuffer.current.slice(cursorPos.current);
            cursorPos.current++;
            const promptLength = PROMPT.length;
            const termWidth = terminalCols();
            const afterCursor = inputBuffer.current.slice(cursorPos.current);
            term.current?.write("\x1b[s");
            term.current?.write(key + afterCursor);
            const absoluteCursorPos = promptLength + cursorPos.current;
            const cursorRow =
              startRow.current + Math.floor(absoluteCursorPos / termWidth) + 1;
            const cursorCol = (absoluteCursorPos % termWidth) + 1;
            term.current?.write("\x1b[u");
            term.current?.write(`\x1b[${cursorRow};${cursorCol}H`);
            refreshCursor();
          }
          break;
      }
    });

    //to make the char after the bar show
    const refreshCursor = () => {
      if (!term.current) return;

      const promptLength = PROMPT.length;
      const termWidth = terminalCols();

      const absolutePrevPos = promptLength + previousCursorPos.current;
      const prevRow =
        startRow.current + Math.floor(absolutePrevPos / termWidth) + 1;
      const prevCol = (absolutePrevPos % termWidth) + 1;

      const absoluteCursorPos = promptLength + cursorPos.current;
      const cursorRow =
        startRow.current + Math.floor(absoluteCursorPos / termWidth) + 1;
      const cursorCol = (absoluteCursorPos % termWidth) + 1;

      // Save terminal cursor
      term.current.write("\x1b[s");

      // 1. Restore previous position (normal color)
      term.current.write(`\x1b[${prevRow};${prevCol}H`);
      const prevChar = inputBuffer.current[previousCursorPos.current] || " ";
      term.current.write("\x1b[27m"); // normal color
      term.current.write(prevChar);

      // 2. Move to new cursor position
      term.current.write(`\x1b[${cursorRow};${cursorCol}H`);
      const currChar = inputBuffer.current[cursorPos.current] || " ";
      term.current.write("\x1b[7m"); // inverted color
      term.current.write(currChar);
      term.current.write("\x1b[27m"); // back to normal after writing

      // 3. Restore terminal cursor (real position, for xterm)
      term.current.write("\x1b[u");

      // Finally, update previousCursorPos
      previousCursorPos.current = cursorPos.current;
    };

    const ro = new ResizeObserver(() => {
      // 1) recompute fits & reflow text
      fitAddon.current?.fit();
      // 2) re-anchor startRow to the current prompt line
      if (term.current) {
        startRow.current = term.current.buffer.active.cursorY;
      }
    });
    if (terminalRef.current) ro.observe(terminalRef.current);

    return () => {
      // dispose xterm instance and clear container to prevent duplicate terminals (e.g. React StrictMode remount)
      term.current?.dispose();
      term.current = null;
      if (terminalRef.current) {
        terminalRef.current.innerHTML = "";
      }
      ro.disconnect();

      hasWrittenInitialPrompt.current = false;
    };
  }, [isAuthenticated]);

  // Erases the old inverted-bar by redrawing its character in normal video
  function eraseCursorBar() {
    if (!term.current) return;
    const promptLength = PROMPT.length;
    const termWidth = terminalCols();

    // where the old bar was
    const absOld = promptLength + previousCursorPos.current;
    const rowOld = startRow.current + Math.floor(absOld / termWidth) + 1;
    const colOld = (absOld % termWidth) + 1; // terminals are 1-based

    // save cursor, jump there, write normal char, restore cursor
    term.current.write("\x1b[s");
    term.current.write(`\x1b[${rowOld};${colOld}H`);
    const under = inputBuffer.current[previousCursorPos.current] || " ";
    term.current.write("\x1b[27m" + under); // normal video
    term.current.write("\x1b[u");
  }

  function printLinesAndReanchor(lines: string[]) {
    const t = term.current!;
    const baseRow = t.buffer.active.cursorY;
    t.writeln("");

    eraseCursorBar();

    let rowsMoved = 0;
    for (const line of lines) {
      const visualLength = PROMPT.length + line.length;
      const wraps = Math.ceil(visualLength / terminalCols());
      // writeln() will move you down `wraps` lines for the wrapped text
      // AND 1 more line for the trailing "\r\n"
      rowsMoved += wraps + 1;
      t.writeln(`${PROMPT}${line}`);
    }

    // now draw the prompt (no newline, so nothing extra here)
    t.write(PROMPT);

    inputBuffer.current = "";

    // re-anchor startRow exactly to where that prompt lives:
    startRow.current = baseRow + rowsMoved;
    cursorPos.current = previousCursorPos.current = 0;
  }

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

  const handleRunClick = async () => {
    if (!isAuthenticated) {
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    if (!currentFile) return;
    const code = codeMap[currentFile]!;

    // Clear the terminal before running code
    term.current?.write("\x1b[3J");
    term.current?.clear();

    term.current?.writeln("🚀 Running code...");
    const out = await runCode(code);
    let linesPrinted = 0;
    out.split("\n").forEach((line) => {
      const visualLength = PROMPT.length + line.length;
      const wraps = Math.ceil(visualLength / terminalCols());
      linesPrinted += wraps > 0 ? wraps : 1;
      term.current?.writeln(`${PROMPT}${line}`);
    });

    term.current?.write(PROMPT);

    startRow.current = term.current!.buffer.active.cursorY + linesPrinted;
    cursorPos.current = previousCursorPos.current = 0;
  };

  const handleCompileClick = async () => {
    if (!isAuthenticated) {
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    if (!currentFile) return;

    term.current?.write("\x1b[3J");
    term.current?.clear();

    term.current?.writeln("🔍 Checking syntax...");
    const out = await compileCode(codeMap[currentFile]!);
    let linesPrinted = 0;
    out.split("\n").forEach((line) => {
      const visualLength = PROMPT.length + line.length;
      const wraps = Math.ceil(visualLength / terminalCols());
      linesPrinted += wraps > 0 ? wraps : 1;
      term.current?.writeln(`${PROMPT}${line}`);
    });

    term.current?.write(PROMPT);

    startRow.current = term.current!.buffer.active.cursorY + linesPrinted;
    cursorPos.current = previousCursorPos.current = 0;
  };

  const handleTestClick = async () => {
    if (!isAuthenticated) {
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    if (!currentFile) return;
    const code = codeMap[currentFile]!;

    // Clear the terminal before running code
    term.current?.write("\x1b[3J");
    term.current?.clear();

    term.current?.writeln("🧪 Running tests...");
    const out = await testCode(code, test);
    let linesPrinted = 0;
    out.split("\n").forEach((line) => {
      const visualLength = PROMPT.length + line.length;
      const wraps = Math.ceil(visualLength / terminalCols());
      linesPrinted += wraps > 0 ? wraps : 1;
      term.current?.writeln(`${PROMPT}${line}`);
    });

    term.current?.write(PROMPT);

    startRow.current = term.current!.buffer.active.cursorY + linesPrinted;
    cursorPos.current = previousCursorPos.current = 0;
  };

  const handleMouseDown = () => {
    isResizing.current = true;
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    e.preventDefault();
    // calculate percentage directly from cursor Y
    const newHeight = (e.clientY / window.innerHeight) * 88;
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
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column" }}
    >
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
            onClick={handleRunClick}
          />
          <FaCog
            className="icons-for-terminal"
            size="1.5vw"
            onClick={handleCompileClick}
          />
          <FaHourglassHalf
            className="icons-for-terminal"
            size="1.5vw"
            onClick={handleTestClick}
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
