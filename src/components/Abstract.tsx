import React, { useEffect, useRef, useState } from "react";
import "./Abstract.css";
import { Search, X, Check } from "lucide-react";
import { useAuth } from "../AuthContext";

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

interface Transform {
  scale: number;
  x: number;
  y: number;
}
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

const Abstract: React.FC = ({}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const zoomContentRef = useRef<HTMLDivElement | null>(null);

  const [transform, setTransform] = useState<Transform>({
    scale: 1,
    x: 0,
    y: 0,
  });

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
  const headerRef = useRef<HTMLDivElement>(null);
  const rightAbstractRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useAuth();

  const [toggleAbstraction, setToggleAbstraction] = useState(
    localStorage.getItem("abstraction") || "false"
  );

  const [animateToRight, setAnimateToRight] = useState(false);
  const mainContainerRef = useRef<HTMLDivElement | null>(null);

  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    localStorage.setItem("abstraction", toggleAbstraction);
  }, [toggleAbstraction]);

  const handleToggleAbstraction = () => {
    setToggleAbstraction(toggleAbstraction === "true" ? "false" : "true");
  };

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
    if (!isAuthenticated.isAuthenticated) {
      setSteps([]);
    } else {
      if (problemId) {
        loadStepTreeFromBackend(problemId)
          .then((tree) => {
            if (tree) {
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
    }
  }, [problemId, isAuthenticated]);

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

  //Zoom in / zoom out
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;
    const content = zoomContentRef.current!;
    let rafId: number | null = null;

    // drag and pinch state
    let isDragging = false;
    const pointers = new Map<number, { x: number; y: number }>();
    let lastDist: number | null = null;
    let initialTransform: Transform = { ...transformRef.current };

    container.style.touchAction = "none";
    container.style.userSelect = "none";
    content.style.willChange = "transform";

    const applyTransform = () => {
      const { x, y, scale } = transformRef.current;
      content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      rafId = null;
    };
    const scheduleTransformUpdate = () => {
      if (rafId === null) rafId = requestAnimationFrame(applyTransform);
    };

    const getDistance = () => {
      const [p1, p2] = Array.from(pointers.values());
      return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    };
    const getMidpoint = () => {
      const [p1, p2] = Array.from(pointers.values());
      return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    };

    const onPointerDown = (e: PointerEvent) => {
      container.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        isDragging = true;
      } else if (pointers.size === 2) {
        isDragging = false;
        lastDist = getDistance();
        initialTransform = { ...transformRef.current };
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size === 2 && lastDist !== null) {
        // pinch
        const newDist = getDistance();
        const scaleFactor = newDist / lastDist;
        const newScale = clamp(
          initialTransform.scale * scaleFactor,
          MIN_ZOOM,
          MAX_ZOOM
        );
        const midpoint = getMidpoint();
        const rect = container.getBoundingClientRect();
        const mx = midpoint.x - rect.left;
        const my = midpoint.y - rect.top;
        const dx =
          mx - (mx - initialTransform.x) * (newScale / initialTransform.scale);
        const dy =
          my - (my - initialTransform.y) * (newScale / initialTransform.scale);
        transformRef.current = { scale: newScale, x: dx, y: dy };
        scheduleTransformUpdate();
      } else if (isDragging && pointers.size === 1) {
        // pan
        const entry = pointers.entries().next().value;
        if (!entry) return;
        const [id, prev] = entry;
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        pointers.set(id, { x: e.clientX, y: e.clientY });
        transformRef.current.x += dx;
        transformRef.current.y += dy;
        scheduleTransformUpdate();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      container.releasePointerCapture(e.pointerId);
      pointers.delete(e.pointerId);
      if (pointers.size < 2) {
        lastDist = null;
        initialTransform = { ...transformRef.current };
      }
      if (pointers.size === 0) {
        isDragging = false;
        setTransform({ ...transformRef.current });
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove, {
      passive: false,
    });
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  //when mouse leftclick down move div grab
  // Mirror React state in a ref
  const transformRef = useRef<Transform>(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  //One big pan+zoom effect—bind once, direct DOM writes
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const content = zoomContentRef.current!;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rafId: number | null = null;

    // Optimization hints
    container.style.touchAction = "none";
    container.style.userSelect = "none";
    content.style.willChange = "transform";

    function applyTransform() {
      const { x, y, scale } = transformRef.current;
      content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      rafId = null;
    }

    function scheduleTransformUpdate() {
      if (rafId === null) {
        rafId = requestAnimationFrame(applyTransform);
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      // Simple screen-space movement
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;

      lastX = e.clientX;
      lastY = e.clientY;

      transformRef.current.x += dx;
      transformRef.current.y += dy;
      scheduleTransformUpdate();
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      container.releasePointerCapture(e.pointerId);
      container.style.cursor = "grab";
      setTransform({ ...transformRef.current });
    };

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;

      const old = transformRef.current;
      const newScale = clamp(old.scale * factor, MIN_ZOOM, MAX_ZOOM);

      // Adjust transform to keep content under mouse fixed
      transformRef.current.x = mx - (mx - old.x) * (newScale / old.scale);
      transformRef.current.y = my - (my - old.y) * (newScale / old.scale);
      transformRef.current.scale = newScale;

      scheduleTransformUpdate();
      setTransform({ ...transformRef.current });
    };

    // Add event listeners
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove, {
      passive: false,
    });
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      // Cleanup
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);
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

  function getPageZoom(): number {
    return Math.round(window.devicePixelRatio * 100);
  }

  /**
   * Linearly interpolate based on predefined points.
   */
  function interpolateZoomEffect(percent: number): number {
    const points = [
      { percent: 25, value: 4 },
      { percent: 33, value: 2 },
      { percent: 50, value: 0 },
      { percent: 66, value: -1 },
      { percent: 75, value: -1.3 },
      { percent: 80, value: -1.4 },
      { percent: 90, value: -1.8 },
      { percent: 100, value: 0 },
      { percent: 110, value: -0.4 },
      { percent: 125, value: -0.8 },
      { percent: 150, value: 0 },
      { percent: 175, value: -0.5 },
      { percent: 200, value: 0 },
      { percent: 250, value: 0 },
    ];

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (percent >= p1.percent && percent <= p2.percent) {
        const t = (percent - p1.percent) / (p2.percent - p1.percent);
        return p1.value + t * (p2.value - p1.value);
      }
    }

    // Fallback: clamp to nearest boundary
    if (percent < points[0].percent) return points[0].value;
    if (percent > points[points.length - 1].percent)
      return points[points.length - 1].value;

    return 0; // Should not reach here
  }

  function calculateTreeWidth(node: Step): number {
    const zoomPercent = getPageZoom();
    const modifier = interpolateZoomEffect(zoomPercent);
    if (node.children.length === 0) {
      return STEP_BOX_WIDTH_PX + modifier;
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

    const connectorOffset = Math.round(
      (nodeWidth - STEP_BOX_WIDTH_PX + 60) / 2
    );
    const offsetWithUnit = `${connectorOffset}px`;

    const childCount = node.children.length;

    let branchLineStyle = undefined;

    if (childCount > 0) {
      const leftChildWidth = calculateTreeWidth(node.children[0]);
      const rightChildWidth = calculateTreeWidth(node.children[childCount - 1]);

      const branchLineLeftOffset = Math.ceil(leftChildWidth / 2);
      const branchLineRightOffset = Math.ceil(rightChildWidth / 2);

      const branchLineWidth =
        nodeWidth - leftChildWidth / 2 - rightChildWidth / 2;
      branchLineStyle = {
        position: "absolute",
        left: `${branchLineLeftOffset}px`,
        right: `${branchLineRightOffset}px`,
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
      {/* Left line container*/}

      <div ref={rightAbstractRef} className="right-abstract-container">
        <div
          className="divider abstract"
          onDoubleClick={() => {
            setAnimateToRight(true);
          }}
        />
      </div>
      {/* Header container*/}
      <div ref={headerRef} className="header-abstract">
        <div className="header-left-ab-container">
          <div
            className="header-left-abstraction"
            onClick={() => console.log("Clicked Abstraction Search")}
          >
            <div
              className="container-icons-ab"
              onClick={handleToggleAbstraction}
            >
              {toggleAbstraction === "true" ? (
                <X className="X-abstract" strokeWidth="3px" />
              ) : (
                <Check className="Check-abstract" strokeWidth="3px" />
              )}
            </div>
            <div className="left-header-container-ab-notIcon">
              Abstraction <Search />
            </div>
          </div>
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
      {/* Tree Container container*/}
      <div className="map-abstract-container" ref={mapContainerRef}>
        <div
          ref={zoomContentRef}
          className="zoom-content"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {renderTree()}
        </div>
      </div>
    </div>
  );
};

export default Abstract;
