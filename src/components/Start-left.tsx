import React, { useState } from "react";
import "./Start-left.css";

const StartLeft = () => {
  // "Problem" is the default selected section
  const [selectedSection, setSelectedSection] = useState<
    "Project" | "Problem" | "Blocks"
  >("Problem");

  const openProjectFiles = () => {
    setSelectedSection("Project");
  };

  const openProblem = () => {
    setSelectedSection("Problem");
  };

  const openBuildingBlocks = () => {
    setSelectedSection("Blocks");
  };

  // Render the chosen content
  const renderContent = () => {
    switch (selectedSection) {
      case "Project":
        return <div>Project System Files Content</div>;
      case "Problem":
        return <div>Problem Content</div>;
      case "Blocks":
        return <div>Building Blocks Content</div>;
      default:
        return <div>Problem Content</div>;
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
