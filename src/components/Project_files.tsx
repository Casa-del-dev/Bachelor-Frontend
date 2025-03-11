import _, { useState, useEffect } from "react";
import { FaTrash, FaFileAlt, FaFolderPlus } from "react-icons/fa";
import "./Project_files.css";

// Initial file structure example
const initialFiles: FileItem[] = [
  {
    id: 1,
    name: "src",
    type: "folder",
    children: [
      { id: 2, name: "Test.tsx", type: "file" },
      { id: 3, name: "App.jsx", type: "file" },
    ],
  },
  { id: 4, name: "README.md", type: "file" },
];

interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[]; // Only folders have children
}

const Project_files = () => {
  // Get the selected problem name from localStorage (stored as a plain string).
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "Default Problem";
  // Create a unique key for the system file tree for this problem.
  const systemStorageKey =
    "sys" + `selectedSystemProblem_${selectedProblemName}`;

  // Initialize the file tree state from localStorage using the systemStorageKey.
  // If not present, fall back to initialFiles.
  const [files, setFiles] = useState<FileItem[]>(() => {
    const storedTree = localStorage.getItem(systemStorageKey);
    return storedTree ? JSON.parse(storedTree) : initialFiles;
  });

  // When the file tree changes, update the state and save it to localStorage
  // using the system-specific key.
  const updateFileTree = (newTree: FileItem[]) => {
    setFiles(newTree);
    localStorage.setItem(systemStorageKey, JSON.stringify(newTree));
  };

  // Example function to handle file click.
  const handleFileClick = (item: FileItem) => {
    if (item.type === "file") {
      localStorage.setItem("selectedFile", item.name);
      console.log(`Selected file: ${item.name}`);
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

  // Recursively delete an item (file or folder) by id from the tree.
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

  // Rename an item on double click (using a prompt).
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

  // Ensure that if the selected problem changes externally, we update our file tree.
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
