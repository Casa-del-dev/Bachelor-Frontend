// CodeContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the FileItem type.
export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

// The context interface holds the file tree along with other shared state.
export interface CodeContextType {
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, updatedCode: string) => void;
  test: string;
  currentFileName: string | null;
  fileTree: FileItem[];
  setFileTree: (files: FileItem[]) => void;
  problemId: string;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

// A default/fallback file tree.
const initialFiles: FileItem[] = [
  {
    id: 1,
    name: "src",
    type: "folder",
    children: [{ id: 2, name: "Solution.py", type: "file" }],
  },
  { id: 4, name: "Tests.py", type: "file" },
];

export function CodeProvider({ children }: { children: ReactNode }) {
  const selectedProblem =
    localStorage.getItem("selectedProblem") || "MyProblem";
  const problemId = selectedProblem;

  const [currentFile, setCurrentFile] = useState<number | null>(null);
  const [codeMap, setCodeMap] = useState<Record<number, string>>({});
  const [test, setTest] = useState<string>("");
  const [fileTree, setFileTree] = useState<FileItem[]>([]);

  // Helper to locate a file's name based on its id.
  function findFileNameById(tree: FileItem[], id: number): string | null {
    for (const item of tree) {
      if (item.id === id) return item.name;
      if (item.children) {
        const found = findFileNameById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const currentFileName =
    currentFile !== null
      ? findFileNameById(fileTree, currentFile) || null
      : "No File Selected";

  // Function to load data from the backend.
  async function loadFromBackend(pId: string): Promise<{
    tree: any;
    codeMap: Record<string, string>;
    currentFile: number | null;
  } | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;
      const res = await fetch(
        `https://bachelor-backend.erenhomburg.workers.dev/problem/v1/load?id=${encodeURIComponent(
          pId
        )}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Load failed:", err);
      return null;
    }
  }

  // Function to save data to the backend.
  async function saveToBackend(
    pId: string,
    fileItems: FileItem[],
    codeMap: Record<number, string>,
    currentFileId: number | null
  ) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No token found; not saving.");
        return;
      }
      const pseudoTree = {
        rootNode: {
          id: "root",
          name: "root",
          type: "folder" as const,
          children: fileItems,
        },
      };
      await fetch(
        "https://bachelor-backend.erenhomburg.workers.dev/problem/v1/save",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemId: pId,
            tree: pseudoTree,
            codeMap,
            currentFile: currentFileId,
          }),
        }
      );
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  // Load the data from the backend once when the CodeContext mounts.
  useEffect(() => {
    let mounted = true;
    async function init() {
      const data = await loadFromBackend(problemId);
      if (!mounted) return;

      if (data && data.tree && data.tree.rootNode) {
        const loadedFiles: FileItem[] = data.tree.rootNode.children || [];
        if (loadedFiles.length === 0) {
          // No files on the backend: use the fallback initialFiles.
          setFileTree(initialFiles);
          await saveToBackend(problemId, initialFiles, codeMap, currentFile);
        } else {
          setFileTree(loadedFiles);
        }
        if (data.codeMap) {
          const converted: Record<number, string> = {};
          for (const [key, val] of Object.entries(data.codeMap)) {
            converted[Number(key)] = val;
          }
          // Set the code for each file using the context function.
          Object.entries(converted).forEach(([fileId, codeValue]) => {
            setCodeForFileHandler(Number(fileId), codeValue);
          });
        }
        // If the backend provides a currentFile value, update our state.
        if (data.currentFile !== null) {
          setCurrentFile(data.currentFile);
        }
      } else {
        // If no data is returned, default to the initial files.
        setFileTree(initialFiles);
        await saveToBackend(problemId, initialFiles, {}, null);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [problemId]);

  // Helper to update the code map.
  const setCodeForFileHandler = (fileId: number, updatedCode: string) => {
    setCodeMap((prev) => {
      const updated = {
        ...prev,
        [fileId]: updatedCode,
      };

      // Optionally update the "test" state (example: use the last updated file's code)
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
      value={{
        currentFile,
        setCurrentFile,
        codeMap,
        setCodeForFile: setCodeForFileHandler,
        test,
        currentFileName,
        fileTree,
        setFileTree,
        problemId,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
}

// Custom hook to use our CodeContext.
export function useCodeContext() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
}
