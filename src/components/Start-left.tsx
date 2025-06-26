import { useState, useEffect, useRef } from "react";
import "./Problem_detail";
import "./Start-left.css";
import Project_files from "./Project_files";
import { problemDetailsMap } from "./BuildingBlocks/ProblemDetailsText";
import { FileItem } from "../CodeContext";

interface StartLeftInput {
  codeMap: Record<number, string | null>;
  setCodeForFile: (fileId: number, code: string | null) => void;
  currentFile: number | null;
  setCurrentFile: (fileId: number | null) => void;
  fileTree: any;
  setFileTree: any;
  problemId: string;
  setProblemId: (newId: string) => void;
  ref1: React.RefObject<HTMLDivElement>;
  ref2: React.RefObject<HTMLDivElement>;
  ref3: React.RefObject<HTMLDivElement>;
  ref4: React.RefObject<HTMLDivElement>;
  ref5: React.RefObject<HTMLDivElement>;
  ref6: React.RefObject<HTMLDivElement>;
  ref7: React.RefObject<HTMLDivElement>;
  ref8: React.RefObject<HTMLDivElement>;
  currentIndex: number;
  initialFiles: FileItem[];
  selectedSection: "Project" | "Problem" | "Blocks";
  setSelectedSection: (section: "Project" | "Problem" | "Blocks") => void;
  isCustom: boolean;
  problemName: string;
  problemDescription: string;
}
interface CustomMeta {
  id: string;
  name: string;
  description: string;
}

const BACKEND = "https://bachelor-backend.erenhomburg.workers.dev";

const StartLeft = ({
  codeMap,
  setCodeForFile,
  currentFile,
  setCurrentFile,
  fileTree,
  setFileTree,
  problemId,
  setProblemId,
  ref1,
  ref2,
  ref3,
  ref4,
  ref5,
  ref6,
  ref7,
  ref8,
  currentIndex,
  initialFiles,
  selectedSection,
  setSelectedSection,
  isCustom,
  problemName,
  problemDescription,
}: StartLeftInput) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const problemDropdownRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>("Project");

  // Retrieve the last selected problem from localStorage
  let storedProblem = problemId;
  let details = storedProblem ? problemDetailsMap[storedProblem]?.trim() : null;

  storedProblem = isCustom ? problemName : storedProblem;
  details = isCustom ? problemDescription : details;

  const [customMetas, setCustomMetas] = useState<CustomMeta[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetch(`${BACKEND}/customProblems/v1/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((list: CustomMeta[]) => setCustomMetas(list))
      .catch((err) =>
        console.warn("Failed to load custom problem metadata:", err)
      );
  }, []);

  const defaultKeys = Object.keys(problemDetailsMap);

  // Persist the selected section in localStorage
  const selectSection = (section: "Project" | "Problem" | "Blocks") => {
    setSelectedSection(section);
    localStorage.setItem("selectedSection", section);
  };

  // Change problem without a full reload
  const handleProblemSelect = (problemKey: string) => {
    if (problemKey !== storedProblem) setCurrentFile(null);
    localStorage.setItem("selectedProblem", problemKey);
    setProblemId(problemKey);
    setMenuOpen(false);
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

  const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        problemDropdownRef.current &&
        !problemDropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentIndex === 5) {
      selectSection("Problem");
      setSelected("Problem");
    } else if (currentIndex === 1) {
      selectSection("Project");
      setSelected("Project");
    } else if (currentIndex === 4) {
      selectSection("Project");
      setSelected("Project");
    } else if (currentIndex === 7) {
      selectSection("Problem");
      setSelected("Problem");
    } else if (currentIndex === 8) {
      selectSection("Project");
      setSelected("Project");
    }
  }, [currentIndex]);

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
            setFileTree={setFileTree}
            openFolders={openFolders}
            setOpenFolders={setOpenFolders}
            ref1={ref6}
            ref2={ref7}
            ref3={ref8}
            currentIndex={currentIndex}
            initialFiles={initialFiles}
          />
        );
      case "Problem":
        return (
          <div className="container-problem-left1" ref={ref3}>
            <div className={`problem-title-left1`} ref={problemDropdownRef}>
              <div
                className={`title-dropdown-trigger  ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                ref={ref4}
              >
                {storedProblem || "Select Problem"}{" "}
                <span className={`arrow-icon ${menuOpen ? "rotated" : ""}`}>
                  ▾
                </span>
              </div>

              {menuOpen && (
                <div className="dropdown-menu1">
                  {defaultKeys.map((k) => (
                    <div
                      key={k}
                      className="dropdown-item-left-problem"
                      onClick={() => handleProblemSelect(k)}
                    >
                      {k}
                    </div>
                  ))}
                  {customMetas.map((p) => (
                    <div
                      key={p.id}
                      className="dropdown-item-left-problem"
                      onClick={() => handleProblemSelect(p.id)}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="problem-text-left1">
              {details || (
                <div className="defaulttextytext">
                  "No problem selected yet"
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>No content available</div>;
    }
  };

  return (
    <div className="left-main">
      <div className="left-content-main">
        <div className="button-group" ref={ref1}>
          <div
            className={`segmented-button ${
              selected === "Project" ? "active" : ""
            }`}
            onClick={() => {
              selectSection("Project");
              setSelected("Project");
            }}
            ref={ref5}
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
            ref={ref2}
          >
            Problem
          </div>
        </div>
        {/* Render dynamic content based on section */}
        <div className="all-type-of-content1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StartLeft;
