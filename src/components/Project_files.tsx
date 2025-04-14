import React, { useState, useRef, JSX, useEffect, useMemo } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import "./Project_files.css";
import { useCodeContext } from "../CodeContext";
import { Folder } from "lucide-react";

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
  fileTree: FileItem[];
}

const ProjectFiles = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
  fileTree,
}: InputProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const clickTimeout = useRef<number | null>(null);

  const { saveTreeToBackend } = useCodeContext();

  // Always call saveTreeToBackend with the actual fileTree (without pseudo-root)
  async function handleUpdateFiles(newFiles: FileItem[]) {
    await saveTreeToBackend(newFiles);
  }

  // Rename functionality
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

  // Utility: add an item into a folder (or at root if parentId is null)
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

  async function addNewFile(parentId: number | null = null) {
    const fileName = prompt("Enter new file name (e.g., NewFile.js):");
    if (!fileName) return;

    // If parent is our pseudo-root (id === -1), treat as root (null)
    if (parentId === -1) parentId = null;

    const newId = Date.now();
    const newFile: FileItem = {
      id: newId,
      name: fileName,
      type: "file",
    };

    const updatedFiles =
      parentId === null
        ? [...fileTree, newFile]
        : addItemToFolder(fileTree, parentId, newFile);

    setCodeForFile(newId, "");
    await handleUpdateFiles(updatedFiles);
    setCurrentFile(newId);
  }

  function addNewFolder(parentId: number | null = null) {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;

    // If parent is our pseudo-root, treat as root.
    if (parentId === -1) parentId = null;

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

  // Delete helper functions
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

  function getVisualWeight(item: FileItem): number {
    if (item.type === "file") return 1;
    if (!item.children || item.children.length === 0) return 1;

    return (
      1 + item.children.reduce((sum, child) => sum + getVisualWeight(child), 0)
    );
  }

  const inputRef = useRef<HTMLInputElement>(null);

  function autoResizeInput() {
    if (inputRef.current) {
      inputRef.current.style.width = "1ch"; // reset before measuring
      inputRef.current.style.width = inputRef.current.scrollWidth + "px"; // grow to content
    }
  }

  function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = font;
    return ctx.measureText(text).width;
  }

  // Run resize on mount + when editText changes
  useEffect(() => {
    autoResizeInput();
  }, [editText]);

  useEffect(() => {
    if (editingId !== null) {
      const item = findItemById(fileTree, editingId);
      if (item) setEditText(item.name);

      requestAnimationFrame(() => {
        autoResizeInput();
      });
    }
  }, [editingId]);

  // Memoized font string and width calculation
  const fontSize = getComputedStyle(document.documentElement)
    .getPropertyValue("--step-font-size")
    .trim();

  const font = `${parseFloat(fontSize) * 1.2}px Inter, sans-serif`;

  const initialWidth = useMemo(() => {
    const rawWidth = getTextWidth(editText || " ", font);
    const buffer = 20;
    return rawWidth + buffer;
  }, [editText, font]);

  // Render the tree recursively.
  // If the node is our pseudo-root (id -1), render a custom header without controls.
  function renderTree(tree: FileItem[]): JSX.Element {
    return (
      <ul className="tree">
        {tree.map((item) => (
          <li
            key={item.id}
            className={
              item.id === -1
                ? "pseudo-root-li"
                : item.type === "file"
                ? "file-item"
                : "folder-item"
            }
            style={
              {
                "--connector-top":
                  item.type === "file"
                    ? "50%"
                    : `${100 / (getVisualWeight(item) * 2)}%`,
              } as React.CSSProperties
            }
          >
            {item.id === -1 ? (
              <div className="pseudo-root-header">
                <Folder className="left folder-icon" />
                <span className="title-fileTree" style={{ fontWeight: "bold" }}>
                  {item.name}
                </span>
              </div>
            ) : (
              <div className="file-item">
                {editingId === item.id ? (
                  <span
                    className={
                      item.type === "file" ? "file edit" : "folder edit"
                    }
                    onClick={() => handleFileClick(item)}
                    onDoubleClick={(e) => handleDoubleClick(e, item)}
                  >
                    <div className="icon-and-title-left">
                      {item.type === "folder" && (
                        <Folder className="left folder-icon" />
                      )}
                      <input
                        ref={inputRef}
                        className="title-file-fileTree edit"
                        type="text"
                        value={editText}
                        style={{ width: `${initialWidth}px` }}
                        onChange={(e) => {
                          setEditText(e.target.value);
                          autoResizeInput();
                        }}
                        onFocus={autoResizeInput}
                        onInput={autoResizeInput}
                        onBlur={() => handleRename(item.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleRename(item.id)
                        }
                        autoFocus
                      />
                    </div>
                  </span>
                ) : (
                  <span
                    className={item.type === "file" ? "file" : "folder"}
                    onClick={() => handleFileClick(item)}
                    onDoubleClick={(e) => handleDoubleClick(e, item)}
                  >
                    <div className="icon-and-title-left">
                      {item.type === "folder" && (
                        <Folder className="left folder-icon" />
                      )}
                      <div className="title-file-fileTree">{item.name}</div>
                    </div>
                  </span>
                )}
                {item.id !== -1 && (
                  <div className="controls">
                    <span
                      className="icon"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                    >
                      <FaTrash />
                    </span>
                    {item.type === "folder" && (
                      <>
                        <span
                          className="icon"
                          title="New File"
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewFile(item.id);
                          }}
                        >
                          <FaFileAlt />
                        </span>
                        <span
                          className="icon"
                          title="New Folder"
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewFolder(item.id);
                          }}
                        >
                          <FaFolderPlus />
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
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
      <div className="file-tree">
        {/* Wrap the fileTree with a pseudo-root node before rendering.
            This pseudo-root is only used for display; any actions using parentId = -1 are treated as root (null)
            and it is removed before saving to the backend. */}
        {renderTree([
          { id: -1, name: "Project Files", type: "folder", children: fileTree },
        ])}
      </div>
    </div>
  );
};

export default ProjectFiles;
