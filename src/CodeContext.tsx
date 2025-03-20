import _, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CodeContextType {
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  code: string;
  setCode: (updatedCode: string) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";
  const selectedFileKey = `selectedFile_${selectedProblemName}`;

  // Initialize currentFile from localStorage, parsed as a number.
  const [currentFile, setCurrentFile] = useState<number | null>(() => {
    const storedFileId = localStorage.getItem(selectedFileKey);
    return storedFileId ? parseInt(storedFileId, 10) : null;
  });

  const buildCodeKey = (problem: string, fileId: number | null) =>
    fileId !== null ? `code_${problem}_${fileId}` : "";

  // Load the initial code if a file is selected.
  const [code, setCode] = useState<string>(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      return localStorage.getItem(codeKey) || "";
    }
    return "";
  });

  // When the current file changes, load its code and persist the selected file.
  useEffect(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      const storedCode = localStorage.getItem(codeKey) || "";
      setCode(storedCode);
      localStorage.setItem(selectedFileKey, currentFile.toString());
    } else {
      // If currentFile is null, remove the selected file key.
      localStorage.removeItem(selectedFileKey);
    }
  }, [currentFile, selectedProblemName, selectedFileKey]);

  // Save code changes to localStorage if a file is selected.
  useEffect(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      localStorage.setItem(codeKey, code);
    }
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
