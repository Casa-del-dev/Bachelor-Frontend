// CodeContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import getDefaultTestCode from "./components/BuildingBlocks/TestFile";
import getDefaultFileCode from "./components/BuildingBlocks/SolutionFile";

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
  codeMap: Record<number, string | null>;
  setCodeForFile: (fileId: number, updatedCode: string | null) => void;
  test: string;
  currentFileName: string | null;
  fileTree: FileItem[];
  setFileTree: (files: FileItem[]) => void;
  problemId: string;
  setProblemId: (newId: string) => void;
  saveTreeToBackend: (tree: FileItem[]) => void;
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
  const [problemId, setProblemId] = useState(
    localStorage.getItem("selectedProblem") || "Problem 1"
  );

  const [currentFile, setCurrentFile] = useState<number | null>(null);
  const [codeMap, setCodeMap] = useState<Record<number, string | null>>({});

  const [test, setTest] = useState<string>("");
  const [fileTree, setFileTree] = useState<FileItem[]>([]);

  const { isAuthenticated } = useAuth();

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
    currentFile !== null && currentFile !== undefined
      ? currentFile === -1
        ? "Project Files"
        : findFileNameById(fileTree, currentFile) || null
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
          const defaultFileCode = getDefaultFileCode(problemId);
          const defaultTestCode = getDefaultTestCode(problemId);
          const initialCodeMap: Record<number, string> = {
            2: defaultFileCode,
            4: defaultTestCode,
          };

          setFileTree(initialFiles);
          setCodeMap(initialCodeMap);
          setTest(defaultTestCode);

          await saveToBackend(problemId, initialFiles, initialCodeMap, null);
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
  }, [problemId, isAuthenticated]);

  // Helper to update the code map.
  const setCodeForFileHandler = (
    fileId: number,
    updatedCode: string | null
  ) => {
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

  function collectAllFileIds(tree: FileItem[]): string[] {
    const ids: string[] = [];
    for (const item of tree) {
      ids.push(item.id.toString());
      if (item.children) {
        ids.push(...collectAllFileIds(item.children));
      }
    }
    return ids;
  }

  async function saveTreeToBackend(newTree: FileItem[]): Promise<void> {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Collect file IDs from existing tree and new tree.
    const currentIds = collectAllFileIds(fileTree);
    const newIds = collectAllFileIds(newTree);
    const deletedIds = currentIds.filter((id) => !newIds.includes(id));

    // Merge codeMap: For every file in newTree that’s not in codeMap, add an empty string.
    const mergedCodeMap: Record<number, string | null> = { ...codeMap };
    newIds.forEach((idStr) => {
      const id = Number(idStr);
      if (!(id in mergedCodeMap)) {
        mergedCodeMap[id] = "";
      }
    });

    // Build the tree object (pseudoTree) that the backend expects.
    const treeToSubmit = {
      rootNode: {
        id: "root",
        name: "root",
        type: "folder" as const,
        children: newTree,
      },
    };

    // Send the save request along with deleted files, if any.
    try {
      await fetch(
        "https://bachelor-backend.erenhomburg.workers.dev/problem/v1/save",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemId,
            tree: treeToSubmit,
            codeMap: Object.fromEntries(
              Object.entries(mergedCodeMap).map(([key, value]) => [key, value])
            ),
            deletedFiles: deletedIds, // expect an array of string IDs
            currentFile,
          }),
        }
      );
      // (Optionally) update codeMap state here if you want to force it.
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

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
        setProblemId,
        saveTreeToBackend,
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
