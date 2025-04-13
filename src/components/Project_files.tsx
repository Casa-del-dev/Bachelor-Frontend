import React, { useState, useRef, JSX } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import "./Project_files.css";

export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface InputProps {
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, code: string) => void;
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  fileTree: FileItem[]; // now passed from context
  setFileTree: (files: FileItem[]) => void;
  problemId: string;
}

const ProjectFiles = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
  fileTree,
  setFileTree,
  problemId,
}: InputProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const clickTimeout = useRef<number | null>(null);

  // Inside your ProjectFiles component:

  // Function to save updated file tree to the backend.
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

  // Updated handleUpdateFiles that persists changes:
  function handleUpdateFiles(newFiles: FileItem[]) {
    setFileTree(newFiles);
    saveToBackend(problemId, newFiles, codeMap, currentFile);
  }

  // Inside your rename function, you call handleUpdateFiles(updatedFiles)
  // so after renaming, the new tree is sent to the backend.
  function handleRename(itemId: number) {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    const parent = findParent(fileTree, itemId);
    const siblings = parent ? parent.children! : fileTree;
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
    const updatedFiles = renameInTree(fileTree);
    handleUpdateFiles(updatedFiles);
    setEditingId(null);
  }

  function handleSelectFile(file: FileItem) {
    if (file.type === "file") {
      setCurrentFile(file.id);
      if (!codeMap[file.id]) {
        setCodeForFile(file.id, "");
      }
    }
  }

  // Utility to add an item to a folder in the tree.
  function addItemToFolder(
    tree: FileItem[],
    parentId: number,
    newItem: FileItem
  ): FileItem[] {
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
  }

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
        ? [...fileTree, newFile]
        : addItemToFolder(fileTree, parentId, newFile);
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
        ? [...fileTree, newFolder]
        : addItemToFolder(fileTree, parentId, newFolder);
    handleUpdateFiles(updatedFiles);
  }

  // Example delete helper functions:
  function collectAllDescendantIds(item: FileItem): number[] {
    if (item.type === "folder" && item.children) {
      return [item.id, ...item.children.flatMap(collectAllDescendantIds)];
    }
    return [item.id];
  }

  function deleteFromTree(tree: FileItem[], itemId: number): FileItem[] {
    return tree
      .filter((item) => item.id !== itemId)
      .map((item) => {
        if (item.type === "folder" && item.children) {
          return { ...item, children: deleteFromTree(item.children, itemId) };
        }
        return item;
      });
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

  function deleteItem(itemId: number) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const itemToDelete = findItemById(fileTree, itemId);
    if (!itemToDelete) return;
    const idsToRemove = collectAllDescendantIds(itemToDelete);
    const updatedFiles = deleteFromTree(fileTree, itemId);

    if (currentFile !== null && idsToRemove.includes(currentFile)) {
      setCurrentFile(null);
      setCodeForFile(currentFile, "");
    }
    handleUpdateFiles(updatedFiles);
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
      <div className="file-tree">{renderTree(fileTree)}</div>
    </div>
  );
};

export default ProjectFiles;
