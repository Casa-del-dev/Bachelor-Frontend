import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AbstractionOverlay.css";
import {
  Check,
  Hash,
  LayoutTemplate,
  Lightbulb,
  Pen,
  SquarePlus,
  Trash,
  X,
} from "lucide-react";
import CustomLightbulb from "./BuildingBlocks/Custom-Lightbulb";
import apiCallCheckAbstraction from "./AI_EqualityCheck";
import GradientSpinner from "./BuildingBlocks/GradientSpinner";

const abstractionInbetweenTutorial: Step[] = [
  {
    id: "step-0001",
    code: "",
    content: "Parent Step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "",
    detailed_hint: "",
    children: [
      {
        id: "step-0002",
        code: "",
        content: "Child Step 1",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "",
        detailed_hint: "",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0003",
        code: "",
        content: "Child Step 2",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "",
        detailed_hint: "",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0004",
        code: "",
        content: "Child Step 3",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "",
        detailed_hint: "",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0005",
        code: "",
        content: "Child Step 4",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "",
        detailed_hint: "",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
    ],
    hasparent: false,
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: true,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];
const abstractionInbetweenTutorial2: Step[] = [
  {
    id: "step-0001",
    code: "",
    content: "Parent Step",
    correctStep: "a",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "a",
    detailed_hint: "a",
    children: [
      {
        id: "step-0002",
        code: "",
        content: "Child Step 1",
        correctStep: "a",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "a",
        detailed_hint: "a",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0003",
        code: "",
        content: "Child Step 2",
        correctStep: "a",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "a",
        detailed_hint: "a",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0004",
        code: "",
        content: "Child Step 3",
        correctStep: "a",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "a",
        detailed_hint: "a",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
      {
        id: "step-0005",
        code: "",
        content: "Child Step 4",
        correctStep: "a",
        prompt: "",
        status: {
          correctness: "",
          can_be_further_divided: "",
        },
        general_hint: "a",
        detailed_hint: "a",
        children: [],
        hasparent: true,
        isDeleting: false,
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: true,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
    ],
    hasparent: false,
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: true,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const BASE =
  "https://bachelor-backend.erenhomburg.workers.dev/abstractionInbetween/v1";

export async function saveAbstractionInbetween(
  problemId: string,
  abstractionId: string,
  steps: Step[],
  isAvailable: boolean,
  allIsAvailable: boolean,
  allIsHinted: boolean
): Promise<void> {
  if (localStorage.getItem("tutorialStep")) return;
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  await fetch(
    `${BASE}/saveAbstraction?problemId=${encodeURIComponent(
      problemId
    )}&abstractionId=${encodeURIComponent(abstractionId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ steps, isAvailable, allIsAvailable, allIsHinted }),
    }
  ).then((res) => {
    if (!res.ok) throw new Error(res.statusText);
  });
}

interface CorrectStepOverlayProps {
  onClose: () => void;
  onConfirm: () => void;
  saveChecked: boolean;
  setSaveChecked: (val: boolean) => void;
}

const CorrectStepOverlay: React.FC<CorrectStepOverlayProps> = ({
  onClose,
  onConfirm,
  saveChecked,
  setSaveChecked,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [fadeState, setFadeState] = useState("fade-in-correctStep"); // Initial fade-in

  // Handle fade-out before closing
  const handleClose = () => {
    setFadeState("fade-out-correctStep");
    setTimeout(() => onClose(), 300); // Delay removal after fade-out
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        handleClose(); // Trigger fade-out
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`fullscreen-overlay ${fadeState}`}>
      <div className="overlay-box" ref={overlayRef}>
        <h3>Are you sure you want to reveal the correct step?</h3>
        <label className="mini-overlay-save">
          <input
            type="checkbox"
            checked={saveChecked}
            onChange={() => setSaveChecked(!saveChecked)}
          />
          Save this answer for future
        </label>
        <div className="overlay-buttons">
          <button className="overlay-button yes" onClick={onConfirm}>
            Yes, Reveal
          </button>
          <button className="overlay-button no" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CHILD_EXTRA_MARGIN_PX = 60;

function getPageZoom(): number {
  return Math.round(window.devicePixelRatio * 100);
}

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
    const p1 = points[i],
      p2 = points[i + 1];
    if (percent >= p1.percent && percent <= p2.percent) {
      const t = (percent - p1.percent) / (p2.percent - p1.percent);
      return p1.value + t * (p2.value - p1.value);
    }
  }
  if (percent < points[0].percent) return points[0].value;
  if (percent > points[points.length - 1].percent)
    return points[points.length - 1].value;
  return 0;
}

function calculateTreeWidth(node: Step): number {
  const STEP_BOX_WIDTH_PX = 300 + 36;
  const zoomPercent = getPageZoom();
  const modifier = interpolateZoomEffect(zoomPercent);
  if (node.children.length === 0) {
    return STEP_BOX_WIDTH_PX + modifier;
  }
  const childWidths = node.children.map(calculateTreeWidth);
  const totalChildWidth =
    childWidths.reduce((sum, w) => sum + w, 0) +
    (node.children.length - 1) * CHILD_EXTRA_MARGIN_PX;
  return totalChildWidth;
}

interface InsertTarget {
  path: number[];
  index: number;
  dropX?: number;
}

interface AbstractionItem {
  id: string;
  steps: { id: string }[][]; // array of arrays of `{ id: string }`
  correct_answer: {
    stepsTree: {
      [key: string]: {
        content: string;
        general_hint: string;
        detailed_hint: string;
        substeps: Record<string, any>;
      };
    };
  };
}

interface AbstractionItemOriginal {
  id: string;
  steps: { id: string }[][];
  correct_answer: {
    stepsTree: Record<string, StepNode>;
  };
}
interface StepNode {
  content: string;
  general_hint: string;
  detailed_hint: string;
  substeps: Record<string, StepNode>;
}

interface AbstractionOverlayProps {
  saveAbstraction: any;
  originalAbstraction: AbstractionItemOriginal[];
  originalSetAbstraction: React.Dispatch<
    React.SetStateAction<AbstractionItemOriginal[]>
  >;
  originalSteps: Step[];
  originalSetSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  onClose: () => void;
  abstraction: AbstractionItem | null;
  abstractionToSteps: Record<string, string[][]>;
  stepLabels: string[];
  getType: "Group" | "Recycle";
  saveOriginalStepTree: any;
  ref1: React.RefObject<HTMLDivElement>;
  ref2: React.RefObject<HTMLDivElement>;
  ref3: React.RefObject<HTMLDivElement>;
  ref4: React.RefObject<HTMLDivElement>;
  ref5: React.RefObject<HTMLDivElement>;
  ref6: React.RefObject<HTMLDivElement>;
  ref7: React.RefObject<HTMLDivElement>;
  ref8: React.RefObject<HTMLDivElement>;
  ref9: React.RefObject<HTMLDivElement>;
  ref10: React.RefObject<HTMLDivElement>;
  ref11: React.RefObject<HTMLDivElement>;
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface Step {
  id: string;
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
  isGhost?: boolean;
  selected: boolean;
}

export async function loadAbstractionInbetween(
  problemId: string,
  abstractionId: string
): Promise<{
  steps: Step[];
  isAvailable: boolean;
  allIsAvailable: boolean;
  allIsHinted: boolean;
}> {
  if (localStorage.getItem("tutorialStep")) {
    return {
      steps: [],
      isAvailable: false,
      allIsAvailable: false,
      allIsHinted: false,
    };
  }
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${BASE}/loadAbstraction?problemId=${encodeURIComponent(
      problemId
    )}&abstractionId=${encodeURIComponent(abstractionId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (res.status === 204) {
    // no content yet, return defaults
    return {
      steps: [],
      isAvailable: true,
      allIsAvailable: true,
      allIsHinted: true,
    };
  }
  if (!res.ok) throw new Error(res.statusText);

  return await res.json();
}

export async function deleteAbstractionInbetween(
  problemId: string,
  abstractionId: string
): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${BASE}/deleteAbstraction?problemId=${encodeURIComponent(
      problemId
    )}&abstractionId=${encodeURIComponent(abstractionId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete abstraction: ${res.statusText}`);
  }
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

const AbstractionOverlay: React.FC<AbstractionOverlayProps> = ({
  saveAbstraction,
  originalAbstraction,
  originalSetAbstraction,
  originalSteps,
  originalSetSteps,
  onClose,
  abstraction,
  abstractionToSteps,
  stepLabels,
  getType,
  saveOriginalStepTree,
  ref1,
  ref2,
  ref3,
  ref4,
  ref5,
  ref6,
  ref7,
  ref8,
  ref9,
  ref10,
  ref11,
  stepIndex,
  setStepIndex,
}) => {
  const problemId = localStorage.getItem("selectedProblem")!;
  const abstractionId = abstraction?.id!;

  // Pan & zoom refs and state
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const zoomContentRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialCentering = useRef(true);

  const [transform, setTransform] = useState<{
    scale: number;
    x: number;
    y: number;
  }>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const transformRef = useRef(transform);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  useEffect(() => {
    if (zoomContentRef.current) {
      zoomContentRef.current.style.setProperty(
        "--scale",
        transform.scale.toString()
      );
    }
  }, [transform.scale]);

  // Drag new step state
  const [draggingNew, setDraggingNew] = useState(false);
  const [blankStep, setBlankStep] = useState<Step | null>(null);
  const blankStepRef = useRef<Step | null>(null);
  const [insertTarget, setInsertTarget] = useState<InsertTarget | null>(null);
  const insertTargetRef = useRef<InsertTarget | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const snapPointsRef = useRef<
    {
      path: number[];
      left: number;
      right: number;
      mid: number;
      top: number;
      bottom: number;
    }[]
  >([]);

  const loadedRefSteps = useRef(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean>();
  const [allIsAvailable, setAllIsAvailable] = useState<boolean>();
  const [allIsHinted, setAllIsHinted] = useState<boolean>();

  useEffect(() => {
    loadedRefSteps.current = false;
    setSteps([]);

    loadAbstractionInbetween(problemId, abstractionId)
      .then(
        ({
          steps,
          isAvailable: backendAvailable = true,
          allIsAvailable: backendAllAvail = true,
          allIsHinted: backendAllHinted = true,
        }) => {
          setSteps(steps);
          setIsAvailable(backendAvailable);
          setAllIsAvailable(backendAllAvail);
          setAllIsHinted(backendAllHinted);
        }
      )
      .catch(console.error)
      .finally(() => {
        loadedRefSteps.current = true;
      });
  }, [problemId, abstractionId]);

  const stepsRef = useRef<Step[]>(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    if (initialCentering.current && steps.length > 0) {
      const firstItem = document.querySelector(
        ".map-abstract-container-overlay"
      );
      if (firstItem) {
        firstItem.scrollIntoView({
          behavior: "auto", // or "smooth" if you want an animation
          inline: "center", // horizontally center the tree
          block: "nearest", // don't scroll vertically
        });
      }
      initialCentering.current = false;
    }
  }, [steps]);

  function StepLabels({ stepLabels }: { stepLabels: string[] }) {
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => {
        setVisible(true);
      }, 500);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(false);
      setFadeIn(false);
    };

    useEffect(() => {
      if (visible) {
        // wait one frame to trigger the animation
        requestAnimationFrame(() => setFadeIn(true));
      }
    }, [visible]);

    return (
      <div
        className="step-labels-container-abstractionOverlay"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) =>
          setTooltipPos({ x: e.clientX + 10, y: e.clientY + 10 })
        }
      >
        {stepLabels.join(", ")}

        {visible && (
          <div
            className={`custom-tooltip-abstractionOverlay ${
              fadeIn ? "fade-in-abstractionOverlay" : ""
            }`}
            style={{
              top: tooltipPos.y,
              left: tooltipPos.x,
            }}
          >
            {stepLabels.map((label, i) => (
              <div key={i}>{label}</div>
            ))}
          </div>
        )}
      </div>
    );
  }
  const editingRef = useRef(false);

  // Pan and zoom effect
  useEffect(() => {
    if (draggingNew) return;
    const container = mainContainerRef.current!;
    const content = zoomContentRef.current!;
    const DRAG_SPEED = 1.4;
    const DRAG_THRESHOLD = 5;
    let dragReady = false;
    let dragging = false;
    let startX = 0,
      startY = 0;
    let lastX = 0,
      lastY = 0;
    let rafId: number | null = null;

    container.style.touchAction = "none";
    container.style.userSelect = "none";
    content.style.willChange = "transform";

    function applyTransform() {
      const { x, y, scale } = transformRef.current;
      content.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      rafId = null;
    }
    function scheduleUpdate() {
      if (rafId == null) rafId = requestAnimationFrame(applyTransform);
    }

    const onPointerDown = (e: PointerEvent) => {
      if (
        editingRef.current &&
        textareaRef.current &&
        textareaRef.current.contains(e.target as Node)
      )
        return;

      dragReady = true;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragReady) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        dragging = true;
        container.setPointerCapture(e.pointerId);
        container.style.cursor = "grabbing";
      }
      if (dragging) {
        const moveX = e.clientX - lastX;
        const moveY = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        transformRef.current.x += moveX * DRAG_SPEED;
        transformRef.current.y += moveY * DRAG_SPEED;
        scheduleUpdate();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      dragReady = false;
      if (dragging) {
        dragging = false;
        container.releasePointerCapture(e.pointerId);
        container.style.cursor = "default";
        setTransform({ ...transformRef.current });
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const old = transformRef.current;
      const newScale = clamp(old.scale * factor, MIN_ZOOM, MAX_ZOOM);

      transformRef.current.x = mx - (mx - old.x) * (newScale / old.scale);
      transformRef.current.y = my - (my - old.y) * (newScale / old.scale);
      transformRef.current.scale = newScale;

      scheduleUpdate();
      setTransform({ ...transformRef.current });

      const el = zoomContentRef.current!;
      el.style.display = "none";
      void el.offsetHeight;
      el.style.display = "";
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove, {
      passive: false,
    });
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [draggingNew, editingRef.current]);

  function cleanupDrag() {
    document.removeEventListener("pointermove", onDrag);
    document.removeEventListener("pointerup", onDrop);
    document.removeEventListener("keydown", onKeyDown);
    blankStepRef.current = null;
    insertTargetRef.current = null;
    setDraggingNew(false);
    setBlankStep(null);
    setInsertTarget(null);
  }
  // Drag and drop handlers
  function startNewStepDrag(e: React.PointerEvent) {
    if (!allIsAvailable) return;
    e.preventDefault();
    const el = e.currentTarget as Element;
    el.setPointerCapture(e.pointerId);

    const newBlank = createBlankStep(true);
    blankStepRef.current = newBlank;
    setBlankStep(newBlank);
    setDraggingNew(true);

    setNumberOfNeededSteps((prev) => (prev ? prev - 1 : prev));

    setGhostPos({ x: e.clientX, y: e.clientY });

    document.addEventListener("pointermove", onDrag);
    document.addEventListener("pointerup", onDrop);
    document.addEventListener("keydown", onKeyDown);

    // ✅ CASE 1 — empty tree: set insert target directly
    if (stepsRef.current.length === 0) {
      const emptyTarget = { path: [], index: 0, dropX: e.clientX };
      insertTargetRef.current = emptyTarget;
      setInsertTarget(emptyTarget);
      return;
    }

    // ✅ CASE 2 — non-empty: just build snap points, don’t set insert target yet
    const container = zoomContentRef.current!;
    const boxes = Array.from(
      container.querySelectorAll<HTMLElement>(".tree-node-ab")
    );
    snapPointsRef.current = boxes.map((box) => {
      const root = box.closest(".tree-root-item")!;
      const path = root.id
        .replace(/^step-/, "")
        .split("-")
        .map((n) => parseInt(n, 10));
      const r = box.getBoundingClientRect();
      return {
        path,
        left: r.left,
        right: r.right,
        mid: r.left + r.width / 2,
        top: r.top,
        bottom: r.bottom,
      };
    });

    // ❌ DO NOT set insertTarget for non-empty tree!
    insertTargetRef.current = null;
    setInsertTarget(null);
  }

  useEffect(() => {
    if (!loadedRefSteps.current) return;
    if (!problemId || !abstractionId) return;
    if (
      isAvailable === undefined ||
      allIsAvailable === undefined ||
      allIsHinted === undefined
    )
      return;

    saveAbstractionInbetween(
      problemId,
      abstractionId,
      steps,
      isAvailable,
      allIsAvailable,
      allIsHinted
    );
  }, [
    steps,
    isAvailable,
    allIsAvailable,
    allIsHinted,
    problemId,
    abstractionId,
  ]);

  const SNAP_THRESHOLD = 100;
  const VERTICAL_THRESHOLD = SNAP_THRESHOLD;

  function getPreviewSteps(): Step[] {
    if (!draggingNew || !insertTarget || !blankStep) return steps;

    // deep-clone only once
    const treeCopy = JSON.parse(JSON.stringify(steps)) as Step[];

    // if inserting at root level:
    if (insertTarget.path.length === 0) {
      treeCopy.splice(insertTarget.index, 0, blankStep);
      return treeCopy;
    }

    // otherwise drill into the right children array
    let siblings = treeCopy;
    for (const p of insertTarget.path) {
      siblings = siblings[p].children;
    }
    siblings.splice(insertTarget.index, 0, blankStep);
    return treeCopy;
  }

  const onDrag = useCallback((e: PointerEvent) => {
    setGhostPos({ x: e.clientX, y: e.clientY });

    if (stepsRef.current.length === 0) {
      return;
    }

    // 1) Try “add first child to a leaf” under ANY node with no children
    for (const pt of snapPointsRef.current) {
      // walk down the tree to find that node
      let nodeList = stepsRef.current;
      let node: Step | undefined;
      for (const idx of pt.path) {
        node = nodeList[idx];
        nodeList = node.children;
      }
      if (!node) continue;
      // if it’s a leaf...
      if (
        node &&
        node.children.length === 0 &&
        // vertically just below
        e.clientY > pt.bottom &&
        e.clientY < pt.bottom + VERTICAL_THRESHOLD &&
        // within ±25px of its midpoint
        Math.abs(e.clientX - pt.mid) <= 25
      ) {
        const leafTarget: InsertTarget = {
          path: [...pt.path],
          index: 0, // first child slot
          dropX: pt.mid, // for your horizontal-threshold check
        };
        insertTargetRef.current = leafTarget;
        setInsertTarget(leafTarget);
        return; // skip everything else
      }
    }

    // 2) FALL BACK to your existing sibling/root hit-test
    type Hit = { target: InsertTarget; dist2: number };
    const hits: Hit[] = [];

    for (const pt of snapPointsRef.current) {
      const isChild = pt.path.length > 1;

      // vertical eligibility
      let vertOK: boolean;
      if (isChild) {
        const under =
          e.clientY > pt.bottom && e.clientY < pt.bottom + VERTICAL_THRESHOLD;
        const overlap =
          e.clientY >= pt.top - VERTICAL_THRESHOLD &&
          e.clientY <= pt.bottom + VERTICAL_THRESHOLD;
        vertOK = under || overlap;
      } else {
        vertOK =
          e.clientY >= pt.top - VERTICAL_THRESHOLD &&
          e.clientY <= pt.bottom + VERTICAL_THRESHOLD;
      }
      if (!vertOK) continue;

      // build the three “slots” (center, right‐edge, left‐edge)
      const slots: {
        x: number;
        y: number;
        build: (dropX: number) => InsertTarget;
      }[] = [];

      if (isChild) {
        const parentPath = pt.path.slice(0, -1);
        const idx = pt.path[pt.path.length - 1];
        slots.push(
          {
            x: pt.mid,
            y: pt.bottom,
            build: (dropX) => ({ path: parentPath, index: idx, dropX }),
          },
          {
            x: pt.right,
            y: pt.bottom,
            build: (dropX) => ({ path: parentPath, index: idx + 1, dropX }),
          },
          {
            x: pt.left,
            y: pt.bottom,
            build: (dropX) => ({ path: parentPath, index: idx, dropX }),
          }
        );
      } else {
        const rootIdx = pt.path[0];
        const slotY = (pt.top + pt.bottom) / 2;
        slots.push(
          {
            x: pt.mid,
            y: slotY,
            build: (dropX) => ({ path: [], index: rootIdx, dropX }),
          },
          {
            x: pt.right,
            y: slotY,
            build: (dropX) => ({ path: [], index: rootIdx + 1, dropX }),
          },
          {
            x: pt.left,
            y: slotY,
            build: (dropX) => ({ path: [], index: rootIdx, dropX }),
          }
        );
      }

      // for each slot, if within thresholds, record its squared distance
      for (const { x, y, build } of slots) {
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        if (
          Math.abs(dx) <= SNAP_THRESHOLD &&
          Math.abs(dy) <= VERTICAL_THRESHOLD
        ) {
          hits.push({
            target: build(x),
            dist2: dx * dx + dy * dy,
          });
        }
      }
    }

    // 3) of all hits, pick the closest
    if (hits.length > 0) {
      hits.sort((a, b) => a.dist2 - b.dist2);
      const found = hits[0].target;
      insertTargetRef.current = found;
      setInsertTarget(found);
    } else {
      insertTargetRef.current = null;
      setInsertTarget(null);
    }
  }, []);

  const onDrop = (e: PointerEvent) => {
    document.removeEventListener("pointermove", onDrag);
    document.removeEventListener("pointerup", onDrop);
    document.removeEventListener("keydown", onKeyDown);
    setDraggingNew(false);
    setGhostPos(null);

    if (
      stepsRef.current.length === 0 &&
      blankStepRef.current &&
      insertTargetRef.current
    ) {
      // grab the blank step, strip isGhost
      const blank = blankStepRef.current;
      const { isGhost, ...rest } = blank;

      // insert exactly that rest (no ghost flag)
      const realStep = {
        ...rest,
        isNewlyInserted: true,
        selected: false,
      };

      // set + save
      setSteps([realStep]);
      /*       saveStepTree([realStep]);
       */
      return cleanupDrag();
    }

    const blank = blankStepRef.current;
    const target = insertTargetRef.current;
    if (!blank || !target) return cleanupDrag();

    // if it’s a root‐mode drop, cancel when too far sideways
    if (
      target.dropX != null &&
      Math.abs(e.clientX - target.dropX) > SNAP_THRESHOLD
    ) {
      return cleanupDrag();
    }

    setSteps((prev) => {
      const newTree = JSON.parse(JSON.stringify(prev)) as Step[];
      const { isGhost, ...rest } = blank!;
      const realStep = { ...rest, isNewlyInserted: true, selected: false };

      // pick siblings array (root or child)
      // pick siblings array (root or child), by walking the entire path
      let siblings: Step[] = newTree;
      for (const idx of target.path) {
        siblings = siblings[idx].children;
      }

      // splice in at the computed index
      const idx = target.index ?? siblings.length;
      siblings.splice(idx, 0, realStep);

      /*       saveStepTree(newTree);
       */ return newTree;
    });

    cleanupDrag();
  };

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // cleanup
      cleanupDrag();
      recalcNumberOfNeeded();
    }
  }, []);

  function createBlankStep(Selected: boolean, isGhost: boolean = true): Step {
    return {
      id: `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      code: "",
      content: "New Step",
      correctStep: "",
      prompt: "",
      status: { correctness: "", can_be_further_divided: "" },
      general_hint: "",
      detailed_hint: "",
      hasparent: false,
      children: [],
      isDeleting: false,
      showGeneralHint1: false,
      showDetailedHint1: false,
      showCorrectStep1: false,
      showGeneralHint2: false,
      showDetailedHint2: false,
      isNewlyInserted: true,
      isexpanded: true,
      isHyperExpanded: false,
      isGhost: isGhost,
      selected: Selected,
    };
  }

  function getBackgroundColor(step: Step): string {
    if (
      step.status.correctness === "" &&
      step.status.can_be_further_divided === ""
    )
      return "#ffffff";
    if (
      step.status.can_be_further_divided === "can" &&
      step.status.correctness === "correct"
    )
      return "#add8e6";
    if (step.status.correctness === "correct") return "#60e660";
    if (step.status.correctness === "incorrect") return "#ff6363";
    return "#ffffff";
  }

  function getStepBoxColor(step: Step): string {
    if (
      step.code !== "" &&
      step.code !== "// keep as input" &&
      step.status.correctness !== "" &&
      step.status.can_be_further_divided !== ""
    ) {
      if (
        step.status.can_be_further_divided === "can" &&
        step.status.correctness === "correct"
      ) {
        return "#add8e6";
      }
      if (step.status.correctness === "incorrect") {
        return "#ff6363";
      }
      return "#008000";
    }

    return getBackgroundColor(step);
  }

  function getStepBoxTextColor(step: Step): string {
    if (
      step.code !== "" &&
      step.code !== "// keep as input" &&
      step.status.correctness !== "" &&
      step.status.can_be_further_divided !== ""
    ) {
      if (
        step.status.can_be_further_divided === "can" &&
        step.status.correctness === "correct"
      ) {
        return "black";
      }
      if (step.status.correctness === "incorrect") {
        return "black";
      }
      return "white";
    }

    return "black";
  }

  function getBorder(step: Step): string {
    if (step.status.correctness === "missing") return "dashed";
    return "solid";
  }

  /* ICON FUNCTIONS START */

  function getNumberForStep(step: Step): number | null {
    if (step.general_hint && step.detailed_hint && step.correctStep) {
      if (step.showGeneralHint1) {
        if (step.showGeneralHint1 && step.showDetailedHint1) {
          if (
            step.showGeneralHint1 &&
            step.showDetailedHint1 &&
            step.showCorrectStep1
          ) {
            return null;
          } else {
            return 1;
          }
        } else {
          return 2;
        }
      } else {
        return 3;
      }
    } else if (step.general_hint && step.correctStep) {
      if (step.showGeneralHint1) {
        if (step.showGeneralHint1 && step.showCorrectStep1) {
          return null;
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    } else if (step.detailed_hint && step.correctStep) {
      if (step.showDetailedHint1) {
        if (step.showDetailedHint1 && step.showCorrectStep1) {
          return null;
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    } else if (step.general_hint && step.detailed_hint) {
      if (step.showGeneralHint1) {
        if (step.showGeneralHint1 && step.showDetailedHint1) {
          return null;
        } else {
          return 1;
        }
      } else {
        return 2;
      }
    } else if (step.correctStep) {
      if (step.showCorrectStep1) {
        step.correctStep = "";
        return null;
      } else {
        return null;
      }
    }

    return null;
  }

  const [justUnlockedHintId, setJustUnlockedHintId] = useState<string | null>(
    null
  );
  const [showCorrectStepOverlay, setShowCorrectStepOverlay] = useState<
    number[] | null
  >(null);
  const [saveCorrectStep, setSaveCorrectStep] = useState(false);

  function handleGiveHint(path: number[], hintNumber: number | null) {
    if (hintNumber === null) return;

    const saved = localStorage.getItem("savedCorrectSteps") === "true";

    // otherwise, general/detailed hints
    updateSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      const step = current[stepIndex];
      if (step.general_hint && step.detailed_hint && step.correctStep) {
        if (hintNumber === 3) step.showGeneralHint1 = true;
        else if (hintNumber === 2) step.showDetailedHint1 = true;
        else if (hintNumber === 1) {
          if (saved === true) {
            revealCorrectStep(path);
          } else {
            setShowCorrectStepOverlay(path);
          }
        }
      } else if (step.general_hint && step.detailed_hint) {
        if (hintNumber === 2) step.showGeneralHint1 = true;
        else if (hintNumber === 1) step.showDetailedHint1 = true;
      } else if (step.general_hint && step.correctStep) {
        if (hintNumber === 2) step.showGeneralHint1 = true;
        else if (hintNumber === 1) {
          if (saved === true) {
            revealCorrectStep(path);
          } else {
            setShowCorrectStepOverlay(path);
          }
        }
      } else if (step.detailed_hint && step.correctStep) {
        if (hintNumber === 2) step.showDetailedHint1 = true;
        else if (hintNumber === 1) {
          if (saved === true) {
            revealCorrectStep(path);
          } else {
            setShowCorrectStepOverlay(path);
          }
        }
      }

      return newSteps;
    });

    const stepId = `step-${path.join("-")}-${hintNumber}`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  function revealCorrectStep(path: number[]) {
    updateSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      current[stepIndex].showCorrectStep1 = true;
      current[stepIndex].status.correctness = "correct";
      current[stepIndex].status.can_be_further_divided = "cannot";
      current[stepIndex].content = current[stepIndex].correctStep; // Overwrite content

      setTimeout(() => {
        current[stepIndex].correctStep = "";
      }, 0);

      return newSteps;
    });
    const stepId = `step-${path.join("-")}-correct`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  function updateSteps(updater: Step[] | ((prev: Step[]) => Step[])) {
    setSteps((prev) => {
      const updated = typeof updater === "function" ? updater(prev) : updater;
      /*           saveStepTree(updated); // Save the freshly updated tree
       */ return updated;
    });
  }

  function handleGiveCorrectStep(checked: string) {
    if (!showCorrectStepOverlay) return;
    // reveal correct
    revealCorrectStep(showCorrectStepOverlay);

    // save?
    if (checked === "true") {
      localStorage.setItem("savedCorrectSteps", "true");
    }

    setShowCorrectStepOverlay(null);
    // done
    setTimeout(() => {
      setSaveCorrectStep(false);
    }, 300);
  }

  const hintKeys = {
    general: "showGeneralHint2",
    detailed: "showDetailedHint2",
  } as const;

  function toggleHint(type: "general" | "detailed", stepId: string) {
    const key = hintKeys[type];

    function updateStepHints(steps: Step[]): Step[] {
      return steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            [key]: !step[key],
          };
        } else if (step.children && step.children.length > 0) {
          return {
            ...step,
            children: updateStepHints(step.children),
          };
        } else {
          return step;
        }
      });
    }

    updateSteps((prevSteps) => updateStepHints(prevSteps));
  }

  function Collapsible({
    isOpen,
    children,
    id,
    toggleHint,
    stepId,
    what,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    id?: string;
    toggleHint: (type: "general" | "detailed", stepId: string) => void;
    stepId: string;
    what: "general" | "detailed";
  }) {
    const ref = useRef<HTMLDivElement | null>(null);

    return (
      <div
        ref={ref}
        id={id}
        className={`hint-block-ab ${isOpen ? "open" : ""}`}
        onClick={() => toggleHint(what, stepId)}
      >
        {children}
      </div>
    );
  }
  const handleRemoveStep = (id: string) => {
    updateSteps((prevSteps) =>
      prevSteps.map((step) => markStepAndChildrenAsDeleting(step, id))
    );

    setTimeout(() => {
      updateSteps((prevSteps) => {
        const newSteps = removeStepById(prevSteps, id);
        /*             saveStepTree(newSteps);
         */ return newSteps;
      });
    }, 300);
  };

  //added this beacuse one time when deleting it didn't delete the step but only marked it as deleting
  function removeDeletingSteps(steps: Step[]): Step[] {
    return steps
      .filter((step) => !step.isDeleting)
      .map((step) => ({
        ...step,
        children: removeDeletingSteps(step.children),
      }));
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSteps((prev) => {
        const filtered = removeDeletingSteps(prev);
        /*             saveStepTree(filtered);
         */ return filtered;
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  function markStepAndChildrenAsDeleting(step: Step, id: string): Step {
    if (step.id === id) {
      return {
        ...step,
        isDeleting: true,
        children: step.children.map((child) => ({
          ...child,
          isDeleting: true,
        })),
      };
    }
    return {
      ...step,
      children: step.children.map((child) =>
        markStepAndChildrenAsDeleting(child, id)
      ),
    };
  }

  function removeStepById(steps: Step[], id: string): Step[] {
    return steps.reduce<Step[]>((acc, step) => {
      if (step.id === id) return acc; // skip
      const newStep = { ...step };
      if (newStep.children && newStep.children.length > 0) {
        newStep.children = removeStepById(newStep.children, id);
      }
      acc.push(newStep);
      return acc;
    }, []);
  }

  /* ICON FUNCTIONS END */

  const [editingPath, setEditingPath] = useState<number[] | null>(null);
  const [tempContent, setTempContent] = useState("");

  //disable pan zoom handler
  useEffect(() => {
    editingRef.current = editingPath !== null;
  }, [editingPath]);

  useEffect(() => {
    if (!editingPath) return;
    const textarea = textareaRef.current;
    if (textarea) {
      const len = textarea.value.length;
      textarea.setSelectionRange(len, len);
      textarea.focus();
    }
  }, [editingPath]);

  // focus on the right step
  useEffect(() => {
    if (editingPath && mapContainerRef.current) {
      const id = editingPath.join("-");
      const el = mapContainerRef.current.querySelector<HTMLElement>(
        `#step-${id}`
      );
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "start",
        });
      }
    }
  }, [editingPath]);

  //center while editing still not working

  // 2) Your handlers (you already have these—just include them inside Abstract):
  function handleStartEditing(path: number[], initialValue: string) {
    const isSame =
      editingPath &&
      editingPath.length === path.length &&
      editingPath.every((v, i) => v === path[i]);

    if (isSame) {
      setEditingPath(null);
      setTempContent("");
    } else {
      setTimeout(() => {
        setEditingPath(path);
        setTempContent(initialValue);
      }, 100);
    }
  }

  function handleBlur() {
    setTimeout(() => {
      if (editingPath !== null) {
        // 1) build the new tree
        setSteps((prev) => {
          const updatedTree = updateStepContentAtPath(
            prev,
            editingPath,
            tempContent
          );
          // 2) save to server
          /*           saveStepTree(updatedTree);
           */ // 3) return for React state
          return updatedTree;
        });
        // 4) exit editing mode
        setEditingPath(null);
        setTempContent("");
      }
    }, 100);
  }

  function updateStepContentAtPath(
    steps: Step[],
    path: number[],
    newContent: string
  ): Step[] {
    const updatedSteps = steps.map((step) => ({ ...step }));
    let current = updatedSteps;
    for (let i = 0; i < path.length; i++) {
      const idx = path[i];
      if (i === path.length - 1) {
        current[idx] = { ...current[idx], content: newContent };
        current[idx].status.correctness = "";
        current[idx].status.can_be_further_divided = "";
        current[idx].code = "";
      } else {
        current[idx] = {
          ...current[idx],
          children: current[idx].children.map((child) => ({ ...child })),
        };
        current = current[idx].children;
      }
    }
    return updatedSteps;
  }

  function calculateStepBoxWidthPx() {
    return 300 + 36;
  }

  const [stepBoxWidth, setStepBoxWidth] = useState(calculateStepBoxWidthPx());

  const STEP_BOX_WIDTH_PX = stepBoxWidth;

  useEffect(() => {
    const handleResize = () => setStepBoxWidth(calculateStepBoxWidthPx());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // tree render
  function renderNode(node: Step, indexPath: string, path: number[]) {
    const nodeWidth = calculateTreeWidth(node);
    const elementId = `step-${path.join("-")}`;
    const isGhost = node.isGhost ?? false;

    const connectorOffset = Math.round(
      (nodeWidth - STEP_BOX_WIDTH_PX + CHILD_EXTRA_MARGIN_PX) / 2
    );
    const offsetWithUnit = `${connectorOffset}px`;

    const childCount = node.children.length;
    let branchLineStyle: React.CSSProperties | undefined;

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

    <svg width="0" height="0">
      <filter id="wavy">
        <feTurbulence
          id="turbulence"
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="3"
        />
        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="6" />
      </filter>
    </svg>;

    return (
      <div
        key={node.id}
        id={elementId}
        className={`tree-root-item ${node.isDeleting ? "deleting" : ""} ${
          isGhost ? "ghost-step" : ""
        }`}
        style={{ "--margin-var-tree": offsetWithUnit } as React.CSSProperties}
      >
        <div className="step-box-ab">
          <div
            className={`tree-node-ab 
            `}
            data-node-id={node.id}
            style={{
              border: `2px ${getBorder(node)} black`,
              backgroundColor: getStepBoxColor(node),
              color: getStepBoxTextColor(node),
            }}
          >
            <div className="tree-node-text">
              <div className="title-icon-tree-ab">
                <strong>Step {indexPath}</strong>
                <div className="icon-container">
                  <div className="leftSide-Icons">
                    <Pen
                      className="Filetext-tree abstract"
                      strokeWidth={1.2}
                      onClick={() => handleStartEditing(path, node.content)}
                      style={{
                        fill:
                          editingPath &&
                          editingPath.length === path.length &&
                          editingPath.every((v, i) => v === path[i])
                            ? "lightgray"
                            : undefined,
                      }}
                    />
                  </div>
                  <div className="trash">
                    <CustomLightbulb
                      number={getNumberForStep(node)}
                      fill={getNumberForStep(node) ? "yellow" : "none"}
                      color={getStepBoxTextColor(node)}
                      onGiveHint={() =>
                        handleGiveHint(path, getNumberForStep(node))
                      }
                      abstract={true}
                      ref1={node.id === "step-0001" ? ref10 : undefined}
                    />
                    {allIsAvailable && (
                      <Trash
                        cursor="pointer"
                        strokeWidth={1.2}
                        color={getStepBoxTextColor(node)}
                        onClick={() => handleRemoveStep(node.id)}
                        className="trash-icon abstract"
                      />
                    )}
                  </div>
                </div>
              </div>

              {editingPath &&
              editingPath.length === path.length &&
              editingPath.every((v, i) => v === path[i]) ? (
                <textarea
                  ref={textareaRef}
                  autoFocus
                  className="inline-edit-textarea-editing ab"
                  style={{ color: getStepBoxTextColor(node) }}
                  rows={3}
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                    // Shift+Enter will insert a newline as usual
                  }}
                />
              ) : (
                <div
                  className={`step-content-ab ${
                    node.showCorrectStep1 ? "step-content-ab-hinted" : ""
                  }`}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleStartEditing(path, node.content);
                  }}
                >
                  {node.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {node.detailed_hint && node.showDetailedHint1 && (
          <Collapsible
            isOpen={node.showDetailedHint2}
            id={`hint-detailed-${node.id}`}
            toggleHint={toggleHint}
            stepId={node.id}
            what="detailed"
          >
            <div
              className={`hint-inner ${
                node.showDetailedHint2 ? "extended" : "fade-out-hint"
              } ${
                justUnlockedHintId === `step-${path.join("-")}-2`
                  ? "fade-in-hint"
                  : ""
              }`}
            >
              {node.showDetailedHint2 ? (
                <>
                  <strong>Detailed Hint:</strong>{" "}
                  <span className="hint-content-ab">{node.detailed_hint}</span>
                </>
              ) : (
                <div className="not-extented-hint ab">
                  <strong>Detailed Hint:</strong>{" "}
                  <span
                    className="hint-content-ab"
                    style={{ visibility: "hidden" }}
                  >
                    {node.detailed_hint}
                  </span>
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {node.general_hint && node.showGeneralHint1 && (
          <Collapsible
            isOpen={node.showGeneralHint2}
            id={`hint-general-${node.id}`}
            toggleHint={toggleHint}
            stepId={node.id}
            what="general"
          >
            <div
              className={`hint-inner ${
                node.showGeneralHint2 ? "extended" : ""
              } ${
                justUnlockedHintId === `step-${path.join("-")}-3`
                  ? "fade-in-hint"
                  : ""
              }`}
            >
              {node.showGeneralHint2 ? (
                <>
                  <strong>General Hint:</strong>{" "}
                  <span className="hint-content-ab">{node.general_hint}</span>
                </>
              ) : (
                <div className="not-extented-hint ab">
                  <strong>General Hint:</strong>{" "}
                  <span
                    className="hint-content-ab"
                    style={{ visibility: "hidden" }}
                  >
                    {node.general_hint}
                  </span>
                </div>
              )}
            </div>
          </Collapsible>
        )}

        {childCount > 0 && (
          <div className="tree-children-ab" style={{ position: "relative" }}>
            <div className="branch-line" style={branchLineStyle} />
            <div className="branch-items-container">
              <div className="branch-items">
                {node.children.map((child, j) =>
                  renderNode(child, `${indexPath}.${j + 1}`, [...path, j])
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderTree(tree = steps) {
    return (
      <div className={`tree-root`}>
        {tree.map((node, i) => renderNode(node, `${i + 1}`, [i]))}
      </div>
    );
  }

  /* -----------------------
  Hint handling START
  ----------------------- */
  interface StepNode {
    // (you can include any other fields you actually use)
    content: string;
    general_hint?: string;
    detailed_hint?: string;

    // recursive substeps
    substeps: StepsTree;
  }

  // 2) A StepsTree is just a string‐keyed map of nodes
  type StepsTree = Record<string, StepNode>;

  // 3) Now annotate your function
  function countStepsTree(tree: StepsTree): number {
    let count = 0;
    for (const key in tree) {
      count += 1; // one step

      const node = tree[key];
      // if there are any substeps, recurse
      if (Object.keys(node.substeps).length > 0) {
        count += countStepsTree(node.substeps);
      }
    }
    return count;
  }

  const [numberOfNeededSteps, setNumberOfNeededSteps] = useState<number | null>(
    null
  );

  function countCurrentSteps(steps: Step[]): number {
    let count = 0;
    for (const step of steps) {
      // count this node
      count += 1;
      // recurse into any children
      if (step.children.length > 0) {
        count += countCurrentSteps(step.children);
      }
    }
    return count;
  }

  const recalcNumberOfNeeded = useCallback(() => {
    if (!abstraction?.correct_answer?.stepsTree) return;
    const totalNeeded = countStepsTree(abstraction.correct_answer.stepsTree);
    const currentHave = countCurrentSteps(stepsRef.current);
    setNumberOfNeededSteps(totalNeeded - currentHave);
  }, [abstraction]);

  useEffect(() => {
    if (!isAvailable && isAvailable !== undefined) {
      recalcNumberOfNeeded();
    }
  }, [isAvailable]);

  useEffect(() => {
    if (numberOfNeededSteps !== null && draggingNew === false) {
      recalcNumberOfNeeded();
    }
  }, [steps, recalcNumberOfNeeded, numberOfNeededSteps, draggingNew]);

  //Handle hint all
  function mapStepsTreeToBlank(
    tree: Record<string, { substeps: any }>
  ): Step[] {
    return Object.keys(tree).map((key) => {
      // create a blank step (just like createBlankStep does)
      const blank: Step = createBlankStep(true, false);

      // recurse into its substeps
      blank.children = mapStepsTreeToBlank(tree[key].substeps || {});
      return blank;
    });
  }

  function shapesEqual(a: Step[], b: Step[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((nodeA, i) => shapesEqual(nodeA.children, b[i].children));
  }

  function applyAbstractionHints(
    steps: Step[],
    abstraction: AbstractionItem | null
  ): void {
    if (!abstraction) return;

    // 1) build maps for the actual steps tree
    const idToPath = new Map<string, string>();
    const pathToStep = new Map<string, Step>();
    function walkSteps(nodes: Step[], prefix = "") {
      nodes.forEach((node, i) => {
        const path = prefix === "" ? `${i}` : `${prefix}.${i}`;
        idToPath.set(node.id, path);
        pathToStep.set(path, node);
        if (node.children.length > 0) {
          walkSteps(node.children, path);
        }
      });
    }
    walkSteps(steps);

    // 2) build a map for the abstraction’s stepsTree (with numeric indexing)
    type TreeNode = AbstractionItem["correct_answer"]["stepsTree"][string];
    const pathToAbstractionNode = new Map<string, TreeNode>();
    function walkAbstractionTree(
      subtree: Record<string, TreeNode>,
      prefix = ""
    ) {
      // use numeric indices rather than original keys
      Object.keys(subtree).forEach((origKey, i) => {
        const node = subtree[origKey];
        const path = prefix === "" ? `${i}` : `${prefix}.${i}`;
        pathToAbstractionNode.set(path, node);
        if (node.substeps && Object.keys(node.substeps).length > 0) {
          walkAbstractionTree(node.substeps, path);
        }
      });
    }
    walkAbstractionTree(abstraction.correct_answer.stepsTree);

    // 3) apply each abstraction-node’s hints to the matching Step
    idToPath.forEach((path, _) => {
      const targetStep = pathToStep.get(path);
      const sourceNode = pathToAbstractionNode.get(path);
      if (targetStep && sourceNode) {
        targetStep.general_hint = sourceNode.general_hint;
        targetStep.detailed_hint = sourceNode.detailed_hint;
        targetStep.correctStep = sourceNode.content;
      }
    });
  }

  /* -----------------------
  Hint handling END
  ----------------------- */

  /* -----------------------
  Replacing / Checking Steps START
  ----------------------- */
  const [isCheckingAbstractionOverlay, setIsCheckingAbstractionOverlay] =
    useState(false);
  const [answerAbstractionOVerlay, setAnswerAbstractionOVerlay] = useState<
    string | null
  >(null);

  const simplifySteps = (steps: Step[]): any[] => {
    return steps.map((step) => ({
      id: step.id,
      content: step.content,
      children: step.children ? simplifySteps(step.children) : [],
    }));
  };

  const simplifyAbstractionTree = (
    tree: Record<string, any>
  ): Record<string, any> => {
    const result: Record<string, any> = {};
    for (const [key, node] of Object.entries(tree)) {
      result[key] = {
        id: key,
        content: node.content,
        substeps: simplifyAbstractionTree(node.substeps || {}),
      };
    }
    return result;
  };

  const onCheck = async () => {
    if (isCheckingAbstractionOverlay) return; // guard against spamming

    // 1️⃣ commit any in-flight edit into a brand new array
    let next = steps;
    if (editingPath) {
      next = updateStepContentAtPath(steps, editingPath, tempContent);
      setSteps(next);
      setEditingPath(null);
      setTempContent("");
    }

    // 2️⃣ now invoke your checker *with* the up-to-date tree
    await handleReplaceSteps(next, abstraction);
  };

  const handleReplaceSteps = useCallback(
    async (steps: Step[], abstraction: AbstractionItem | null) => {
      if (!abstraction) return;

      try {
        setIsCheckingAbstractionOverlay(true);

        const simplifiedSteps = simplifySteps(steps);
        const simplifiedAbstraction = simplifyAbstractionTree(
          abstraction.correct_answer.stepsTree
        );

        const data = await apiCallCheckAbstraction(
          simplifiedSteps,
          simplifiedAbstraction
        );
        setAnswerAbstractionOVerlay(data.choices[0].message.content);
      } catch (err) {
        console.error("Error during abstraction check:", err);
      } finally {
        setIsCheckingAbstractionOverlay(false);
      }
    },
    []
  );

  function computeLCApath(root: Step[], groupIds: string[]): number[] | null {
    // find each ID’s path
    const paths = groupIds
      .map((id) => findPath(root, id))
      .filter((p): p is number[] => Array.isArray(p));
    if (paths.length !== groupIds.length) return null;
    // compute longest common prefix
    let lca = paths[0].slice();
    for (const p of paths.slice(1)) {
      let i = 0;
      while (i < lca.length && i < p.length && lca[i] === p[i]) i++;
      lca = lca.slice(0, i);
    }
    return lca;
  }

  const [fadeInTextNo, setFadeInTextNo] = useState(false);
  const [fadeOutTextNo, setFadeOutTextNo] = useState(false);

  function markAllStepsCorrect(steps: Step[]): Step[] {
    return steps.map((step) => ({
      ...step,
      status: {
        correctness: "correct",
        can_be_further_divided: "cannot",
      },
      children: markAllStepsCorrect(step.children),
    }));
  }

  useEffect(() => {
    if (answerAbstractionOVerlay === "No") {
      setFadeOutTextNo(false);
      setFadeInTextNo(true);

      setTimeout(() => {
        setFadeInTextNo(false);
        setFadeOutTextNo(true);
      }, 4500);

      setTimeout(() => {
        setAnswerAbstractionOVerlay(null);
        setFadeOutTextNo(false);
      }, 5300);
    } else if (answerAbstractionOVerlay === "Yes") {
      const normalizedSteps = markAllStepsCorrect(steps);
      setSteps(normalizedSteps);

      // 1) grab the *array of groups* for this abstraction
      const groupsToReplace: string[][] =
        abstractionToSteps[abstraction!.id] || [];

      // 3) …and for each group, call your replaceOrMergeSteps once with that group’s IDs
      type GroupInfo = { ids: string[]; lcaDepth: number };
      const infos: GroupInfo[] = (abstractionToSteps[abstraction!.id] || [])
        .map((ids) => {
          const path = computeLCApath(originalSteps, ids);
          return path ? { ids, lcaDepth: path.length } : null;
        })
        .filter((x): x is GroupInfo => !!x)
        // 3b) sort by descending depth so inner groups go first
        .sort((a, b) => b.lcaDepth - a.lcaDepth);

      // 3c) now apply them in order
      let updatedTree = originalSteps;
      for (const { ids } of infos) {
        updatedTree = replaceStepsBySequenceWithChildren(
          updatedTree,
          ids,
          normalizedSteps
        );
      }

      // 4) now wire it back into your abstractions list…
      const filtered = originalAbstraction.filter(
        (a) => a.id !== abstraction!.id
      );
      const newAllIds = collectAllStepIds(normalizedSteps);
      const newGroup = newAllIds.map((id) => ({ id }));

      const updatedFiltered = filtered.map((absItem) => ({
        ...absItem,
        steps: absItem.steps.map((oldGroup) => {
          const oldIds = oldGroup.map((o) => o.id);
          // if this oldGroup matches ANY of the replaced groups, swap it out:
          if (groupsToReplace.some((g) => sameIdSet(g, oldIds))) {
            return newGroup;
          }
          return oldGroup;
        }),
      }));

      saveAbstraction(updatedFiltered);
      originalSetAbstraction(updatedFiltered);
      originalSetSteps(updatedTree);
      saveOriginalStepTree(updatedTree);

      deleteAbstractionInbetween(problemId, abstraction!.id)
        .catch((err) => console.error(err))
        .finally(onClose);
    }
  }, [answerAbstractionOVerlay]);

  function collectAllStepIds(tree: Step[]): string[] {
    const result: string[] = [];
    function walk(nodes: Step[]) {
      for (const node of nodes) {
        result.push(node.id);
        if (node.children.length > 0) {
          walk(node.children);
        }
      }
    }
    walk(tree);
    return result;
  }

  function sameIdSet(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every((x) => setB.has(x));
  }

  function removeAndPromoteChildren(
    siblings: Step[],
    idsToRemove: Set<string>
  ): Step[] {
    return siblings.flatMap((node) => {
      if (idsToRemove.has(node.id)) {
        // “delete” this node but keep & promote its children
        return removeAndPromoteChildren(node.children, idsToRemove);
      } else {
        // keep this node, but clean its children recursively
        return [
          {
            ...node,
            children: removeAndPromoteChildren(node.children, idsToRemove),
          },
        ];
      }
    });
  }

  function replaceStepsBySequenceWithChildren(
    root: Step[],
    groupIds: string[],
    replacements: Step[]
  ): Step[] {
    // 1) Find each ID’s index path
    const paths = groupIds
      .map((id) => findPath(root, id))
      .filter((p): p is number[] => Array.isArray(p));
    if (paths.length !== groupIds.length) return root;

    // 2) Find LCA (longest common prefix)
    let lcaPath = paths[0].slice();
    for (const p of paths.slice(1)) {
      let i = 0;
      while (i < lcaPath.length && i < p.length && lcaPath[i] === p[i]) i++;
      lcaPath = lcaPath.slice(0, i);
    }

    if (lcaPath.length === 0) {
      // splice at the very top-level array; spliceGroup will
      // merge into the first matching ID (i.e. “to the left”)
      const spliced = updateAtAncestor(root, [], (siblings) =>
        spliceGroup(siblings, groupIds, replacements)
      );
      return removeAndPromoteChildren(spliced, new Set(groupIds));
    }

    // 3) LCA node + removeSelf logic
    const lcaNode = getNodeAtPath(root, lcaPath);
    const removeSelf = groupIds.includes(lcaNode.id);

    // 4) What IDs to remove (if LCA included, exclude it from promote set)
    const promoteIds = groupIds.filter((id) => id !== lcaNode.id);

    // 5) Ancestor path & targets for splice
    const spliceTargets = removeSelf ? [lcaNode.id] : promoteIds;
    const ancestorPath = removeSelf ? lcaPath.slice(0, -1) : lcaPath;

    // 6) Perform the splice (spliceGroup will handle promotion + replacement)
    const spliced = updateAtAncestor(root, ancestorPath, (siblings) =>
      spliceGroup(siblings, spliceTargets, replacements)
    );

    // 8) Now *always* remove & promote any IDs in promoteIds:
    //    - in the non-removeSelf case they’re already gone, so no change
    //    - in the removeSelf case this strips out those two child IDs
    //      that got orphaned under the replacement
    return removeAndPromoteChildren(spliced, new Set(promoteIds));
  }

  // --- Helpers ---

  // Recursively descend to apply `updater` at the given parentPath.
  // If parentPath is empty, we’re already at the right siblings array.
  function updateAtAncestor(
    nodes: Step[],
    parentPath: number[] = [],
    updater: (siblings: Step[]) => Step[]
  ): Step[] {
    if (parentPath.length === 0) {
      return updater(nodes);
    }
    const [head, ...rest] = parentPath;
    return nodes.map((n, i) =>
      i === head
        ? { ...n, children: updateAtAncestor(n.children, rest, updater) }
        : n
    );
  }

  function cloneReplacementTree(step: Step): Step {
    const newId = `step-${Date.now()}-${Math.floor(Math.random() * 1e8)}`;
    return {
      ...step,
      id: newId,
      children: step.children.map(cloneReplacementTree),
    };
  }

  // 2) spliceGroup: promote orphans (no cloning), then clone only the replacements
  function spliceGroup(
    siblings: Step[],
    toRemove: string[],
    replacements: Step[]
  ): Step[] {
    const toRemoveSet = new Set(toRemove);
    const newSibs: Step[] = [];
    const orphanChildren: Step[] = [];

    // Remove nodes by ID, but collect their ORIGINAL children
    for (const node of siblings) {
      if (toRemoveSet.has(node.id)) {
        orphanChildren.push(
          ...removeAndPromoteChildren(node.children, toRemoveSet)
        );
      } else {
        newSibs.push(node);
      }
    }

    // Clone ONLY the replacement subtree
    const clones = replacements.map((repl, idx) => {
      const clone = cloneReplacementTree(repl);
      // the clone already has its own cloned children
      if (idx === replacements.length - 1) {
        // append the *existing* orphans under the last clone
        clone.children = clone.children.concat(orphanChildren);
      }
      return clone;
    });

    // Splice in at the right index
    const firstRemovedIndex = siblings.findIndex((node) =>
      toRemoveSet.has(node.id)
    );
    if (firstRemovedIndex < 0) return siblings;

    return [
      ...newSibs.slice(0, firstRemovedIndex),
      ...clones,
      ...newSibs.slice(firstRemovedIndex),
    ];
  }

  // Recursively find the index‐path of `id` in `nodes`
  function findPath(
    nodes: Step[],
    id: string,
    prefix: number[] = []
  ): number[] | null {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return [...prefix, i];
      const childPath = findPath(nodes[i].children, id, [...prefix, i]);
      if (childPath) return childPath;
    }
    return null;
  }

  // Get the node at a given index‐path
  function getNodeAtPath(nodes: Step[], path: number[]): Step {
    let cur = nodes[path[0]];
    for (let i = 1; i < path.length; i++) {
      cur = cur.children[path[i]];
    }
    return cur;
  }

  /* -----------------------
  Replacing / Checking Steps END
  ----------------------- */

  useEffect(() => {
    if (stepIndex === 13) {
      setSteps([]);
      setTimeout(() => {
        setNumberOfNeededSteps(null);
      }, 100);
      setTimeout(() => {
        setAllIsAvailable(true);
      }, 100);
    }
    if (stepIndex === 14) {
      setNumberOfNeededSteps(null);
    }
    if (stepIndex === 17) {
      setNumberOfNeededSteps(null);
    } else if (stepIndex === 18) {
      setNumberOfNeededSteps(5);
    } else if (stepIndex === 19) {
      setNumberOfNeededSteps(5);
      setAllIsAvailable(true);
      setSteps([]);
    } else if (stepIndex === 20) {
      setNumberOfNeededSteps(0);
      setAllIsAvailable(false);
      setSteps(abstractionInbetweenTutorial);
    } else if (stepIndex === 21) {
      setSteps(abstractionInbetweenTutorial);
    } else if (stepIndex === 22) {
      setSteps(abstractionInbetweenTutorial2);

      setTimeout(() => {
        const el = ref10.current;
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }, 200);
    } else if (stepIndex === 23) {
      setTimeout(() => {
        setSteps(abstractionInbetweenTutorial2);
      }, 0);
    }
  }, [stepIndex]);

  return (
    <div className="container-abstract-hover-overlay" ref={ref1}>
      {draggingNew && ghostPos && (
        <div
          style={{
            position: "fixed",
            top: ghostPos.y - 12, // center the 24×24 icon under the cursor
            left: ghostPos.x - 12,
            pointerEvents: "none",
            opacity: 0.8,
            zIndex: 9999,
          }}
        >
          <div style={{ position: "relative", width: 24, height: 24 }}>
            {/* your normal plus */}
            <SquarePlus size={24} />

            {/* overlay a small check or cross */}
            {insertTarget ? (
              <Check
                size={10}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  background: "green",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <X
                size={10}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  background: "red",
                  borderRadius: "50%",
                }}
              />
            )}
          </div>
        </div>
      )}
      <div
        className="building-abstraction-container"
        ref={(el) => {
          if (el) {
            mainContainerRef.current = el;
            ref8.current = el;
          }
        }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative" }}
      >
        <div
          className="container-tutorial-problem"
          onClick={() => setStepIndex(13)}
          style={{ zIndex: 9999 }}
        >
          <div className="Tutorial-Problem">?</div>
        </div>
        <div ref={zoomContentRef} className="zoom-content">
          {renderTree(getPreviewSteps())}
        </div>
      </div>
      <div className="divider-abstraction-overlay" />
      <div
        className="right-abstraction-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="Right-abstraction-overlay-title">
          <div className="WhatDoing-title" ref={ref2}>
            {getType}
          </div>

          <div className="step-labels-wrapper-abstractionOverlay" ref={ref3}>
            {StepLabels({ stepLabels })}
          </div>
        </div>
        <hr
          style={{ width: "90%", opacity: "0.2", margin: 0, marginTop: "10px" }}
        />
        <div
          className="containerForPlusAndNumberStepsNeeded"
          style={{ marginTop: "30px" }}
        >
          <div
            className={`container-plus-ab ${
              !allIsAvailable ? "deactivated-ab" : ""
            }`}
            style={{
              width: "20px",
              height: "20px",
              padding: "10px 10px",
              borderRadius: "10px",
            }}
            ref={ref4}
          >
            <SquarePlus
              className={`square-plus-ab ${
                !allIsAvailable ? "deactivated-ab" : ""
              }`}
              onPointerDown={startNewStepDrag}
              style={{ touchAction: "none" }}
            />
          </div>

          <div className="number-needed-steps-AbstractionOverlay" ref={ref6}>
            {numberOfNeededSteps ?? "?"}
          </div>
        </div>

        <hr
          style={{ width: "90%", opacity: "0.2", margin: 0, marginTop: "30px" }}
        />

        <div
          className="hinting-abstractionOverlay"
          style={{ marginTop: "30px" }}
        >
          <div className="container-twoInitial-hints">
            <div
              className={`container-plus-ab-overlay ${
                ((allIsAvailable && isAvailable) ||
                  localStorage.getItem("tutorialStep")) &&
                !(
                  stepIndex === 18 ||
                  stepIndex === 19 ||
                  stepIndex === 20 ||
                  stepIndex === 21 ||
                  stepIndex === 22 ||
                  stepIndex === 23
                )
                  ? "available-ab-overlay"
                  : ""
              }
            ${
              ((!allIsAvailable || !isAvailable) &&
                !localStorage.getItem("tutorialStep")) ||
              stepIndex === 18 ||
              stepIndex === 19 ||
              stepIndex === 20 ||
              stepIndex === 21 ||
              stepIndex === 22 ||
              stepIndex === 23
                ? "deactivated-ab"
                : ""
            }`}
              style={{
                width: "20px",
                height: "20px",
                padding: "10px 10px",
                borderRadius: "10px",
              }}
              onClick={() => {
                if (isAvailable) {
                  setIsAvailable(false);
                  // grab the tree (or bail out)
                  const tree = abstraction?.correct_answer?.stepsTree;
                  if (tree && typeof tree === "object") {
                    const totalNeeded = countStepsTree(tree);
                    const currentCount = countCurrentSteps(steps);
                    const diff = totalNeeded - currentCount;
                    setNumberOfNeededSteps(diff);
                  } else {
                    console.warn("Abstraction has no stepsTree!", abstraction);
                  }
                }
              }}
              ref={ref5}
            >
              <Hash className="deactivated-ab" />
            </div>
            <div
              className={`container-plus-ab-overlay ${
                (allIsAvailable || localStorage.getItem("tutorialStep")) &&
                !(
                  stepIndex === 20 ||
                  stepIndex === 21 ||
                  stepIndex === 22 ||
                  stepIndex === 23
                )
                  ? "available-ab-overlay"
                  : ""
              }
            
            ${
              (!allIsAvailable && !localStorage.getItem("tutorialStep")) ||
              stepIndex === 20 ||
              stepIndex === 21 ||
              stepIndex === 22 ||
              stepIndex === 23
                ? "deactivated-ab"
                : ""
            }
            `}
              style={{
                width: "20px",
                height: "20px",
                padding: "10px 10px",
                borderRadius: "10px",
              }}
              onClick={() => {
                if (!allIsAvailable) return;

                const correctTree = abstraction?.correct_answer?.stepsTree;
                const expectedBlank = correctTree
                  ? mapStepsTreeToBlank(correctTree)
                  : [];

                if (shapesEqual(expectedBlank, steps)) {
                  setAllIsAvailable(false);
                  return;
                }

                setAllIsAvailable(false);
                if (correctTree) {
                  const blankTree = mapStepsTreeToBlank(correctTree);
                  setSteps(blankTree);
                  setNumberOfNeededSteps(0);
                }
              }}
              ref={ref7}
            >
              <LayoutTemplate className="deactivated-ab" />
            </div>
          </div>
          <div
            className={`container-plus-ab-overlay ${
              (!allIsAvailable && allIsHinted) ||
              stepIndex === 20 ||
              stepIndex === 21
                ? "available-ab-overlay"
                : ""
            }
            
            ${
              (allIsAvailable || !allIsHinted) &&
              !(stepIndex === 20 || stepIndex === 21)
                ? "deactivated-ab"
                : ""
            }
            `}
            style={{
              width: "20px",
              height: "20px",
              padding: "10px 10px",
              borderRadius: "10px",
            }}
            onClick={() => {
              if (!allIsHinted || allIsAvailable) return;
              setAllIsHinted(false);
              applyAbstractionHints(steps, abstraction);
              setSteps((prev) => [...prev]);
            }}
            ref={ref9}
          >
            <Lightbulb className="deactivated-ab" />
          </div>
        </div>
        <hr
          style={{ width: "90%", opacity: "0.2", margin: 0, marginTop: "30px" }}
        />
        <div
          className="hinting-abstractionOverlay"
          style={{ marginTop: "30px" }}
        >
          <div
            className="container-plus-ab-overlay"
            style={{
              width: "100px",
              height: "20px",
              padding: "10px 10px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              fontSize: "20px",
              cursor: "pointer",

              pointerEvents: isCheckingAbstractionOverlay ? "none" : "auto",
              opacity: isCheckingAbstractionOverlay ? 0.5 : 1,
            }}
            onClick={onCheck}
            ref={ref11}
          >
            {isCheckingAbstractionOverlay ? (
              <GradientSpinner size={20} strokeWidth={3} />
            ) : (
              <Check
                size={30}
                strokeWidth={3}
                style={{ color: "rgb(40, 211, 40)" }}
              />
            )}
            Check
          </div>
          {answerAbstractionOVerlay === "No" && (
            <div
              className={`text-after-GettingFalse ${
                fadeInTextNo ? "fade-in" : fadeOutTextNo ? "fade-out" : ""
              }`}
            >
              Abstraction not implemented correctly yet
            </div>
          )}
        </div>

        <X
          className="close-abstraction-overlay"
          style={{ position: "absolute", right: "5px", top: "5px" }}
          size={20}
          onClick={onClose}
        />
      </div>
      {showCorrectStepOverlay && (
        <CorrectStepOverlay
          onClose={() => setShowCorrectStepOverlay(null)}
          onConfirm={() => handleGiveCorrectStep(saveCorrectStep.toString())}
          saveChecked={saveCorrectStep}
          setSaveChecked={setSaveCorrectStep}
        />
      )}
    </div>
  );
};

export default AbstractionOverlay;
