import "./Start.css";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import StartLeft from "./Start-left";
import StartRight from "./Start-right";
import StartMiddle from "./Start_middle";
import { CodeProvider, FileItem, useCodeContext } from "../CodeContext";
import { useAuth } from "../AuthContext";
import { Check, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { tutorialRoutes } from "./BuildingBlocks/TutorialRoutes";
import tutorialSteps from "./BuildingBlocks/TutorialStepsProblem";
import tutorialStepsStart, {
  TutorialStepStart,
} from "./BuildingBlocks/TutorialStepsStart";
import tutorialStepsAbstract from "./BuildingBlocks/TutorialStepsAbstract";

const SPACING = 10;

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

interface LayoutState {
  left: number;
  middle: number;
  right: number;
}

const MIN_LEFT = 15; // Minimum width for left column
const MIN_RIGHT = 20; // Minimum width for right column
const MIN_RIGHT_PX = 500;

const Start: React.FC = () => {
  const rightRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  const [rightFontSize, setRightFontSize] = useState("1vw");
  const [leftFontSize, setLeftFontSize] = useState("1vw");

  const draggingLeftDivider = useRef(false);
  const draggingRightDivider = useRef(false);

  const [hoveredStep, setHoveredStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromEditor, setFromEditor] = useState(false);
  const {
    currentFile,
    setCurrentFile,
    codeMap,
    setCodeForFile,
    test,
    fileTree,
    setFileTree,
    currentFileName,
    problemId,
    setProblemId,
  } = useCodeContext();

  const { isAuthenticated } = useAuth();

  /* --------------------------------------
     API for StepTree START
  -------------------------------------- */

  const [stepTree, setStepTree] = useState<Step[]>([]);
  const hasInitializedStepTree = useRef(false);

  useEffect(() => {
    if (!problemId) return;

    setLoading(true);
    loadStepTreeFromBackend(problemId)
      .then((tree) => {
        setStepTree(tree ?? []);
        hasInitializedStepTree.current = true;
      })
      .catch((err) => console.error("Unexpected load error:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [problemId, isAuthenticated]);

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

  const saveStepTree = useCallback(
    async (newTree: Step[]) => {
      if (!problemId) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          `https://bachelor-backend.erenhomburg.workers.dev/problem/v2/saveStepTree?id=${encodeURIComponent(
            problemId
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ problemId: problemId, stepTree: newTree }),
          }
        );
        if (!res.ok) throw new Error(`Save failed (${res.status})`);
      } catch (err) {
        console.error("Error in saveStepTree:", err);
      }
    },
    [problemId]
  );

  useEffect(() => {
    if (!hasInitializedStepTree.current) return;
    saveStepTree(stepTree);
  }, [stepTree, saveStepTree]);

  /* --------------------------------------
     API for StepTree END
  -------------------------------------- */

  const [layout, setLayout] = useState<LayoutState>(() => {
    const storedLayout = localStorage.getItem("layoutDimensions");
    if (storedLayout) {
      try {
        const parsed = JSON.parse(storedLayout) as LayoutState;
        if (parsed.left + parsed.middle + parsed.right === 100) {
          return parsed;
        }
      } catch (error) {
        console.error("Error parsing stored layout dimensions:", error);
      }
    }
    return { left: 30, middle: 50, right: 20 };
  });

  // Save layout changes to local storage
  useEffect(() => {
    localStorage.setItem("layoutDimensions", JSON.stringify(layout));
  }, [layout]);

  const enforceRightWidthPx = useCallback(() => {
    const totalW = window.innerWidth;
    if (totalW < MIN_RIGHT_PX) {
      return false; // cannot enforce
    }
    const newRightPercent = (MIN_RIGHT_PX / totalW) * 100;
    const sumLM = layout.left + layout.middle;
    const leftover = 100 - newRightPercent;
    const newLeft = (layout.left / sumLM) * leftover;
    const newMiddle = leftover - newLeft;
    setLayout({ left: newLeft, middle: newMiddle, right: newRightPercent });
    return true;
  }, [layout.left, layout.middle]);

  // Set selected problem from URL or local storage
  useEffect(() => {
    const stored = localStorage.getItem("selectedProblem");
    if (stored) {
      setProblemId(stored);
    }
  }, []);

  // Update layout based on divider dragging
  const updateLayout = (deltaX: number, divider: "left" | "right") => {
    const deltaPercent = (deltaX / window.innerWidth) * 100;
    setLayout((prev) => {
      let { left, middle, right } = { ...prev };

      if (divider === "left") {
        left += deltaPercent;
      } else {
        right -= deltaPercent;
      }

      if (left < MIN_LEFT) left = MIN_LEFT;
      if (right < MIN_RIGHT) right = MIN_RIGHT;

      const maxLeft = 80 - right;
      const maxRight = 80 - left;
      if (left >= maxLeft) left = maxLeft;
      if (right >= maxRight) right = maxRight;

      middle = 100 - (left + right);
      return { left, middle, right };
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingLeftDivider.current) {
      updateLayout(e.movementX, "left");
    } else if (draggingRightDivider.current) {
      updateLayout(e.movementX, "right");
    }
  };

  const handleMouseUp = () => {
    draggingLeftDivider.current = false;
    draggingRightDivider.current = false;
  };

  const startDragLeft = () => {
    draggingLeftDivider.current = true;
  };

  const startDragRight = () => {
    draggingRightDivider.current = true;
  };

  //right width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--right-width",
      `${layout.right}%`
    );
  }, [layout.right]);

  // Helper function to update font size
  const updateFontSize = useCallback(() => {
    if (rightRef.current) {
      const widthPx = rightRef.current.offsetWidth;
      const fontSizeValue = Math.min(Math.max(widthPx * 0.04, 15), 30);
      const computedRight = `${fontSizeValue}px`;
      if (computedRight !== rightFontSize) {
        setRightFontSize(computedRight);
        localStorage.setItem("rightFontSize", computedRight);
      }
    }

    if (leftRef.current) {
      const widthPx = leftRef.current.offsetWidth;
      const fontSizeValue = Math.min(Math.max(widthPx * 0.045, 15), 26); // slightly smaller max
      const computedLeft = `${fontSizeValue}px`;
      if (computedLeft !== leftFontSize) {
        setLeftFontSize(computedLeft);
        localStorage.setItem("leftFontSize", computedLeft);
      }
    }
  }, [rightFontSize, leftFontSize]);

  // Update font size when layout changes (e.g. during dragging)
  useEffect(() => {
    updateFontSize();
  }, [layout, updateFontSize]);

  // Update font size on window resize
  useEffect(() => {
    window.addEventListener("resize", updateFontSize);
    return () => {
      window.removeEventListener("resize", updateFontSize);
    };
  }, [updateFontSize]);

  // On mount, try to load font size from local storage or compute it
  useEffect(() => {
    const storedRight = localStorage.getItem("rightFontSize");
    if (storedRight) setRightFontSize(storedRight);

    const storedLeft = localStorage.getItem("leftFontSize");
    if (storedLeft) setLeftFontSize(storedLeft);

    if (!storedLeft || !storedRight) {
      updateFontSize();
    }
  }, [updateFontSize]);

  // Global mouse event listeners for divider dragging
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  //animation for abstract part

  const [animateRightToLeft, setAnimateRightToLeft] = useState(false);

  const handleRightDoubleClick = () => {
    setAnimateRightToLeft(!animateRightToLeft);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (animateRightToLeft) window.location.href = "/abstract";
    }, 650);

    return () => clearTimeout(timeout);
  }, [animateRightToLeft]);

  // STARTRIGht component

  //TUTORIAL START

  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const query = new URLSearchParams(search);
  const tutorialParam = query.get("tutorial");

  // Tutorial state
  const [stepIndex, setStepIndex] = useState<number>(
    Number(localStorage.getItem("tutorialStep") || 0) // this localstorage serves as a fallback to when we are actually going back form the prev page
  );
  const [holeRect, setHoleRect] = useState<DOMRect | null>(null);
  const [animate, setAnimate] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });

  // Clean up if tutorial=2 is not active
  useEffect(() => {
    if (tutorialParam !== "2" && stepIndex !== 0) {
      setStepIndex(0);
      localStorage.removeItem("tutorialStep");
    }
    if (tutorialParam !== "2" && stepIndex === -1) {
      setStepIndex(0);
      localStorage.removeItem("tutorialStep");
    }
  }, [pathname, search]);

  // Auto-start when arriving with ?tutorial=2
  useEffect(() => {
    if (!enforceRightWidthPx()) return;

    if (tutorialParam === "2") {
      setCurrentFile(null);
      setAnimate(true);
      if (stepIndex === -1) {
        setStepIndex(49);
      } else {
        //easier for me to aways start at the start since I would need a lot of if stmts to set all the correct states
        setStepIndex(1);
      }
    }
  }, [tutorialParam]);

  // Persist tutorial progress
  useEffect(() => {
    if (stepIndex > 0) {
      localStorage.setItem("tutorialStep", String(stepIndex));
    } else {
      localStorage.removeItem("tutorialStep");
    }
  }, [stepIndex]);

  const baseSteps = tutorialStepsStart.length;
  const urlSteps =
    tutorialParam === "2"
      ? tutorialSteps.length + baseSteps + tutorialStepsAbstract.length
      : baseSteps;

  const TOTAL_STEPS = urlSteps;
  const current = tutorialStepsStart[stepIndex - 1] || null;

  // Measure the highlighted hole
  const measureHole = () => {
    if (current) {
      const r =
        refs[current.targetKey].current?.getBoundingClientRect() || null;
      setHoleRect(r);
    } else {
      setHoleRect(null);
    }
  };

  // Measure the modal size
  const measureModal = () => {
    if (modalRef.current) {
      const r = modalRef.current.getBoundingClientRect();
      setModalSize({ width: r.width, height: r.height });
    }
  };

  const [selectedSection, setSelectedSection] = useState<
    "Project" | "Problem" | "Blocks"
  >("Project");

  // Disable animations & re-measure on resize/scroll
  const animateRef = useRef(animate);
  // will store the animate value that needs to be restored
  const prevAnimateRef = useRef<boolean>(animate);
  const resizeTimer = useRef<number | null>(null);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  useEffect(() => {
    const onChange = () => {
      // first event in a burst → store the current animate value and disable
      if (resizeTimer.current === null) {
        prevAnimateRef.current = animateRef.current;
        setAnimate(false);
      }
      // always re-measure immediately
      measureHole();
      measureModal();
      // debounce “end of resize/scroll”
      if (resizeTimer.current !== null)
        window.clearTimeout(resizeTimer.current);
      resizeTimer.current = window.setTimeout(() => {
        // restore to whatever animate was before
        setAnimate(prevAnimateRef.current);
        resizeTimer.current = null;
      }, 200);
    };
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", onChange);
    }
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", onChange);
      }
      // clean up any pending timer
      if (resizeTimer.current !== null)
        window.clearTimeout(resizeTimer.current);
    };
  }, [stepIndex]);

  const refs: Record<
    TutorialStepStart["targetKey"],
    React.RefObject<HTMLDivElement>
  > = {
    first: useRef<HTMLDivElement>(null!),
    second: useRef<HTMLDivElement>(null!),
    third: useRef<HTMLDivElement>(null!),
    fourth: useRef<HTMLDivElement>(null!),
    fifth: useRef<HTMLDivElement>(null!),
    sixth: useRef<HTMLDivElement>(null!),
    seventh: useRef<HTMLDivElement>(null!),
    eigth: useRef<HTMLDivElement>(null!),
    nine: useRef<HTMLDivElement>(null!),
    ten: useRef<HTMLDivElement>(null!),
    eleven: useRef<HTMLDivElement>(null!),
    twelve: useRef<HTMLDivElement>(null!),
    thirteen: useRef<HTMLDivElement>(null!),
    fourteen: useRef<HTMLDivElement>(null!),
    fifthteen: useRef<HTMLDivElement>(null!),
    sixthteen: useRef<HTMLDivElement>(null!),
    seventeen: useRef<HTMLDivElement>(null!),
    eighteen: useRef<HTMLDivElement>(null!),
    nineteen: useRef<HTMLDivElement>(null!),
    twenty: useRef<HTMLDivElement>(null!),
    twentyone: useRef<HTMLDivElement>(null!),
    twentytwo: useRef<HTMLDivElement>(null!),
    twentythree: useRef<HTMLDivElement>(null!),
    twentyfour: useRef<HTMLDivElement>(null!),
    twentyfive: useRef<HTMLDivElement>(null!),
    twentysix: useRef<HTMLDivElement>(null!),
    twentyseven: useRef<HTMLDivElement>(null!),
    twentyeight: useRef<HTMLDivElement>(null!),
    twentynine: useRef<HTMLDivElement>(null!),
    thirty: useRef<HTMLDivElement>(null!),
    thirtyone: useRef<HTMLDivElement>(null!),
    thirtytwo: useRef<HTMLDivElement>(null!),
    thirtythree: useRef<HTMLDivElement>(null!),
    thirtyfour: useRef<HTMLDivElement>(null!),
    thirtyfive: useRef<HTMLDivElement>(null!),
    thirtysix: useRef<HTMLDivElement>(null!),
    thirtyseven: useRef<HTMLDivElement>(null!),
    thirtyeigth: useRef<HTMLDivElement>(null!),
    thirtynine: useRef<HTMLDivElement>(null!),
    fourty: useRef<HTMLDivElement>(null!),
    fourtyone: useRef<HTMLDivElement>(null!),
    fourtytwo: useRef<HTMLDivElement>(null!),
    fourtythree: useRef<HTMLDivElement>(null!),
    fourtyfour: useRef<HTMLDivElement>(null!),
    fourtyfive: useRef<HTMLDivElement>(null!),
    fourtysix: useRef<HTMLDivElement>(null!),
    fourtyseven: useRef<HTMLDivElement>(null!),
    fourtyeigth: useRef<HTMLDivElement>(null!),
    fourtynine: useRef<HTMLDivElement>(null!),
  };

  const startTutorial = () => {
    if (!enforceRightWidthPx()) return;
    setCurrentFile(null);
    setAnimate(true);
    setStepIndex(1);
  };

  const go = (idx: number, animated: boolean) => {
    setAnimate(animated);
    if (
      idx < 1 ||
      idx + (Number(tutorialParam || -1) === 2 ? tutorialSteps.length : 0) >
        TOTAL_STEPS -
          (Number(tutorialParam || -1) === 2 ? tutorialStepsAbstract.length : 0)
    ) {
      nextFinish();
    } else {
      setStepIndex(idx);
    }
  };

  const cancelTutorial = () => {
    setStepIndex(0);
    setCurrentFile(null);
    localStorage.removeItem("tutorialStep");
    setStepTree((old) => [...old]);
    setLoading(false);
    navigate(pathname, { replace: true });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const inTutorial =
        stepIndex !== 0 && !!localStorage.getItem("tutorialStep");
      if (e.key === "Escape" && inTutorial) {
        cancelTutorial();
      } else if (e.key === "ArrowRight" && inTutorial) {
        // same as clicking "Next"
        go(stepIndex + 1, true);
      } else if (e.key === "ArrowLeft" && inTutorial) {
        // same as clicking "Back"
        if (tutorialParam === "2" && stepIndex === 1) {
          localStorage.setItem(
            "tutorialStep",
            String(-1) // last Problem step
          );

          window.location.href = `${tutorialRoutes[0]}?tutorial=1`;
        } else {
          go(stepIndex - 1, animate);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stepIndex, go, cancelTutorial]);

  const nextFinish = () => {
    setStepIndex(0);
    setStepTree((old) => [...old]);
    setCurrentFile(null);
    setLoading(false);
    if (tutorialParam === "2") {
      const next = tutorialRoutes[Number(tutorialParam)];
      if (next) window.location.href = `${next}?tutorial=3`;
    } else {
      localStorage.removeItem("tutorialStep");
    }
  };

  // Blocks for overlay
  const blocks = holeRect
    ? [
        { top: 0, left: 0, width: "100vw", height: holeRect.top },
        {
          top: holeRect.bottom,
          left: 0,
          width: "100vw",
          height: `calc(100vh - ${holeRect.bottom}px)`,
        },
        {
          top: holeRect.top,
          left: 0,
          width: holeRect.left,
          height: holeRect.height,
        },
        {
          top: holeRect.top,
          left:
            holeRect.right +
            (stepIndex === 17 || stepIndex === 21 || stepIndex === 23
              ? 10000000000
              : 0),
          width: `calc(100vw - ${holeRect.right}px)`,
          height: holeRect.height,
        },
      ]
    : [];

  // Compute modal flip logic
  let modalTop = 0,
    modalLeft = 0;
  const hdr = window.innerHeight * 0.1;
  if (holeRect) {
    if (holeRect.height >= window.innerHeight) {
      modalTop = hdr + (window.innerHeight - hdr - modalSize.height) / 2;
    } else {
      modalTop = holeRect.bottom + SPACING;
      if (holeRect.top < hdr + SPACING) modalTop = holeRect.bottom + SPACING;
      if (modalTop + modalSize.height > window.innerHeight) {
        modalTop = holeRect.top - SPACING - modalSize.height;
      }
    }
    if (modalTop < hdr + SPACING) modalTop = hdr + SPACING;

    modalLeft =
      holeRect.right +
      SPACING +
      (stepIndex === 17 || stepIndex === 21 || stepIndex === 23
        ? 10000000000
        : 0);

    if (modalLeft + modalSize.width > window.innerWidth) {
      modalLeft = holeRect.left - SPACING - modalSize.width;
    }
    if (modalLeft < SPACING) modalLeft = SPACING;
  }

  const startRightComponent = (
    <StartRight
      fontSize={rightFontSize}
      hoveredStepId={hoveredStep ? hoveredStep.id : null}
      loading={loading}
      setLoading={setLoading}
      fromEditor={fromEditor}
      setFromEditor={setFromEditor}
      codeMap={codeMap}
      setCodeForFile={setCodeForFile}
      currentFile={currentFile}
      stepTree={stepTree}
      setStepTree={setStepTree}
      fileTree={fileTree}
      ref1={refs.nineteen}
      ref2={refs.twenty}
      ref3={refs.twentyfour}
      ref4={refs.twentyfive}
      ref5={refs.twentysix}
      ref6={refs.twentyseven}
      ref7={refs.twentyeight}
      ref8={refs.twentynine}
      ref9={refs.thirty}
      ref10={refs.thirtyone}
      ref11={refs.thirtytwo}
      ref12={refs.thirtythree}
      ref13={refs.thirtyfour}
      ref14={refs.thirtyfive}
      ref15={refs.thirtysix}
      ref16={refs.thirtyseven}
      ref17={refs.thirtyeigth}
      ref18={refs.thirtynine}
      ref19={refs.fourty}
      ref20={refs.fourtyone}
      ref21={refs.fourtytwo}
      ref22={refs.fourtythree}
      ref23={refs.fourtyfour}
      ref24={refs.fourtyfive}
      ref25={refs.fourtysix}
      ref26={refs.fourtyseven}
      ref27={refs.fourtynine}
      stepIndexTutorial={stepIndex}
    />
  );

  const initialFiles: FileItem[] = [
    {
      id: 1,
      name: "src",
      type: "folder",
      children: [{ id: 2, name: "Solution.py", type: "file" }],
    },
    { id: 4, name: "Tests.py", type: "file" },
  ];

  useLayoutEffect(() => {
    if (stepIndex === 19) {
      const id = window.setTimeout(() => {
        measureHole();
      }, 350);
      return () => window.clearTimeout(id);
    } else if (
      stepIndex === 5 ||
      stepIndex === 8 ||
      stepIndex === 4 ||
      stepIndex === 7
    ) {
      // delay measurement by 1ms
      const id = window.setTimeout(() => {
        measureHole();
      }, 0);
      return () => window.clearTimeout(id);
    } else if (stepIndex === 25 || stepIndex === 24) {
      // delay measurement by 1ms
      const id = window.setTimeout(() => {
        measureHole();
      }, 50);
      return () => window.clearTimeout(id);
    } else if (stepIndex === 28 || stepIndex === 27) {
      const id = window.setTimeout(() => {
        measureHole();
      }, 350);
      return () => window.clearTimeout(id);
    } else if (stepIndex === 35) {
      const id = window.setTimeout(() => {
        measureHole();
      }, 0);
      return () => window.clearTimeout(id);
    } else if (stepIndex === 41 || stepIndex === 42) {
      const id = window.setTimeout(() => {
        measureHole();
      }, 0);
      return () => window.clearTimeout(id);
    } else {
      // normal immediate measurement
      measureHole();
    }
  }, [stepIndex, selectedSection]);

  useLayoutEffect(() => {
    if (!holeRect || !modalRef.current) return;
    // measure modal BEFORE paint
    const r = modalRef.current.getBoundingClientRect();
    setModalSize({ width: r.width, height: r.height });
  }, [holeRect]);

  return (
    <div className={`slide-wrapper ${animateRightToLeft ? "slide-left" : ""}`}>
      <div className="container-main" ref={refs.first}>
        {/* Left Column */}
        <div
          className="left-column"
          ref={(el: HTMLDivElement | null) => {
            leftRef.current = el;
            if (el) {
              refs.second.current = el;
            }
          }}
          style={{
            width: `${layout.left}%`,
            ["--step-font-size" as any]: leftFontSize,
          }}
        >
          <StartLeft
            codeMap={codeMap}
            setCodeForFile={setCodeForFile}
            currentFile={currentFile}
            setCurrentFile={setCurrentFile}
            fileTree={fileTree}
            setFileTree={setFileTree}
            problemId={problemId}
            setProblemId={setProblemId}
            ref1={refs.third}
            ref2={refs.fourth}
            ref3={refs.fifth}
            ref4={refs.sixth}
            ref5={refs.seventh}
            ref6={refs.eigth}
            ref7={refs.nine}
            ref8={refs.ten}
            currentIndex={stepIndex}
            initialFiles={initialFiles}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </div>

        {/* First Divider */}
        <div className="divider" onMouseDown={startDragLeft} />

        {/* Middle Column */}
        <div className="middle-column" style={{ width: `${layout.middle}%` }}>
          <CodeProvider>
            <StartMiddle
              setHoveredStep={setHoveredStep}
              loading={loading}
              setLoading={setLoading}
              setFromEditor={setFromEditor}
              codeMap={codeMap}
              setCodeForFile={setCodeForFile}
              currentFile={currentFile}
              test={test}
              currentFileName={currentFileName}
              fileTree={fileTree}
              problemId={problemId}
              stepTree={stepTree}
              ref1={refs.eleven}
              ref2={refs.twelve}
              ref3={refs.thirteen}
              ref4={refs.fourteen}
              ref5={refs.fifthteen}
              ref6={refs.sixthteen}
              ref7={refs.seventeen}
              ref8={refs.eighteen}
              ref9={refs.twentyone}
              ref10={refs.twentytwo}
              ref11={refs.twentythree}
              ref12={refs.fourtyeigth}
              currentIndex={stepIndex}
            />
          </CodeProvider>
        </div>

        {/* Second Divider */}
        <div
          className="divider"
          onDoubleClick={handleRightDoubleClick}
          onMouseDown={startDragRight}
        />

        {/* Right Column */}

        <div
          className={`right-column`}
          ref={(el: HTMLDivElement | null) => {
            rightRef.current = el;
          }}
          style={{
            ["--step-font-size" as any]: rightFontSize,
            ["--right-width" as any]: `${layout.right}%`,
          }}
        >
          {startRightComponent}
        </div>

        <div className="container-tutorial-problem">
          <div className="Tutorial-Problem" onClick={startTutorial}>
            ?
          </div>
        </div>

        {holeRect && current && (
          <div
            className={`tutorial-overlay ${animate ? "with-anim" : "no-anim"}`}
          >
            {blocks.map((s, i) => (
              <div key={i} className="overlay-block" style={s} />
            ))}

            <div
              className={`overlay-hole ${
                stepIndex === 23 ? "hover-enabled" : ""
              }`}
              style={{
                top: holeRect.top,
                left: holeRect.left,
                width:
                  holeRect.width +
                  (stepIndex === 17 || stepIndex === 21 || stepIndex === 23
                    ? 10000000000
                    : 0),
                height: holeRect.height,
              }}
              onClick={() => go(stepIndex + 1, animate)}
            />

            <div
              ref={modalRef}
              className="tutorial-step-container"
              style={
                holeRect && current?.targetKey === "first"
                  ? {
                      position: "absolute",
                      top: holeRect.top + holeRect.height / 2,
                      left: holeRect.left + holeRect.width / 2,
                      transform: "translate(-50%, -50%)",
                    }
                  : { position: "absolute", top: modalTop, left: modalLeft }
              }
            >
              <X
                className="close-button-tutorial"
                onClick={cancelTutorial}
                size={20}
                style={{ position: "absolute", top: 5, right: 2 }}
              />
              <div className="tutorial-header">{current.title}</div>
              <div className="tutorial-progress-container">
                <div className="tutorial-progress-bar">
                  <div
                    className="tutorial-progress-fill"
                    style={{
                      width: `${
                        ((stepIndex +
                          (tutorialParam === "2" ? tutorialSteps.length : 0)) /
                          TOTAL_STEPS) *
                        100
                      }%`,
                    }}
                  >
                    <span className="tutorial-progress-number">
                      {stepIndex +
                        (tutorialParam === "2" ? tutorialSteps.length : 0)}
                    </span>
                  </div>
                  <span className="tutorial-progress-total">
                    / {TOTAL_STEPS}
                  </span>
                </div>
              </div>
              <div className="tutorial-content">
                <p>{current.content}</p>
              </div>
              <div className="tutorial-footer">
                <button
                  disabled={stepIndex === 1 && tutorialParam !== "2"}
                  onClick={() => {
                    if (tutorialParam === "2" && stepIndex === 1) {
                      localStorage.setItem(
                        "tutorialStep",
                        String(-1) // last Problem step
                      );

                      window.location.href = `${tutorialRoutes[0]}?tutorial=1`;
                    } else {
                      go(stepIndex - 1, animate);
                    }
                  }}
                >
                  Back
                </button>
                <button
                  className="skip-button-tutorial"
                  style={{ backgroundColor: "var(--dropdown-border)" }}
                  onClick={() => setAnimate((prev) => !prev)}
                >
                  {animate ? (
                    <X color={"red"} size={15} />
                  ) : (
                    <Check className="check-icon-tutorial" size={15} />
                  )}
                  Skip
                </button>
                <button onClick={() => go(stepIndex + 1, animate)}>
                  {stepIndex < TOTAL_STEPS ? "Next" : "Finish"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Start;
