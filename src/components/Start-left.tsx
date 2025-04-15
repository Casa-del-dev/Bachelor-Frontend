import { useState, useEffect, useRef } from "react";
import "./Problem_detail";
import "./Start-left.css";
import Project_files from "./Project_files";
import { problemDetailsMap } from "./Problem_detail";
import { HiMenu, HiX } from "react-icons/hi";

interface StartLeftInput {
  codeMap: Record<number, string | null>;
  setCodeForFile: (fileId: number, code: string | null) => void;
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  fileTree: any;
}

const StartLeft = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
  fileTree,
}: StartLeftInput) => {
  // Retrieve the last selected section from localStorage (default is "Problem")
  const storedSection = localStorage.getItem("selectedSection") as
    | "Project"
    | "Problem"
    | "Blocks"
    | null;
  const [selectedSection, setSelectedSection] = useState<
    "Project" | "Problem" | "Blocks"
  >(storedSection || "Problem");

  const [menuOpen, setMenuOpen] = useState(false);
  const problemDropdownRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>("Project");

  // Retrieve the last selected problem from localStorage
  const storedProblem = localStorage.getItem("selectedProblem");
  const details = storedProblem
    ? problemDetailsMap[storedProblem]?.trim()
    : null;
  const problemKeys = Object.keys(problemDetailsMap);

  // Persist the selected section in localStorage
  const selectSection = (section: "Project" | "Problem" | "Blocks") => {
    setSelectedSection(section);
    localStorage.setItem("selectedSection", section);
  };

  // Change problem without a full reload
  const handleProblemSelect = (problemKey: string) => {
    localStorage.setItem("selectedProblem", problemKey);
    setMenuOpen(false);
    window.location.reload(); // Alternatively, update your state to avoid reload
  };

  const handleHamburgerClick = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!problemDropdownRef.current || !(event.target instanceof Node)) {
        return;
      }
      if (!problemDropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ***** Lifting Up the Folder Expansion State *****
  // Define openFolders here so that it persists as long as StartLeft remains mounted.
  // (You could also persist this in localStorage if needed.)
  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});

  // Render content depending on the selected section.
  const renderContent = () => {
    switch (selectedSection) {
      case "Project":
        return (
          <Project_files
            codeMap={codeMap}
            setCodeForFile={setCodeForFile}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            fileTree={fileTree}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
          />
        );
      case "Problem":
        return (
          <div className="container-problem-left">
            <div className="problem-title-left">
              <div className="title-left-problem-start">{storedProblem}</div>
              {storedProblem && (
                <div
                  className="Hamburger-left-start"
                  ref={problemDropdownRef}
                  onClick={handleHamburgerClick}
                >
                  {menuOpen ? <HiX /> : <HiMenu />}
                  {menuOpen && (
                    <div className="dropdown-menu">
                      {problemKeys.map((key) => (
                        <div
                          key={key}
                          className="dropdown-item"
                          onClick={() => handleProblemSelect(key)}
                        >
                          {key}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="problem-text-left">
              {details || (
                <div className="defaulttextytext">
                  "No problem selected yet"
                </div>
              )}
            </div>
          </div>
        );
      case "Blocks":
        return <div>Building Blocks Content</div>;
      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="left-main">
      <div className="left-content-main">
        <div className="button-group">
          <div
            className={`segmented-button ${
              selected === "Project" ? "active" : ""
            }`}
            onClick={() => {
              selectSection("Project");
              setSelected("Project");
            }}
          >
            Project <br /> system files
          </div>
          <div
            className={`segmented-button ${
              selected === "Problem" ? "active" : ""
            }`}
            onClick={() => {
              selectSection("Problem");
              setSelected("Problem");
            }}
          >
            Problem
          </div>
          <div
            className={`segmented-button ${
              selected === "Blocks" ? "active" : ""
            }`}
            onClick={() => {
              selectSection("Blocks");
              setSelected("Blocks");
            }}
          >
            Building <br /> Blocks
          </div>
        </div>
        {/* Render dynamic content based on section */}
        <div className="all-type-of-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StartLeft;
