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

const BACKEND = "https://bachelor-backend.erenhomburg.workers.dev";

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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  useEffect(() => {
    let mounted = true;

    async function init() {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      // 1) DEFAULT: try your existing loadFromBackend
      let data = null;
      try {
        data = await loadFromBackend(problemId);
      } catch (err) {
        console.error("Default load failed:", err);
      }
      if (!mounted) return;

      // Check if it’s a “meaningful” default save:
      const children = data?.tree?.rootNode?.children;
      const hasMeaningfulDefault =
        Array.isArray(children) &&
        !(children.length === 1 || children.length === 0);

      if (hasMeaningfulDefault) {
        // ✅ We have a real default‐saved problem
        setFileTree(children!);
        if (data!.codeMap) {
          const converted: Record<number, string> = {};
          for (const [k, v] of Object.entries(data!.codeMap)) {
            converted[Number(k)] = v;
          }
          Object.entries(converted).forEach(([fid, code]) =>
            setCodeForFileHandler(Number(fid), code)
          );
        }
        if (data!.currentFile != null) {
          setCurrentFile(data!.currentFile);
        }
        return;
      }

      // 2) CUSTOM: only if this problemId looks like a UUID
      if (UUID_RE.test(problemId)) {
        try {
          const customResp = await fetch(
            `${BACKEND}/customProblems/v1/${encodeURIComponent(problemId)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (customResp.ok) {
            const { defaultText, tests } = await customResp.json();
            if (!mounted) return;

            // two-file tree from custom
            setFileTree(initialFiles);
            setCodeMap({ 2: defaultText, 4: tests });
            setTest(tests);
            setCurrentFile(2);
            return;
          }
        } catch (err) {
          console.warn("Custom load failed:", err);
        }
      }

      // 3) FIRST‐EVER DEFAULT SEED: neither default nor custom existed
      const defaultFileCode = getDefaultFileCode(problemId);
      const defaultTestCode = getDefaultTestCode(problemId);
      const initialCodeMap: Record<number, string> = {
        2: defaultFileCode,
        4: defaultTestCode,
      };
      setFileTree(initialFiles);
      setCodeMap(initialCodeMap);
      setTest(defaultTestCode);
      setCurrentFile(2);

      // persist them so next time loadFromBackend has data
      try {
        await saveToBackend(problemId, initialFiles, initialCodeMap, 2);
      } catch (err) {
        console.error("Persist default save failed:", err);
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
