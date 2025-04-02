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

  const [currentFile, setCurrentFile] = useState<number | null>(() => {
    const storedFileId = localStorage.getItem(selectedFileKey);
    return storedFileId ? parseInt(storedFileId, 10) : -1;
  });

  const buildCodeKey = (problem: string, fileId: number | null) =>
    fileId !== null ? `code_${problem}_${fileId}` : "";

  const [code, setCode] = useState<string>(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      return localStorage.getItem(codeKey) || "";
    }
    return "";
  });

  useEffect(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      const storedCode = localStorage.getItem(codeKey) || "";
      setCode(storedCode);
      localStorage.setItem(selectedFileKey, currentFile.toString());
    } else {
      localStorage.removeItem(selectedFileKey);
    }
  }, [currentFile, selectedProblemName, selectedFileKey]);

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
