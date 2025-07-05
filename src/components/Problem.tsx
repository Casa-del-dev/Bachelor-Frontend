import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Problem.css";
import Problem_left from "./Problem_left";
import Problem_details from "./Problem_detail";
import { Check, X } from "lucide-react";

import tutorialSteps from "./BuildingBlocks/TutorialStepsProblem";
import tutorialStepsStart from "./BuildingBlocks/TutorialStepsStart";
import { tutorialRoutes } from "./BuildingBlocks/TutorialRoutes";
import tutorialStepsAbstract from "./BuildingBlocks/TutorialStepsAbstract";
import CustomProblemOverlay, { OverlayData } from "./CustomProblemOverlay";

const SPACING = 10; // px between hole and modal

export interface ProblemPayload {
  id: string;
  name: string;
  description: string;
  defaultText: string;
  tests: string;
}

interface ProblemMeta {
  id: string;
  name: string;
  description: string;
}

export default function Problem() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const query = new URLSearchParams(search);
  const tutorialParam = query.get("tutorial");

  const [selectedProblem, setSelectedProblem] = useState<string>("");
  const [stepIndex, setStepIndex] = useState<number>(
    Number(localStorage.getItem("tutorialStep") || 0) // this localstorage serves as a fallback to when we are actually going back form the prev page
  );
  const [holeRect, setHoleRect] = useState<DOMRect | null>(null);
  const [animate, setAnimate] = useState<boolean>(true);

  const [customProblems, setCustomProblems] = useState<ProblemMeta[]>([]);

  useEffect(() => {
    async function fetchCustomProblems() {
      try {
        const resp = await fetch(
          "https://bachelor-backend.erenhomburg.workers.dev/customProblems/v1/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!resp.ok) {
          throw new Error(`Failed to load: ${await resp.text()}`);
        }

        const list = (await resp.json()) as ProblemMeta[];
        setCustomProblems(list);
      } catch (err) {
        console.error(err);
        // you could show an error banner here
      }
    }

    fetchCustomProblems();
  }, []);

  // 1) If the new URL *doesn't* have ?tutorial=1, wipe out any lingering tutorialStep
  useEffect(() => {
    if (tutorialParam !== "1" && stepIndex !== 0) {
      setStepIndex(0);
      localStorage.removeItem("tutorialStep");
    }
  }, [pathname, search]);

  // refs must match targetKey in tutorialSteps
  const refs = {
    first: useRef<HTMLDivElement>(null!),
    second: useRef<HTMLDivElement>(null!),
    third: useRef<HTMLDivElement>(null!),
    fourth: useRef<HTMLDivElement>(null!),
    fifth: useRef<HTMLButtonElement>(null!),
  };
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 });

  // persist/clear tutorialStep
  useEffect(() => {
    if (stepIndex > 0) localStorage.setItem("tutorialStep", String(stepIndex));
    else localStorage.removeItem("tutorialStep");
  }, [stepIndex]);

  // auto-start if arrived with ?tutorial=1
  useEffect(() => {
    if (tutorialParam === "1" && stepIndex <= 0) {
      setAnimate(true);
      setStepIndex(1);
    }
    if (tutorialParam === "1" && stepIndex === -1) {
      setAnimate(true);
      setStepIndex(5);
    }
  }, [tutorialParam]);

  const baseSteps = tutorialSteps.length;
  const urlSteps =
    tutorialParam === "1"
      ? tutorialStepsStart.length + baseSteps + tutorialStepsAbstract.length
      : baseSteps;
  const TOTAL_STEPS = urlSteps;
  const current = tutorialSteps[stepIndex - 1] || null;

  // measure the highlighted hole
  const measureHole = () => {
    if (current) {
      const r =
        refs[current.targetKey].current?.getBoundingClientRect() || null;
      setHoleRect(r);
    } else {
      setHoleRect(null);
    }
  };

  // measure the modal
  const measureModal = () => {
    if (modalRef.current) {
      const r = modalRef.current.getBoundingClientRect();
      setModalSize({ width: r.width, height: r.height });
    }
  };

  // re-measure when step changes
  useEffect(measureHole, [stepIndex]);
  useLayoutEffect(measureModal, [holeRect, stepIndex]);

  // on resize or scroll, disable anim + re-measure
  const animateRef = useRef(animate);
  // will store the animate value that needs to be restored
  const prevAnimateRef = useRef<boolean>(animate);
  // debounce timer id
  const resizeTimer = useRef<number | null>(null);

  // whenever animate changes for “real” (e.g. user clicked Skip, Next, etc):
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  // Disable animations & re-measure on resize/scroll
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

  // navigation handlers
  const start = () => {
    setAnimate(true);
    setStepIndex(1);
  };

  useLayoutEffect(() => {
    if (stepIndex === 1 && refs.first.current) {
      const el = refs.first.current;
      const rect = el.getBoundingClientRect();
      const scrollY =
        window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
      const scrollX =
        window.scrollX + rect.left - window.innerWidth / 2 + rect.width / 2;
      window.scrollTo({
        top: scrollY,
        left: scrollX,
        behavior: "smooth",
      });
    }
  }, [stepIndex]);

  // “Finish” by going to next page IN the full‐app tutorial
  const go = (idx: number, animated: boolean) => {
    setAnimate(animated);
    if (idx < 1 || idx > TOTAL_STEPS) {
      nextFinish();
    } else if (tutorialParam === "1" && idx > tutorialSteps.length) {
      nextFinish();
    } else {
      setStepIndex(idx);
    }
  };
  const nextFinish = () => {
    setStepIndex(0);
    if (tutorialParam === "1") {
      const idx = tutorialRoutes.indexOf(pathname);
      const next = tutorialRoutes[idx + 1] + "/Problem%201";

      if (next) window.location.href = `${next}?tutorial=2`;
    }
  };

  // “Cancel” just ends tutorial here & strips ?tutorial=1
  const cancelTutorial = () => {
    setStepIndex(0);
    localStorage.removeItem("tutorialStep");
    // navigate to same path but without any query
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
        go(stepIndex + 1, animate);
      } else if (e.key === "ArrowLeft" && inTutorial) {
        // same as clicking "Back"
        if (stepIndex !== 1) {
          go(stepIndex - 1, animate);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [stepIndex, go, cancelTutorial]);

  // overlay blocks around hole
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
          left: holeRect.right,
          width: `calc(100vw - ${holeRect.right}px)`,
          height: holeRect.height,
        },
      ]
    : [];

  // compute modal position with flip logic
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

    modalLeft = holeRect.right + SPACING;
    if (modalLeft + modalSize.width > window.innerWidth) {
      modalLeft = holeRect.left - SPACING - modalSize.width;
    }
    if (modalLeft < SPACING) modalLeft = SPACING;
  }

  const [tutorialPass, setTutorialPass] = useState<string>("");
  const [tutorialFinal, setTutorialFinal] = useState<boolean>(false);

  const handleCheckClick = () => {
    localStorage.setItem("selectedProblem", selectedProblem);
    localStorage.setItem("selectedSection", "Problem");
    setTutorialFinal(true);
  };

  useLayoutEffect(() => {
    if (!holeRect || !modalRef.current) return;
    // measure modal BEFORE paint
    const r = modalRef.current.getBoundingClientRect();
    setModalSize({ width: r.width, height: r.height });
  }, [holeRect]);

  //JUST THE RESIZING PART
  const containerRef = useRef<HTMLDivElement>(null);

  // load saved width or default to 215px
  const [leftWidth, setLeftWidth] = useState<number>(() => {
    const saved = localStorage.getItem("problemLayout");
    return saved ? Math.max(215, parseInt(saved, 10)) : 215;
  });

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // keep the grid in sync
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `${leftWidth}px 5px auto`,
  };

  // global mouse handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - startXRef.current;
      const newW = Math.max(215, startWidthRef.current + dx);
      setLeftWidth(newW);
      localStorage.setItem("problemLayout", newW.toString());
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // when you press down on the separator
  const onMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = leftWidth;
    e.preventDefault();
  };

  return (
    <div
      className="container-problem"
      ref={(el) => {
        if (refs.first && el !== null) refs.first.current = el;
        containerRef.current = el;
      }}
      style={gridStyle}
    >
      <Problem_left
        items={customProblems}
        onSelect={setSelectedProblem}
        firstRef={refs.second}
        secondRef={refs.third}
        tutorial={tutorialPass}
        tutorialPass={tutorialFinal}
        setOverlayOpen={setOverlayOpen}
        selectedProblem={selectedProblem}
      />

      <div className="container-separator-problem">
        <div className="custom-line" onMouseDown={onMouseDown} />
      </div>
      <div className="right-side-problem" ref={refs.fourth}>
        <Problem_details
          items={customProblems}
          selectedProblem={selectedProblem}
          refFirst={refs.fifth}
          setCustomProblems={setCustomProblems}
          setSelectedProblem={setSelectedProblem}
        />
      </div>

      <div className="container-tutorial-problem">
        <div className="Tutorial-Problem" onClick={start}>
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
            className="overlay-hole"
            style={{
              top: holeRect.top,
              left: holeRect.left,
              width: holeRect.width,
              height: holeRect.height,
            }}
            onClick={() => {
              if (stepIndex === 3) {
                setTutorialPass("Problem 1");
              } else if (stepIndex === 5) {
                handleCheckClick();
              }
              go(stepIndex + 1, animate);
            }}
          />

          <div
            ref={modalRef}
            className="tutorial-step-container"
            style={
              holeRect && current?.targetKey === "first"
                ? {
                    position: "absolute",
                    // position at hole center:
                    top: holeRect.top + holeRect.height / 2,
                    left: holeRect.left + holeRect.width / 2,
                    // shift back by half the modal's size
                    transform: "translate(-50%, -50%)",
                  }
                : {
                    position: "absolute",
                    top: modalTop,
                    left: modalLeft,
                  }
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
                  style={{ width: `${(stepIndex / TOTAL_STEPS) * 100}%` }}
                >
                  <span className="tutorial-progress-number">{stepIndex}</span>
                </div>
                <span className="tutorial-progress-total">/ {TOTAL_STEPS}</span>
              </div>
            </div>
            <div className="tutorial-content">
              <div>{current.content}</div>
            </div>
            <div className="tutorial-footer">
              <button
                disabled={stepIndex === 1}
                onClick={() => go(stepIndex - 1, animate)}
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
              <button
                onClick={() => {
                  if (stepIndex === 3) {
                    setTutorialPass("Problem 1");
                  } else if (stepIndex === 5) {
                    handleCheckClick();
                  }
                  go(stepIndex + 1, animate);
                }}
              >
                {stepIndex < TOTAL_STEPS ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        </div>
      )}
      <CustomProblemOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onSubmit={async (data: OverlayData) => {
          // 1) Generate an ID
          const id = crypto.randomUUID();
          const problemWithId: ProblemPayload = { id, ...data };

          console.log(problemWithId);

          try {
            const resp = await fetch(
              "https://bachelor-backend.erenhomburg.workers.dev/customProblems/v1/save",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(problemWithId),
              }
            );

            if (!resp.ok) {
              const err = await resp.text();
              console.error("Failed to save problem:", err);
              alert("Could not save problem: " + err);
              return;
            }

            const { id: savedId } = await resp.json();

            setCustomProblems((prev) => [
              ...prev,
              { id: savedId, name: data.name, description: data.description },
            ]);

            setSelectedProblem(savedId);

            setOverlayOpen(false);
          } catch (e) {
            console.error("Error saving custom problem", e);
            alert("Unexpected error saving problem");
          }
        }}
        initialData={{
          name: "",
          description: "",
          defaultText: "",
          tests: "",
        }}
      />
    </div>
  );
}
