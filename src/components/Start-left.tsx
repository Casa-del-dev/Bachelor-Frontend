import { useState, useEffect, useRef } from "react";
import "./Problem_detail";
import "./Start-left.css";
import Project_files from "./Project_files";
import { problemDetailsMap } from "./Problem_detail";
import { HiMenu, HiX } from "react-icons/hi";

interface startleftInput {
  codeMap: Record<number, string>;
  setCodeForFile: (fileId: number, code: string) => void;
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
}: startleftInput) => {
  // Retrieve the last selected section from localStorage (default is "Problem" only on first load)
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

  // Retrieve the last selected problem from localStorage
  const storedProblem = localStorage.getItem("selectedProblem");
  const details = storedProblem
    ? problemDetailsMap[storedProblem]?.trim()
    : null;
  const problemKeys = Object.keys(problemDetailsMap);

  // Save the selected section to localStorage
  const selectSection = (section: "Project" | "Problem" | "Blocks") => {
    setSelectedSection(section);
    localStorage.setItem("selectedSection", section);
  };

  // Change problem without refreshing the page
  const handleProblemSelect = (problemKey: string) => {
    localStorage.setItem("selectedProblem", problemKey);
    setMenuOpen(false);
    window.location.reload();
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

  // Render the chosen content
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
                  {/* Dropdown menu */}
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
        <div className="class-created-for-seperator">
          <div className="header-left-main">
            {/* Three "buttons" */}
            <div
              className="Project-system-files invisible-button"
              onClick={() => selectSection("Project")}
            >
              Project <br /> system files
            </div>
            <div className="custom-separator-for-start-purpose"></div>
            <div
              className="Problem-description-main invisible-button"
              onClick={() => selectSection("Problem")}
            >
              Problem
            </div>
            <div className="custom-separator-for-start-purpose"></div>
            <div
              className="Building-blocks invisible-button"
              onClick={() => selectSection("Blocks")}
            >
              Building <br /> Blocks
            </div>
          </div>
          <div className="custom-line-horizontal"></div>
        </div>

        {/* Dynamic section - will show whichever is selected */}
        <div className="all-type-of-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StartLeft;
