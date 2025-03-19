import _, { useState, useEffect } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import { useCodeContext } from "../CodeContext"; // <-- import context here
import "./Project_files.css";

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

// Initial file structure example
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

  const systemStorageKey =
    "sys" + `selectedSystemProblem_${selectedProblemName}`;

  const [files, setFiles] = useState<FileItem[]>(() => {
    const storedTree = localStorage.getItem(systemStorageKey);
    return storedTree ? JSON.parse(storedTree) : initialFiles;
  });

  // Get setCurrentFile from our CodeContext.
  const { setCurrentFile } = useCodeContext();

  // When the file tree changes, update both state and localStorage.
  const updateFileTree = (newTree: FileItem[]) => {
    setFiles(newTree);
    localStorage.setItem(systemStorageKey, JSON.stringify(newTree));
  };

  // When a file is clicked, update the CodeContext with its name.
  const handleFileClick = (item: FileItem) => {
    if (item.type === "file") {
      setCurrentFile(item.name);
      console.log(`Selected file: ${item.name}`);
      window.location.reload();
    }
  };

  // Recursively add a new item (file/folder) to a folder by id.
  const addItemToFolder = (
    tree: FileItem[],
    parentId: number,
    newItem: FileItem
  ): FileItem[] => {
    return tree.map((item: FileItem) => {
      if (item.id === parentId && item.type === "folder") {
        return {
          ...item,
          children: [...(item.children || []), newItem],
        };
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

  // Create a new file at root or inside a folder.
  const addNewFile = (parentId: number | null = null) => {
    const fileName = prompt("Enter new file name (e.g., NewFile.js):");
    if (!fileName) return;

    const newFile: FileItem = { id: Date.now(), name: fileName, type: "file" };

    if (parentId === null) {
      updateFileTree([...files, newFile]);
    } else {
      const updated = addItemToFolder(files, parentId, newFile);
      updateFileTree(updated);
    }
  };

  // Create a new folder at root or inside a folder.
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

  // Recursively delete an item by id.
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

  // Delete an item after confirmation.
  const deleteItem = (itemId: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const updated = deleteFromTree(files, itemId);
    updateFileTree(updated);
  };

  // Recursively rename an item in the tree.
  const renameInTree = (
    tree: FileItem[],
    itemId: number,
    newName: string
  ): FileItem[] => {
    return tree.map((item) => {
      if (item.id === itemId) {
        return { ...item, name: newName };
      }
      if (item.type === "folder" && item.children) {
        return {
          ...item,
          children: renameInTree(item.children, itemId, newName),
        };
      }
      return item;
    });
  };

  // Rename an item on double click.
  const renameItem = (itemId: number) => {
    const newName = prompt("Enter the new name:");
    if (!newName) return;
    const updated = renameInTree(files, itemId, newName);
    updateFileTree(updated);
  };

  // Recursively render the file/folder tree.
  const renderTree = (tree: FileItem[]) => {
    return (
      <ul>
        {tree.map((item) => (
          <li key={item.id}>
            <div className="file-item">
              <span
                className={item.type === "file" ? "file" : "folder"}
                onClick={() => item.type === "file" && handleFileClick(item)}
                onDoubleClick={() => renameItem(item.id)}
              >
                {item.name}
              </span>
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

  // Update file tree if the selected problem changes.
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
