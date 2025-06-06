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

    term.current?.onKey(({ domEvent }) => {
      const key = domEvent.key;
      const isCtrl = domEvent.ctrlKey || domEvent.metaKey;

      switch (key) {
        case "Backspace":
          if (isCtrl) {
            if (cursorPos.current === 0) {
              term.current?.write("\x07"); // bell
              break;
            }

            eraseCursorBar();

            const oldPos = cursorPos.current;
            let newPos = oldPos;

            // STEP 1: Skip whitespace
            while (
              newPos > 0 &&
              /\s/.test(inputBuffer.current.charAt(newPos - 1))
            ) {
              newPos--;
            }

            // STEP 2: If punctuation comes before, skip it too (like --__ etc)
            while (
              newPos > 0 &&
              /[^\w\s]/.test(inputBuffer.current.charAt(newPos - 1))
            ) {
              newPos--;
            }

            // STEP 3: Now skip actual word characters
            while (
              newPos > 0 &&
              /\w/.test(inputBuffer.current.charAt(newPos - 1))
            ) {
              newPos--;
            }

            inputBuffer.current =
              inputBuffer.current.slice(0, newPos) +
              inputBuffer.current.slice(oldPos);
            cursorPos.current = newPos;

            const promptRow = startRow.current + 1;
            term.current?.write(`\x1b[${promptRow};1H\x1b[J`);
            term.current?.write(PROMPT + inputBuffer.current);

            previousCursorPos.current = oldPos;
            refreshCursor();
          } else {
            // Single-character Backspace
            if (cursorPos.current > 0) {
              inputBuffer.current =
                inputBuffer.current.slice(0, cursorPos.current - 1) +
                inputBuffer.current.slice(cursorPos.current);
              cursorPos.current--;

              const promptLength = PROMPT.length;
              const termWidth = terminalCols();
              const col = (promptLength + cursorPos.current) % termWidth;

              if (col === termWidth - 1) {
                term.current?.write("\x1b[A");
                term.current?.write(`\x1b[${termWidth}G`);
              } else {
                term.current?.write("\x1b[D");
              }

              term.current?.write("\x1b[s"); // save

              const afterCursor = inputBuffer.current.slice(cursorPos.current);
              term.current?.write(afterCursor + " ");

              term.current?.write("\x1b[u"); // restore

              refreshCursor();
            } else {
              term.current?.write("\x07");
            }
          }
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
            term.current?.write("\x1b[3J");
            term.current?.clear();
            printLinesAndReanchor(["⚠️ Please log in first."]);
            return;
          }

          // 1) Erase the inverted‐bar before we move to a new line
          eraseCursorBar();

          // 2) Move down one line (so user sees their own input line)
          term.current?.write("\r\n");

          // 3) Capture exactly what was typed (don’t trim internal spaces; only remove leading/trailing)
          const snippet = inputBuffer.current.trim();

          // 4) Clear buffer and reset cursor positions immediately
          inputBuffer.current = "";
          cursorPos.current = 0;
          previousCursorPos.current = 0;

          // 5) If user just pressed Enter on an empty line, emit a blank prompt and return
          if (!snippet) {
            term.current?.writeln(PROMPT);
            term.current?.write(PROMPT);
            startRow.current = term.current!.buffer.active.cursorY + 1;
            return;
          }

          // 6) Otherwise, run the snippet and display its output
          const baseRow = term.current!.buffer.active.cursorY;
          runCode(snippet).then((output) => {
            // Split on newline, print each non-empty line
            const lines = output.split("\n");
            let linesPrinted = 0;
            for (const line of lines) {
              if (line.trim() === "") continue;
              term.current?.writeln(`${PROMPT}${line}`);
              linesPrinted++;
            }

            // 7) Now show a fresh prompt on the next line
            term.current?.write(PROMPT);
            startRow.current = baseRow + linesPrinted + 1;
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

  function collectIdsFromTree(node: any): string[] {
    // If this node has a `rootNode` wrapper, dive in:
    if (node.rootNode) {
      return collectIdsFromTree(node.rootNode.children);
    }

    // If this is an array of items, flatten each child:
    if (Array.isArray(node)) {
      return node.flatMap((item) => collectIdsFromTree(item));
    }

    // Otherwise it’s a single FileItem:
    const ids = [String(node.id)];
    if (node.children && node.children.length > 0) {
      ids.push(...collectIdsFromTree(node.children));
    }
    return ids;
  }

  const handleRunClick = async () => {
    if (!isAuthenticated) {
      term.current?.write("\x1b[3J");
      term.current?.clear();
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    console.log(codeMap);

    const validIds = collectIdsFromTree(fileTree);

    const runnableFiles = Object.entries(codeMap).filter(
      ([id, code]) => code != null && validIds.includes(id) && id !== "4"
    );

    // Clear the terminal before running code
    term.current?.write("\x1b[3J");
    term.current?.clear();

    term.current?.writeln("Running code...");

    let linesPrinted = 0;

    for (const [fileId, code] of runnableFiles) {
      if (fileId === "4" || code == null) continue;

      try {
        const out = await runCode(code as string);
        const lines = out.split("\n");

        lines.forEach((line: string) => {
          if (line.trim() !== "") {
            term.current?.writeln(`${PROMPT}${line}`);
            linesPrinted++;
          }
        });
      } catch (e: any) {
        const errorMsg = e.message ?? e.toString();
        errorMsg.split("\n").forEach((line: string) => {
          term.current?.writeln(`${PROMPT}${line}`);
        });
      }
    }

    term.current?.write(PROMPT);

    startRow.current = term.current!.buffer.active.cursorY + linesPrinted;
    cursorPos.current = previousCursorPos.current = 0;
  };

  const handleCompileClick = async () => {
    if (!isAuthenticated) {
      term.current?.write("\x1b[3J");
      term.current?.clear();
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    const validIds = collectIdsFromTree(fileTree);

    const allFiles = Object.entries(codeMap).filter(
      ([fileId, code]) =>
        code != null && validIds.includes(fileId) && fileId !== "4"
    );

    if (allFiles.length === 0) {
      term.current?.write("\x1b[3J");
      term.current?.clear();
      printLinesAndReanchor(["⚠️ No files to compile."]);
      return;
    }

    term.current?.write("\x1b[3J");
    term.current?.clear();

    let linesPrinted = 0;

    let allSucceeded = true;

    for (const [_, code] of allFiles) {
      try {
        const out = await compileCode(code as string);
        if (out.startsWith("❌")) {
          out.split("\n").forEach((line: string) => {
            term.current?.writeln(`${PROMPT}${line}`);
            linesPrinted++;
          });
          allSucceeded = false;
          break;
        }
      } catch (e: any) {
        const errorMsg = e.message ?? e.toString();
        errorMsg.split("\n").forEach((line: string) => {
          term.current?.writeln(`${PROMPT}${line}`);
          linesPrinted++;
        });
        allSucceeded = false;
        break;
      }
    }

    if (allSucceeded) {
      term.current?.writeln(`✓ Code compiles without errors.`);
      linesPrinted++;
    }

    term.current?.write(PROMPT);
    startRow.current = term.current!.buffer.active.cursorY + linesPrinted;
    cursorPos.current = previousCursorPos.current = 0;
  };

  const handleTestClick = async () => {
    if (!isAuthenticated) {
      term.current?.write("\x1b[3J");
      term.current?.clear();
      printLinesAndReanchor(["⚠️ Please log in first."]);
      return;
    }

    const validIds = collectIdsFromTree(fileTree);

    const allSources = Object.entries(codeMap)
      .filter(([fileId, code]) => code != null && validIds.includes(fileId))
      .map(([_, code]) => code as string);

    // Clear the terminal
    term.current?.write("\x1b[3J");
    term.current?.clear();
    term.current?.writeln("🧪 Running tests…");

    let linesPrinted = 0;
    // Pass the array of all file‐texts plus the single 'test' string:
    const out = await testCode(allSources, test);

    // Print each nonempty line exactly once:
    out
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .forEach((line: string) => {
        term.current?.writeln(`${PROMPT}${line}`);
        linesPrinted++;
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
    const newHeight = (e.clientY / window.outerHeight) * 100;
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
