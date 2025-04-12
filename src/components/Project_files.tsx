import React, { useState, useEffect, useRef, JSX } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import "./Project_files.css";

interface InputProps {
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, code: string) => void;
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
}

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  {
    id: 1,
    name: "src",
    type: "folder",
    children: [{ id: 2, name: "Solution.py", type: "file" }],
  },
  { id: 4, name: "Tests.py", type: "file" },
];

const ProjectFiles = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
}: InputProps) => {
  const problemId = "Problem 1";
  const [files, setFiles] = useState<FileItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [dirty, setDirty] = useState(false);
  const clickTimeout = useRef<number | null>(null);

  // Debounced save effect – waits for 1000ms after changes settle
  useEffect(() => {
    if (dirty && currentFile !== null) {
      const timeout = setTimeout(() => {
        saveToBackend(problemId, files, codeMap, currentFile);
        setDirty(false);
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [dirty, files, codeMap, currentFile, problemId]);

  // Load files from the backend only once on mount.
  useEffect(() => {
    let mounted = true;
    async function init() {
      const data = await loadFromBackend(problemId);
      if (!mounted) return;

      if (data && data.tree && data.tree.rootNode) {
        const loadedFiles: FileItem[] = data.tree.rootNode.children || [];
        if (loadedFiles.length === 0) {
          setFiles(initialFiles);
          saveToBackend(problemId, initialFiles, codeMap, currentFile);
        } else {
          setFiles(loadedFiles);
        }
        if (data.codeMap) {
          const converted: Record<number, string> = {};
          for (const [key, val] of Object.entries(data.codeMap)) {
            converted[Number(key)] = val;
          }
          Object.entries(converted).forEach(([fileId, codeValue]) => {
            setCodeForFile(Number(fileId), codeValue);
          });
          if (currentFile === null && data.currentFile !== null) {
            setCurrentFile(data.currentFile);
          }
        }
      } else {
        setFiles(initialFiles);
        saveToBackend(problemId, initialFiles, {}, null);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [problemId]); // run only on mount

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

  function handleSelectFile(file: FileItem) {
    if (file.type === "file") {
      setCurrentFile(file.id);
      if (!codeMap[file.id]) {
        setCodeForFile(file.id, "");
      }
      saveToBackend(problemId, files, codeMap, file.id);
    }
  }

  function handleUpdateFiles(newFiles: FileItem[]) {
    setFiles(newFiles);
    saveToBackend(problemId, newFiles, codeMap, currentFile);
  }

  const addItemToFolder = (
    tree: FileItem[],
    parentId: number,
    newItem: FileItem
  ): FileItem[] => {
    return tree.map((item) => {
      if (item.id === parentId && item.type === "folder") {
        const children = item.children
          ? [...item.children, newItem]
          : [newItem];
        return { ...item, children };
      }
      if (item.type === "folder" && item.children) {
        return {
          ...item,
          children: addItemToFolder(item.children, parentId, newItem),
        };
      }
      return item;
    });
  };

  function addNewFile(parentId: number | null = null) {
    const fileName = prompt("Enter new file name (e.g., NewFile.js):");
    if (!fileName) return;
    const newFile: FileItem = {
      id: Date.now(),
      name: fileName,
      type: "file",
    };
    const updatedFiles =
      parentId === null
        ? [...files, newFile]
        : addItemToFolder(files, parentId, newFile);
    handleUpdateFiles(updatedFiles);
  }

  function addNewFolder(parentId: number | null = null) {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;
    const newFolder: FileItem = {
      id: Date.now(),
      name: folderName,
      type: "folder",
      children: [],
    };
    const updatedFiles =
      parentId === null
        ? [...files, newFolder]
        : addItemToFolder(files, parentId, newFolder);
    handleUpdateFiles(updatedFiles);
  }

  function collectAllDescendantIds(item: FileItem): number[] {
    if (item.type === "folder" && item.children) {
      return [item.id, ...item.children.flatMap(collectAllDescendantIds)];
    }
    return [item.id];
  }

  const deleteFromTree = (tree: FileItem[], itemId: number): FileItem[] => {
    return tree
      .filter((item) => item.id !== itemId)
      .map((item) => {
        if (item.type === "folder" && item.children) {
          return { ...item, children: deleteFromTree(item.children, itemId) };
        }
        return item;
      });
  };

  function deleteItem(itemId: number) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const itemToDelete = findItemById(files, itemId);
    if (!itemToDelete) return;
    const idsToRemove = collectAllDescendantIds(itemToDelete);
    const updatedFiles = deleteFromTree(files, itemId);
    if (currentFile !== null && idsToRemove.includes(currentFile)) {
      setCurrentFile(null);
      setCodeForFile(currentFile, "");
    }
    handleUpdateFiles(updatedFiles);
  }

  function findItemById(tree: FileItem[], targetId: number): FileItem | null {
    for (const item of tree) {
      if (item.id === targetId) return item;
      if (item.type === "folder" && item.children) {
        const found = findItemById(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  function findParent(tree: FileItem[], targetId: number): FileItem | null {
    for (let item of tree) {
      if (
        item.children &&
        item.children.some((child) => child.id === targetId)
      ) {
        return item;
      }
      if (item.type === "folder" && item.children) {
        const parent = findParent(item.children, targetId);
        if (parent) return parent;
      }
    }
    return null;
  }

  function handleRename(itemId: number) {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    const parent = findParent(files, itemId);
    const siblings = parent ? parent.children! : files;
    if (siblings.some((i) => i.id !== itemId && i.name === editText)) {
      alert("File name already exists in the folder. Keeping the old name.");
      setEditingId(null);
      return;
    }
    const renameInTree = (tree: FileItem[]): FileItem[] =>
      tree.map((item) => {
        if (item.id === itemId) {
          return { ...item, name: editText };
        }
        if (item.type === "folder" && item.children) {
          return { ...item, children: renameInTree(item.children) };
        }
        return item;
      });
    const updatedFiles = renameInTree(files);
    handleUpdateFiles(updatedFiles);
    setEditingId(null);
  }

  function handleFileClick(item: FileItem) {
    if (editingId !== null) return;
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    clickTimeout.current = window.setTimeout(() => {
      if (item.type === "file") {
        handleSelectFile(item);
      }
      clickTimeout.current = null;
    }, 250);
  }

  function handleDoubleClick(e: React.MouseEvent, item: FileItem) {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setEditingId(item.id);
    setEditText(item.name);
    e.stopPropagation();
  }

  function renderTree(tree: FileItem[]): JSX.Element {
    return (
      <ul>
        {tree.map((item) => (
          <li key={item.id}>
            <div
              className="file-item"
              onClick={() => handleFileClick(item)}
              onDoubleClick={(e) => handleDoubleClick(e, item)}
            >
              {editingId === item.id ? (
                <input
                  className="editing-stepTree"
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleRename(item.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename(item.id)}
                  autoFocus
                />
              ) : (
                <span className={item.type === "file" ? "file" : "folder"}>
                  {item.name}
                </span>
              )}
              <div className="controls">
                <span
                  className="icon"
                  title="Delete"
                  onClick={() => deleteItem(item.id)}
                >
                  <FaTrash />
                </span>
                {item.type === "folder" && (
                  <>
                    <span
                      className="icon"
                      title="New File"
                      onClick={() => addNewFile(item.id)}
                    >
                      <FaFileAlt />
                    </span>
                    <span
                      className="icon"
                      title="New Folder"
                      onClick={() => addNewFolder(item.id)}
                    >
                      <FaFolderPlus />
                    </span>
                  </>
                )}
              </div>
            </div>
            {item.type === "folder" &&
              item.children &&
              renderTree(item.children)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="project-files">
      <div className="head-projectsys-left-start">
        <div className="Title-text">Project Files</div>
        <div className="controls">
          <span
            className="icon"
            title="New File (root)"
            onClick={() => addNewFile(null)}
          >
            <FaFileAlt />
          </span>
          <span
            className="icon"
            title="New Folder (root)"
            onClick={() => addNewFolder(null)}
          >
            <FaFolderPlus />
          </span>
        </div>
      </div>
      <div className="file-tree">{renderTree(files)}</div>
    </div>
  );
};

export default ProjectFiles;
