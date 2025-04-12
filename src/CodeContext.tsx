import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CodeContextType {
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, updatedCode: string) => void;
  test: string;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const problemId = "Problem 1";

  const [currentFile, setCurrentFile] = useState<number | null>(null);
  const [codeMap, setCodeMap] = useState<Record<number, string>>({});
  const [test, setTest] = useState<string>("");

  // Only load data from the backend.
  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No token found, cannot load from backend");
        return;
      }
      try {
        const res = await fetch(
          `https://bachelor-backend.erenhomburg.workers.dev/problem/v1/load?id=${encodeURIComponent(
            problemId
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          console.error("Backend load failed:", await res.text());
          return;
        }
        const data = await res.json();
        const converted: Record<number, string> = {};
        Object.entries(data.codeMap as Record<string, string>).forEach(
          ([k, v]) => {
            converted[parseInt(k, 10)] = v;
          }
        );
        setCodeMap(converted);

        const lastId = Object.keys(converted)
          .map(Number)
          .sort((a, b) => a - b)
          .slice(-1)[0];
        if (lastId !== undefined && converted[lastId]) {
          setTest(converted[lastId]);
        }

        if (data.test) {
          setTest(data.test);
        }
        // Only update currentFile if it hasn't been set yet.
        if (currentFile === null && data.currentFile !== null) {
          setCurrentFile(data.currentFile);
        }
      } catch (err) {
        console.error("Error loading from backend:", err);
      }
    }
    loadData();
  }, [problemId]);

  // NOTE: The auto-save effect that was writing a dummy tree has been removed.
  // Let ProjectFiles handle saving the tree.

  const setCodeForFile = (fileId: number, updatedCode: string) => {
    setCodeMap((prev) => {
      const updated = {
        ...prev,
        [fileId]: updatedCode,
      };

      // Find the last key based on numeric sort
      const lastId = Object.keys(updated)
        .map(Number)
        .sort((a, b) => a - b)
        .slice(-1)[0];

      if (lastId !== undefined && updated[lastId]) {
        setTest(updated[lastId]);
      }

      return updated;
    });
  };

  return (
    <CodeContext.Provider
      value={{ currentFile, setCurrentFile, codeMap, setCodeForFile, test }}
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
