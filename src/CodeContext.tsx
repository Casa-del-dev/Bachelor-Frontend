import _, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CodeContextType {
  currentFile: string;
  setCurrentFile: (filename: string) => void;
  code: string;
  setCode: (updatedCode: string) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  // Which problem is currently selected?
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";

  // We store the "last opened file" under `selectedFile_<problem>`.
  const selectedFileKey = `selectedFile_${selectedProblemName}`;

  // Initialize currentFile from localStorage; default to "README.md" if none.
  const [currentFile, setCurrentFile] = useState<string>(() => {
    return localStorage.getItem(selectedFileKey) || "Solution.py";
  });

  // Build the localStorage key for file content like `code_<problem>_<file>`.
  const buildCodeKey = (problem: string, file: string) =>
    `code_${problem}_${file}`;

  // Load the code for the current file from localStorage immediately.
  const [code, setCode] = useState<string>(() => {
    const codeKey = buildCodeKey(selectedProblemName, currentFile);
    return localStorage.getItem(codeKey) || "";
  });

  // If the user switches to a different file, load that file’s code from localStorage.
  useEffect(() => {
    const codeKey = buildCodeKey(selectedProblemName, currentFile);
    const storedCode = localStorage.getItem(codeKey) || "";
    setCode(storedCode);

    // Also save the "selectedFile" so we restore it on refresh.
    localStorage.setItem(selectedFileKey, currentFile);
  }, [currentFile, selectedProblemName]);

  // Whenever code changes, save it to localStorage under the correct key.
  useEffect(() => {
    const codeKey = buildCodeKey(selectedProblemName, currentFile);
    localStorage.setItem(codeKey, code);
  }, [code, currentFile, selectedProblemName]);

  return (
    <CodeContext.Provider
      value={{ currentFile, setCurrentFile, code, setCode }}
    >
      {children}
    </CodeContext.Provider>
  );
}

export function useCodeContext() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
}
