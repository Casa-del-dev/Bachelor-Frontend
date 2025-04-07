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
  test: string;
  setCode: (updatedCode: string) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "DefaultProblem";
  const selectedFileKey = `selectedFile_${selectedProblemName}`;

  const [currentFile, setCurrentFile] = useState<number | null>(() => {
    const storedFileId = localStorage.getItem(selectedFileKey);
    return storedFileId ? parseInt(storedFileId, 10) : null;
  });

  const buildCodeKey = (problem: string, fileId: number | null) =>
    fileId !== null ? `code_${problem}_${fileId}` : "";

  const [code, setCode] = useState<string>(() => {
    if (currentFile !== null) {
      const codeKey = buildCodeKey(selectedProblemName, currentFile);
      console.log(codeKey);
      return localStorage.getItem(codeKey) || "";
    }
    return "";
  });

  const [test, setTest] = useState<string>("");

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

  useEffect(() => {
    const structureKey = `sysSelectedSystemProblem_${selectedProblemName}`;
    const storedStructure = localStorage.getItem(structureKey);
    if (!storedStructure) {
      // Nothing is stored under that key, so we can’t load a "last file"
      setTest("");
      return;
    }

    try {
      // Parse the structure array.
      // Example: [{"id":1,"name":"src","type":"folder","children":[...]},{"id":4,"name":"Test.py","type":"file"}]
      const structure = JSON.parse(storedStructure);

      // We'll collect all "file" items here.
      const allFiles: { id: number; name: string; type: string }[] = [];

      // Helper function to traverse folders recursively.
      function visit(items: any[]) {
        items.forEach((item) => {
          if (item.type === "file") {
            allFiles.push(item);
          } else if (item.type === "folder" && Array.isArray(item.children)) {
            visit(item.children);
          }
        });
      }

      // Start traversal
      visit(structure);

      // The user wants the *last file*, so let's get the last entry from allFiles.
      if (allFiles.length > 0) {
        const lastFile = allFiles[allFiles.length - 1];
        const lastFileId = lastFile.id;
        const lastFileKey = buildCodeKey(selectedProblemName, lastFileId);
        const testCode = localStorage.getItem(lastFileKey) || "";
        setTest(testCode);
      } else {
        // No files in the entire structure
        setTest("");
      }
    } catch (err) {
      console.error("Failed to parse structure JSON:", err);
      setTest("");
    }
  }, [selectedProblemName]);

  return (
    <CodeContext.Provider
      value={{ currentFile, setCurrentFile, code, setCode, test }}
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
