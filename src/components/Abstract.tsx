import React, { useEffect, useRef, useState, ReactNode } from "react";
import "./Abstract.css";
import { Search } from "lucide-react";

export interface Step {
  id: string; // unique ID for each step
  code: string;
  content: string;
  correctStep: string;
  prompt: string;
  status: {
    correctness: "correct" | "incorrect" | "missing" | "";
    can_be_further_divided: "can" | "cannot" | "";
  };
  general_hint: string;
  detailed_hint: string;
  children: Step[];
  hasparent: boolean;
  isDeleting: boolean;

  showGeneralHint1: boolean;
  showDetailedHint1: boolean;
  showCorrectStep1: boolean;
  showGeneralHint2: boolean;
  showDetailedHint2: boolean;

  isNewlyInserted: boolean;
  isexpanded: boolean;
  isHyperExpanded: boolean;

  selected: boolean;
}

const Abstract: React.FC = ({}) => {
  const problemListItems = [
    "Problem 1",
    "Problem 2",
    "Problem 3",
    "Problem 4",
    "Problem 5",
    "Problem 6",
    "Problem 7",
    "Problem 8",
    "Problem 9",
  ];
  const [problemList] = useState(problemListItems);
  const [problemId, setProblemId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [animateToRight, setAnimateToRight] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  async function loadStepTreeFromBackend(
    problemId: string
  ): Promise<Step[] | null> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const res = await fetch(
        `https://bachelor-backend.erenhomburg.workers.dev/problem/v2/loadStepTree?id=${encodeURIComponent(
          problemId
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Load failed (${res.status})`);
      }

      const data = (await res.json()) as { root: Step[] };
      return data.root;
    } catch (err) {
      console.error("Error in loadStepTreeFromBackend:", err);
      return null;
    }
  }

  useEffect(() => {
    const savedProblem = localStorage.getItem("selectedProblem");
    if (savedProblem && problemList.includes(savedProblem)) {
      setProblemId(savedProblem);
    } else {
      const defaultProblem = problemList[0] || "Problem 1";
      setProblemId(defaultProblem);
      localStorage.setItem("selectedProblem", defaultProblem);
    }
  }, [problemList]); // problemList is stable, but good practice

  useEffect(() => {
    if (problemId) {
      console.log(`Attempting to load tree for problem: ${problemId}`);
      loadStepTreeFromBackend(problemId)
        .then((tree) => {
          if (tree) {
            console.log("Successfully loaded tree for", problemId, tree);
            setSteps(tree);
          } else {
            console.log(
              "No tree data returned or error loading for",
              problemId
            );
          }
        })
        .catch((error) => {
          console.error("Error in loadStepTreeFromBackend promise:", error);
        });
    }
  }, [problemId]);

  const handleSelectProblem = (selectedProblem: string) => {
    setProblemId(selectedProblem);
    localStorage.setItem("selectedProblem", selectedProblem);
    setIsDropdownOpen(false);
    setTimeout(() => setShouldRenderDropdown(false), 300);
  };

  useEffect(() => {
    const container = mainContainerRef.current;
    if (animateToRight && container) {
      const handleAnimationEnd = (event: AnimationEvent) => {
        if (event.target === container) {
          // Ensure it's the main container's animation
          window.location.href = "/start";
        }
      };
      container.addEventListener("animationend", handleAnimationEnd);
      const animationDuration = 300; // Must match CSS animation duration
      const fallbackTimeout = setTimeout(() => {
        console.warn(
          "Animationend fallback: Navigating to /start after timeout."
        );
        window.location.href = "/start";
      }, animationDuration + 100);

      return () => {
        clearTimeout(fallbackTimeout);
        container.removeEventListener("animationend", handleAnimationEnd);
      };
    }
  }, [animateToRight]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setTimeout(() => setShouldRenderDropdown(false), 300);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setTimeout(() => setShouldRenderDropdown(false), 300);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      setTimeout(() => setShouldRenderDropdown(false), 300);
    } else {
      setShouldRenderDropdown(true);
      setTimeout(() => setIsDropdownOpen(true), 0);
    }
  };
  /* ---------------------------------------
  render Tree function START
--------------------------------------- */
  function calculateStepBoxWidthPx() {
    const vw = window.innerWidth * 0.15;
    return vw + 36;
  }

  const [stepBoxWidth, setStepBoxWidth] = useState(calculateStepBoxWidthPx());

  useEffect(() => {
    const handleResize = () => setStepBoxWidth(calculateStepBoxWidthPx());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //Start the view from center
  useEffect(() => {
    const firstItem = document.querySelector(".map-abstract-container");
    if (firstItem) {
      firstItem.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, [steps]);

  const STEP_BOX_WIDTH_PX = stepBoxWidth;
  const CHILD_EXTRA_MARGIN_PX = 60;

  function calculateTreeWidth(node: Step): number {
    if (node.children.length === 0) {
      return STEP_BOX_WIDTH_PX;
    }

    const childWidths = node.children.map(calculateTreeWidth);
    const totalChildWidth =
      childWidths.reduce((sum, width) => sum + width, 0) +
      (node.children.length - 1) * CHILD_EXTRA_MARGIN_PX;

    return totalChildWidth;
  }

  /**
   * Recursively renders a node and its children
   */
  function renderNode(node: Step, indexPath: string) {
    const nodeWidth = calculateTreeWidth(node);

    const connectorOffset = (nodeWidth - STEP_BOX_WIDTH_PX + 60) / 2;
    const offsetWithUnit = `${connectorOffset}px`;

    const childCount = node.children.length;

    let branchLineStyle = undefined;

    if (childCount > 0) {
      const leftChildWidth = calculateTreeWidth(node.children[0]);
      const rightChildWidth = calculateTreeWidth(node.children[childCount - 1]);

      const branchLineLeftOffset = leftChildWidth / 2;
      const branchLineWidth =
        nodeWidth - leftChildWidth / 2 - rightChildWidth / 2;

      branchLineStyle = {
        position: "absolute",
        left: `${branchLineLeftOffset}px`,
        right: `${rightChildWidth / 2}px`,
        width: `${branchLineWidth}px`,
      };
    }

    return (
      <div
        key={node.id}
        className="tree-root-item"
        style={{ "--margin-var-tree": offsetWithUnit } as React.CSSProperties}
      >
        <div className="step-box-ab">
          <div className="tree-node-ab">
            <strong>Step {indexPath}</strong>
            <div>{node.content || node.prompt}</div>
          </div>
        </div>

        {node.children.length > 0 && (
          <div className="tree-children-ab" style={{ position: "relative" }}>
            <div
              className="branch-line"
              style={branchLineStyle as React.CSSProperties}
            />
            <div className="branch-items-container">
              <div className="branch-items">
                {node.children.map((child, j) =>
                  renderNode(child, `${indexPath}.${j + 1}`)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Entry point rendering the whole tree
   */
  function renderTree() {
    return (
      <div className="tree-root">
        {steps.map((node, i) => renderNode(node, `${i + 1}`))}
      </div>
    );
  }

  /* ---------------------------------------
  render Tree function END
--------------------------------------- */

  return (
    <div
      ref={mainContainerRef}
      className={`main-container-abstract ${
        animateToRight ? "slide-right" : ""
      }`}
    >
      <div className="right-abstract-container">
        <div
          className="divider"
          onDoubleClick={() => {
            setAnimateToRight(true);
          }}
        />
      </div>

      <div className="header-abstract">
        <div
          className="header-left-abstraction"
          onClick={() => console.log("Clicked Abstraction Search")}
        >
          Abstraction <Search />
        </div>
        <div className="select-problem-abstract" ref={dropdownRef}>
          <div className="dropdown-header-abstract" onClick={toggleDropdown}>
            <span
              className={`dropdown-label ${isDropdownOpen ? "hidden" : ""}`}
            >
              {problemId}
            </span>
            <span className={`arrow ${isDropdownOpen ? "up" : "down"}`}>
              {"▲"}
            </span>
          </div>
          <div
            className={`dropdown-list-abstract ${isDropdownOpen ? "open" : ""}`}
            style={{ display: shouldRenderDropdown ? "block" : "none" }}
          >
            <div className="dropdown-items-container-ab">
              {problemList.map((problem) => (
                <div
                  key={problem}
                  className="dropdown-item"
                  onClick={() => handleSelectProblem(problem)}
                >
                  {problem}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="map-abstract-container">{renderTree()}</div>
    </div>
  );
};

export default Abstract;
