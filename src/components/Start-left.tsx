import { useState, useEffect, useRef } from "react";
import "./Problem_detail";
import "./Start-left.css";
import Project_files from "./Project_files";
import { problemDetailsMap } from "./Problem_detail";
import { HiMenu, HiX } from "react-icons/hi";

const StartLeft = () => {
  // "Problem" is the default selected section
  const [selectedSection, setSelectedSection] = useState<
    "Project" | "Problem" | "Blocks"
  >("Problem");

  const [menuOpen, setMenuOpen] = useState(false);
  const problemDropdownRef = useRef<HTMLDivElement>(null);

  const openProjectFiles = () => {
    setSelectedSection("Project");
  };

  const openProblem = () => {
    setSelectedSection("Problem");
  };

  const openBuildingBlocks = () => {
    setSelectedSection("Blocks");
  };

  const storedProblem = localStorage.getItem("selectedProblem");
  const details = storedProblem
    ? problemDetailsMap[storedProblem]?.trim()
    : null;

  const problemKeys = Object.keys(problemDetailsMap);

  const handleHamburgerClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProblemSelect = (problemKey: string) => {
    localStorage.setItem("selectedProblem", problemKey);
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!problemDropdownRef.current || !(event.target instanceof Node)) {
        return;
      }
      if (!problemDropdownRef.current.contains(event.target)) {
        setMenuOpen(true);
      }
    }

    if (menuOpen) {
      setMenuOpen(true);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Render the chosen content
  const renderContent = () => {
    switch (selectedSection) {
      case "Project":
        return <Project_files />;
      case "Problem":
        return (
          <div className="container-problem-left">
            <div className="problem-title-left">
              {" "}
              <div className="title-left-problem-start">{storedProblem} </div>
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
            </div>

            <div className="problem-text-left">
              {details || "No problem selected yet"}
            </div>
          </div>
        );
      case "Blocks":
        return <div>Building Blocks Content</div>;
      default:
        return (
          <div className="container-problem-left">
            <div className="problem-title-left">
              {" "}
              <div className="title-left-problem-start">{storedProblem} </div>
              <div
                className="Hamburger-left-start"
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
            </div>

            <div className="problem-text-left">
              {details || "No problem selected yet"}
            </div>
          </div>
        );
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
              onClick={openProjectFiles}
            >
              Project <br /> system files
            </div>
            <div className="custom-separator-for-start-purpose"></div>
            <div
              className="Problem-description-main invisible-button"
              onClick={openProblem}
            >
              Problem
            </div>
            <div className="custom-separator-for-start-purpose"></div>
            <div
              className="Building-blocks invisible-button"
              onClick={openBuildingBlocks}
            >
              Building <br /> Blocks
            </div>
          </div>
          <div className="custom-line-horizontal"></div>
        </div>

        {/* Dynamic section - will show whichever is selected */}
        <div className="all-type-of-content">{renderContent()}</div>
      </div>
      <div className="custom-line-leftmiddle"></div>
    </div>
  );
};

export default StartLeft;
