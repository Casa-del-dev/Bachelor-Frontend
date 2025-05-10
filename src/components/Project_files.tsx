import React, { useState, useRef, JSX, useEffect, useMemo } from "react";
import "./Project_files.css";
import { useCodeContext } from "../CodeContext";
import { FolderOpen, Folder, Trash, File, FolderPlus } from "lucide-react";
import { useAuth } from "../AuthContext";

export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

interface InputProps {
  codeMap: Record<number, string | null>;
  setCodeForFile: (fileId: number, code: string | null) => void;
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  fileTree: FileItem[];
  setFileTree: any;
  openFolders: Record<number, boolean>;
  setOpenFolders: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

const ProjectFiles = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
  fileTree,
  setFileTree,
  openFolders,
  setOpenFolders,
}: InputProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const clickTimeout = useRef<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);

  const { saveTreeToBackend } = useCodeContext();

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setOpenFolders((prev) => {
      // Clone the previous state to preserve open/closed settings.
      const updated: Record<number, boolean> = { ...prev };

      // Always ensure the pseudo-root (id === -1) is open.
      updated[-1] = true;

      // Traverse the fileTree and for any folder that does not yet have an entry,
      // add it with a default value of true (open).
      const traverseFolders = (tree: FileItem[]) => {
        tree.forEach((item) => {
          if (item.type === "folder") {
            // Only add if this folder doesn't already have a state.
            if (updated[item.id] === undefined) {
              updated[item.id] = true;
            }
            if (item.children) {
              traverseFolders(item.children);
            }
          }
        });
      };
      traverseFolders(fileTree);

      return updated;
    });
  }, [fileTree]);

  // Toggle the open/closed state of a folder.
  function handleFolderClick(item: FileItem) {
    // For pseudo-root (id === -1) you can decide whether to allow collapsing;
    // here we simply toggle it as well.
    setOpenFolders((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  }

  // Always call saveTreeToBackend with the actual fileTree (without pseudo-root)
  function handleUpdateFiles(newFiles: FileItem[]) {
    setFileTree(newFiles);
    void saveTreeToBackend(newFiles);
  }

  // Rename functionality
  function handleRename(itemId: number) {
    const parent = findParent(fileTree, itemId);
    const siblings = parent ? parent.children! : fileTree;
    const targetItem = findItemById(fileTree, itemId);

    if (!targetItem) return;

    let newName = editText.trim();

    // If name is empty
    if (!newName) {
      if (targetItem.name) {
        setEditText(targetItem.name);
        setEditingId(null);
        return;
      } else {
        deleteItem(itemId, true);
        return;
      }
    }

    // Check if name is taken
    const isNameTaken = (name: string) =>
      siblings.some((i) => i.id !== itemId && i.name === name);

    if (isNameTaken(newName)) {
      let counter = 1;
      let baseName = newName;
      while (isNameTaken(`${baseName} (${counter})`)) {
        counter++;
      }
      newName = `${baseName} (${counter})`;
    }

    // Apply rename
    const renameInTree = (tree: FileItem[]): FileItem[] =>
      tree.map((item) => {
        if (item.id === itemId) {
          return { ...item, name: newName };
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
    setCurrentFile(file.id);
    if (file.type === "file") {
      if (!codeMap[file.id]) {
        setCodeForFile(file.id, "");
      }
    } else {
      setCodeForFile(file.id, null);
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
    if (parentId === -1) parentId = null;

    const newId = Date.now(); // temporary unique ID
    const newFile: FileItem = {
      id: newId,
      name: "",
      type: "file",
    };

    const updatedFiles =
      parentId === null
        ? (() => {
            const count = fileTree.length;
            // if empty, just add it
            if (count === 0) return [newFile];
            const allButLast = fileTree.slice(0, count - 1);
            const last = fileTree[count - 1];
            return [...allButLast, newFile, last];
          })()
        : addItemToFolder(fileTree, parentId, newFile);

    // Optimistically update the tree (don't wait for backend yet)
    handleUpdateFiles(updatedFiles);

    // Begin editing immediately
    setEditingId(newId);
    setEditText("");
    setCodeForFile(newId, "");
    setCurrentFile(newId);
  }

  function addNewFolder(parentId: number | null = null) {
    if (parentId === -1) parentId = null;

    const newId = Date.now();
    const newFolder: FileItem = {
      id: newId,
      name: "",
      type: "folder",
      children: [],
    };

    const updatedFiles =
      parentId === null
        ? (() => {
            const count = fileTree.length;
            // if empty, just add it
            if (count === 0) return [newFolder];
            const allButLast = fileTree.slice(0, count - 1);
            const last = fileTree[count - 1];
            return [...allButLast, newFolder, last];
          })()
        : addItemToFolder(fileTree, parentId, newFolder);

    handleUpdateFiles(updatedFiles);
    setEditingId(newId);
    setEditText("");
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

  function performDelete(itemId: number) {
    const itemToDelete = findItemById(fileTree, itemId);
    if (!itemToDelete) return;

    const idsToRemove = collectAllDescendantIds(itemToDelete);
    const updatedFiles = deleteFromTree(fileTree, itemId);

    if (currentFile !== null && idsToRemove.includes(currentFile)) {
      setCurrentFile(null);
      setCodeForFile(currentFile, "");
    }

    handleUpdateFiles(updatedFiles);
    setPendingDeleteId(null);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (pendingDeleteId !== null) {
        if (e.key === "Escape") {
          setPendingDeleteId(null);
        } else if (e.key === "Enter") {
          performDelete(pendingDeleteId);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pendingDeleteId]);

  function deleteItem(itemId: number, handleRename: boolean) {
    if (!handleRename) {
      setPendingDeleteId(itemId);
      return;
    }
    performDelete(itemId);
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
      handleSelectFile(item);
      clickTimeout.current = null;
    }, 250);
  }

  // Updated: handleFolderClick now simply toggles the folder’s open state.
  // (It’s been defined above; this is just used in JSX handlers.)
  // function handleFolderClick(item: FileItem) { ... }  // already defined above

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
      inputRef.current.style.width = "3ch"; // reset before measuring
      inputRef.current.style.width = inputRef.current.scrollWidth + "px";
    }
  }

  function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    ctx.font = font;
    return ctx.measureText(text).width;
  }

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
    const rawWidth = getTextWidth(
      editText || "                                             ",
      font
    );
    const buffer = 20;
    return rawWidth + buffer;
  }, [editText, font]);

  // Helper: Count all descendant items for a folder (recursively)
  function getTotalDescendantCount(item: FileItem): number {
    if (
      item.type === "file" ||
      !item.children ||
      item.children.length === 0 ||
      !openFolders[item.id]
    ) {
      return 0;
    }
    return (
      item.children.length +
      item.children.reduce(
        (sum, child) => sum + getTotalDescendantCount(child),
        0
      )
    );
  }

  function computeConnectorTop(item: FileItem): string {
    if (
      item.type !== "folder" ||
      !item.children ||
      item.children.length === 0 ||
      !openFolders[item.id]
    ) {
      return "50%";
    }
    const totalCount = getTotalDescendantCount(item);
    if (totalCount <= 0) {
      return "50%";
    }
    const value = Math.ceil((52 / (48 + 185 * totalCount)) * 100);
    return `${value.toFixed(2)}%`;
  }

  function renderTree(tree: FileItem[]): JSX.Element {
    return (
      <ul className="tree">
        {tree.map((item, index) => {
          // Determine if this item is the last child of the current level.
          const isLastChild = index === tree.length - 1;

          // Compute the connector top.
          // If this is the last child, is a folder and has children, use our formula.
          // Otherwise, if it is a file (or the folder is folded), use "50%".
          // Else, use your previous connector top calculation.
          let connectorTop: string;
          if (
            isLastChild &&
            item.type === "folder" &&
            item.children &&
            item.children.length > 0
          ) {
            connectorTop = computeConnectorTop(item);
          } else if (item.type === "file" || openFolders[item.id] === false) {
            connectorTop = "50%";
          } else {
            connectorTop = `${100 / (getVisualWeight(item) * 2)}%`;
          }

          const styleObj: React.CSSProperties = {
            "--connector-top": connectorTop,
          } as React.CSSProperties;

          // Determine CSS class (as in your original code).
          let liClass = "";
          if (item.id === -1) {
            liClass = "pseudo-root-li";
          } else if (item.type === "file") {
            liClass = "file-item";
          } else if (item.type === "folder") {
            liClass = "folder-item";
          }

          return (
            <li key={item.id} className={liClass} style={styleObj}>
              {item.id === -1 ? (
                <div
                  className="pseudo-root-header"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <div className="icon-and-title-left">
                    {item.type === "folder" &&
                      (openFolders[item.id] ? (
                        <FolderOpen
                          className="left folder-icon"
                          onClick={() => handleFolderClick(item)}
                        />
                      ) : (
                        <Folder
                          className="left folder-icon"
                          onClick={() => handleFolderClick(item)}
                        />
                      ))}
                    <div
                      className={`title-file-fileTree ${item.type} ${
                        item.id === currentFile ? "selected" : ""
                      }`}
                      onClick={() => handleFileClick(item)}
                      onDoubleClick={(e) => handleDoubleClick(e, item)}
                    >
                      {item.name}
                    </div>
                  </div>

                  <div
                    className="controls"
                    style={{
                      opacity:
                        hoveredItemId === item.id || item.id === currentFile
                          ? 1
                          : 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
                    <span
                      className="icon"
                      title="New File"
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewFile(item.id);
                      }}
                    >
                      <File className="all-icons-left" />
                    </span>
                    <span
                      className="icon"
                      title="New Folder"
                      onClick={(e) => {
                        e.stopPropagation();
                        addNewFolder(item.id);
                      }}
                    >
                      <FolderPlus className="all-icons-left" />
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="file-item"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  {editingId === item.id ? (
                    <span className={`${item.type} edit`}>
                      <div className="icon-and-title-left">
                        <div className="icon-and-title-left">
                          {item.type === "folder" &&
                            (openFolders[item.id] ? (
                              <FolderOpen
                                className="left folder-icon"
                                onClick={() => handleFolderClick(item)}
                              />
                            ) : (
                              <Folder
                                className="left folder-icon"
                                onClick={() => handleFolderClick(item)}
                              />
                            ))}
                          <input
                            ref={inputRef}
                            className="title-file-fileTree edit"
                            type="text"
                            value={editText}
                            placeholder="File name"
                            style={{ width: `${initialWidth}px` }}
                            onChange={(e) => {
                              setEditText(e.target.value);
                              autoResizeInput();
                            }}
                            onFocus={autoResizeInput}
                            onInput={autoResizeInput}
                            onBlur={() => handleRename(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRename(item.id);
                              } else if (e.key === "Escape") {
                                // Revert to previous name and exit editing
                                const original = findItemById(
                                  fileTree,
                                  item.id
                                );
                                if (original) setEditText(original.name);
                                setEditingId(null);
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      </div>
                    </span>
                  ) : (
                    <span className={`${item.type} prev`}>
                      <div className="icon-and-title-left">
                        <div className="icon-and-title-left">
                          {item.type === "folder" &&
                            (openFolders[item.id] ? (
                              <FolderOpen
                                className="left folder-icon"
                                onClick={() => handleFolderClick(item)}
                              />
                            ) : (
                              <Folder
                                className="left folder-icon"
                                onClick={() => handleFolderClick(item)}
                              />
                            ))}
                          <div
                            className={`title-file-fileTree ${item.type} ${
                              item.id === currentFile ? "selected" : ""
                            }`}
                            onClick={() => handleFileClick(item)}
                            onDoubleClick={(e) => handleDoubleClick(e, item)}
                          >
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </span>
                  )}
                  <div
                    className="controls"
                    style={{
                      opacity:
                        hoveredItemId === item.id || item.id === currentFile
                          ? 1
                          : 0,
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  >
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
                          <File className="all-icons-left" />
                        </span>
                        <span
                          className="icon"
                          title="New Folder"
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewFolder(item.id);
                          }}
                        >
                          <FolderPlus className="all-icons-left" />
                        </span>
                      </>
                    )}
                    <span
                      className="icon"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id, false);
                      }}
                    >
                      <Trash className="all-icons-left" />
                    </span>
                  </div>
                </div>
              )}
              {pendingDeleteId !== null && (
                <div
                  className="delete-overlay"
                  onClick={() => setPendingDeleteId(null)}
                >
                  <div
                    className="delete-dialog"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>Are you sure you want to delete this file?</p>
                    <button onClick={() => performDelete(pendingDeleteId)}>
                      Yes
                    </button>
                    <button onClick={() => setPendingDeleteId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {/*
                Only render children if this is a folder, it has children,
                and it is marked as open.
              */}
              {item.type === "folder" &&
                item.children &&
                openFolders[item.id] &&
                renderTree(item.children)}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="project-files">
      <div className="file-tree">
        {/*
    Wrap the fileTree with a pseudo-root node before rendering.
    This pseudo-root is only used for display; any actions using parentId = -1
    are treated as root (null) and removed before saving.
  */}
        {!isAuthenticated ? (
          <div className="blank-file-selector" />
        ) : (
          (() => {
            const count = fileTree.length;
            const allButLast = fileTree.slice(0, Math.max(0, count - 1));
            const lastChild = count > 0 ? fileTree[count - 1] : null;

            return (
              <>
                {/* 1) Render “Project Files” with everything except the last child */}
                {renderTree([
                  {
                    id: -1,
                    name: "Project Files",
                    type: "folder",
                    children: allButLast,
                  },
                ])}

                {/* 2) Render the true last child in its own div */}
                {lastChild && (
                  <div className="separate-last-child">
                    <div className="title-test-fileTree">Test File</div>
                    {renderTree([lastChild])}
                  </div>
                )}
              </>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default ProjectFiles;
