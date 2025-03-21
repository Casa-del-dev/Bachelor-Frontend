import _, { useState, useEffect, useRef } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import { useCodeContext } from "../CodeContext";
import "./Project_files.css";

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

const Project_files = () => {
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "Default Problem";
  const selectedFileKey = `selectedFile_${selectedProblemName}`;
  const systemStorageKey = `sysSelectedSystemProblem_${selectedProblemName}`;

  const [files, setFiles] = useState<FileItem[]>(() => {
    const storedTree = localStorage.getItem(systemStorageKey);
    if (storedTree) {
      return JSON.parse(storedTree);
    } else {
      localStorage.setItem(systemStorageKey, JSON.stringify(initialFiles));
      return initialFiles;
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const { currentFile, setCurrentFile } = useCodeContext();

  // useRef for managing the click timer.
  const clickTimeout = useRef<number | null>(null);

  const updateFileTree = (newTree: FileItem[]) => {
    setFiles(newTree);
    localStorage.setItem(systemStorageKey, JSON.stringify(newTree));
  };

  const addItemToFolder = (
    tree: FileItem[],
    parentId: number,
    newItem: FileItem
  ): FileItem[] => {
    return tree.map((item: FileItem) => {
      if (item.id === parentId && item.type === "folder") {
        return { ...item, children: [...(item.children || []), newItem] };
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

  const addNewFile = (parentId: number | null = null) => {
    const fileName = prompt("Enter new file name (e.g., NewFile.js):");
    if (!fileName) return;
    const newFile: FileItem = { id: Date.now(), name: fileName, type: "file" };

    if (parentId === null) {
      const updatedFiles = [...files, newFile];
      updateFileTree(updatedFiles);
    } else {
      const updated = addItemToFolder(files, parentId, newFile);
      updateFileTree(updated);
    }
    // Auto-select the new file.
    setCurrentFile(newFile.id);
    localStorage.setItem(selectedFileKey, newFile.id.toString());
    window.location.reload();
  };

  const addNewFolder = (parentId: number | null = null) => {
    const folderName = prompt("Enter new folder name:");
    if (!folderName) return;
    const newFolder: FileItem = {
      id: Date.now(),
      name: folderName,
      type: "folder",
      children: [],
    };

    if (parentId === null) {
      updateFileTree([...files, newFolder]);
    } else {
      const updated = addItemToFolder(files, parentId, newFolder);
      updateFileTree(updated);
    }
  };

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

  const deleteItem = (itemId: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const updated = deleteFromTree(files, itemId);
    updateFileTree(updated);

    // Remove the file's code from localStorage.
    localStorage.removeItem(`code_${selectedProblemName}_${itemId}`);

    // If the deleted file is the currently selected file, clear the selection.
    if (itemId === currentFile) {
      localStorage.setItem(selectedFileKey, "-1");
      setCurrentFile(null);
      window.location.reload();
    }
  };

  // Helper function to find the parent folder of a given file id.
  const findParent = (tree: FileItem[], targetId: number): FileItem | null => {
    for (let item of tree) {
      if (
        item.children &&
        item.children.some((child) => child.id === targetId)
      ) {
        return item;
      }
      if (item.children) {
        const parent = findParent(item.children, targetId);
        if (parent) return parent;
      }
    }
    return null;
  };

  const handleRename = (itemId: number) => {
    if (!editText.trim()) return;

    // Determine the siblings (files in the same folder)
    const parent = findParent(files, itemId);
    const siblings = parent ? parent.children! : files;
    // If a sibling (other than the file being renamed) already has the new name, cancel the rename.
    if (siblings.some((item) => item.id !== itemId && item.name === editText)) {
      alert("File name already exists in the folder. Keeping the old name.");
      setEditingId(null);
      return;
    }

    const renameInTree = (tree: FileItem[]): FileItem[] => {
      return tree.map((item) => {
        if (item.id === itemId) {
          return { ...item, name: editText };
        }
        if (item.type === "folder" && item.children) {
          return { ...item, children: renameInTree(item.children) };
        }
        return item;
      });
    };
    updateFileTree(renameInTree(files));
    setEditingId(null);
    // If the renamed file is currently selected, force a page reload to update the display.
    if (itemId === currentFile) {
      window.location.reload();
    }
  };

  // Single click handler uses a timer to differentiate from a double-click.
  const handleFileClick = (item: FileItem) => {
    if (editingId !== null) return;
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }
    // Delay single-click action by 250ms.
    clickTimeout.current = window.setTimeout(() => {
      if (item.type === "file") {
        setCurrentFile(item.id);
        localStorage.setItem(selectedFileKey, item.id.toString());
        window.location.reload();
      }
      clickTimeout.current = null;
    }, 250);
  };

  // Double click cancels the single click timer.
  const handleDoubleClick = (item: FileItem) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
    setEditingId(item.id);
    setEditText(item.name);
  };

  const renderTree = (tree: FileItem[]) => {
    return (
      <ul>
        {tree.map((item) => (
          <li key={item.id}>
            <div
              className="file-item"
              onClick={() => handleFileClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
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
  };

  useEffect(() => {
    const storedTree = localStorage.getItem(systemStorageKey);
    if (storedTree) {
      setFiles(JSON.parse(storedTree));
    }
  }, [systemStorageKey]);

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

export default Project_files;
