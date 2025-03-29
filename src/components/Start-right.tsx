import { useState, useEffect, useRef, JSX, Fragment } from "react";
import "./Start-right.css";
import {
  Trash,
  Plus,
  Minus,
  MoveDiagonal,
  Martini,
  ShieldCheck,
} from "lucide-react";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";
import { problemDetailsMap } from "./Problem_detail";
import { useAuth } from "../AuthContext";
import { apiCall } from "./AI_Prompt";
import PlusbetweenSteps from "./BuildingBlocks/PlusBetweenSteps";
import { apiCallCheck } from "./AI_Check";
import apiCallTree from "./AI_Tree";
import {
  getStepsData,
  getChanged,
  setChanged,
} from "./BuildingBlocks/StepsData";
import { useCodeContext } from "../CodeContext";

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Add both max-height AND opacity transitions
    el.style.transition = "max-height 0.4s ease, margin-top 0.4s ease";

    if (isOpen) {
      // Force from 0 → expanded
      el.style.maxHeight = "0px";
      el.style.marginTop = "calc(var(--step-font-size, 1vw) * -1)";
      el.getBoundingClientRect(); // Force reflow
      el.style.marginTop = "0.5vh";
      el.style.maxHeight = el.scrollHeight + "px";
    } else {
      // Force from expanded → 0
      const currentHeight = el.scrollHeight;
      el.style.maxHeight = currentHeight + "px";
      el.style.marginTop = "0.5vh";
      el.getBoundingClientRect(); // Force reflow
      el.style.marginTop = "calc(var(--step-font-size, 1vw) * -1)";
      el.style.maxHeight = "0px";
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      id={id}
      className="hint-block"
      style={{
        // Start with these defaults; they’ll be overwritten by JS.
        maxHeight: "0px",
        overflow: "hidden",
      }}
      // Toggle the hint on click (optional if you want that behavior).
      onClick={() => toggleHint(what, stepId)}
    >
      {children}
    </div>
  );
}

// ======================
// CORRECT STEP OVERLAY
// ======================
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
          <button className="overlay-button" onClick={onConfirm}>
            Yes, Reveal
          </button>
          <button className="overlay-button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================
// STEPS
// ======================

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

function createBlankStep(Selected: boolean): Step {
  return {
    id: `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    code: "",
    content: "New Step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [],
    isDeleting: false,

    // '1' means the user has unlocked this hint at all
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,

    // '2' means is currently open or collapsed
    showGeneralHint2: false,
    showDetailedHint2: false,

    isNewlyInserted: true,
    isexpanded: true,
    isHyperExpanded: false,

    selected: Selected,
  };
}

const StartRight = () => {
  const [text, setText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { code } = useCodeContext();

  // For revealing correct steps
  const [showCorrectStepOverlay, setShowCorrectStepOverlay] = useState<
    number[] | null
  >(null);
  const [saveCorrectStep, setSaveCorrectStep] = useState(false);
  const [savedCorrectSteps, setSavedCorrectSteps] = useState<string[]>([]);

  // ephemeral for fade-in
  const [justUnlockedHintId, setJustUnlockedHintId] = useState<string | null>(
    null
  );

  const [justExpanding, setJustExpanding] = useState<number[]>([]);

  const [sentPrompt, setSentPrompt] = useState<boolean>(false);

  useEffect(() => {
    setSentPrompt(steps.length > 0);
  }, [steps]);
  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCorrectSteps") || "[]");
    setSavedCorrectSteps(saved);
  }, []);

  // Build a storage key based on the selected problem name.
  const selectedProblemName =
    localStorage.getItem("selectedProblem") || "Default Problem";
  const StorageKey = "step" + `selectedSystemProblem_${selectedProblemName}`;

  // Load saved steps from localStorage on mount.
  useEffect(() => {
    const savedSteps = localStorage.getItem(StorageKey);
    if (savedSteps) {
      try {
        const parsedSteps = JSON.parse(savedSteps);
        setSteps(parsedSteps);
      } catch (error) {
        console.error("Error parsing saved steps:", error);
      }
    } else {
      setSteps([]);
    }
  }, [StorageKey]);

  // Save steps to localStorage whenever they change
  useEffect(() => {
    if (steps.length > 0) {
      localStorage.setItem(StorageKey, JSON.stringify(steps));
    }
  }, [steps, StorageKey]);

  // Adjust textarea height on input
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
    setText(target.value);
  };

  // reset textarea height when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textareaRef.current &&
        event.target instanceof Node &&
        !textareaRef.current.contains(event.target)
      ) {
        textareaRef.current.style.height = "auto";
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Transform JSON -> Step
  function transformStep(stepData: any, hasParent: boolean = false): Step {
    return {
      id:
        stepData.id ||
        `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      code: stepData.code || "",
      content: stepData.content || "",
      correctStep: stepData.correctStep || "",
      prompt: stepData.prompt || "",
      status: stepData.status || {
        correctness: "",
        can_be_further_divided: "",
      },
      general_hint: stepData.general_hint || "",
      detailed_hint: stepData.detailed_hint || "",
      hasparent: hasParent,
      children: stepData.subSteps
        ? transformStepsObject(stepData.subSteps, true)
        : [],
      isDeleting: false,

      showGeneralHint1: false,
      showDetailedHint1: false,
      showCorrectStep1: false,
      showGeneralHint2: false,
      showDetailedHint2: false,

      isNewlyInserted: false,
      isexpanded: hasParent ? false : true,
      isHyperExpanded: false,

      selected: hasParent ? true : false,
    };
  }

  function transformStepsObject(obj: any, hasParent: boolean = false): Step[] {
    return Object.keys(obj).map((key) => transformStep(obj[key], hasParent));
  }

  async function HandleImplemented() {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    setLoading(true);

    try {
      const gptResponse = await apiCallTree(JSON.stringify(steps), code);
      const rawMessage = gptResponse.choices[0].message.content;
      console.log(rawMessage);
      const parsedResponse = JSON.parse(rawMessage);
      // Extract steps
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
      setSentPrompt(true);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  }

  /* -------------------------------------------------------------
Checking Code and Tree START
------------------------------------------------------------- */

  function getStepBoxColor(step: Step): string {
    if (step.code !== "") {
      if (step.code === "Not implemented correctely") {
        return "darkgrey";
      }
      return "green";
    }

    return getBackgroundColor(step);
  }

  /* -------------------------------------------------------------
Checking Code and Tree END
------------------------------------------------------------- */

  async function handleGenerateWithChatGPT(Context: string) {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }
    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    setLoading(true);

    try {
      const gptResponse = await apiCall(text, selectedProblemDetails);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract steps
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
      setSentPrompt(true);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  }

  //This is for editor to steptree
  useEffect(() => {
    const fetchStepsData = () => {
      if (getChanged()) {
        const newStepsData = getStepsData();
        if (!newStepsData) return;

        try {
          const stepsArray = transformStepsObject(newStepsData);
          localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
          setSteps(stepsArray);
          setText("");
        } catch (error) {
          console.error("Error processing steps data:", error);
        } finally {
          setLoading(false);
          setChanged(false);
        }
      }
    };

    // Poll every 5 seconds for changes
    const interval = setInterval(fetchStepsData, 3000);
    return () => clearInterval(interval);
  }, [StorageKey]);

  function stepsToString(steps: Step[], prefix: string = ""): string {
    return steps
      .map((step, index) => {
        const currentPrefix = prefix
          ? `${prefix}.${index + 1}`
          : `${index + 1}`;
        let stepStr = `Step ${currentPrefix}: ${step.content}\n`;

        if (step.code) {
          stepStr += `  Code: ${step.code}\n`;
        }
        if (step.general_hint || step.detailed_hint) {
          stepStr += `  Hints: ${step.general_hint} ${step.detailed_hint}\n`;
        }
        if (step.children && step.children.length > 0) {
          stepStr += stepsToString(step.children, currentPrefix);
        }
        return stepStr;
      })
      .join("");
  }

  async function handleGenerateWithChatGPTCheck(Context: string) {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }
    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = problemDetailsMap[selectedProblem];

    setLoading(true);

    try {
      const gptResponse = await apiCallCheck(
        selectedProblemDetails,
        stepsToString(steps)
      );
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      localStorage.setItem(StorageKey, JSON.stringify(stepsArray));
      setSteps(stepsArray);
      setText("");
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
    }
  }

  /* ------------------------------------------------------
Delete Functions START
------------------------------------------------------ */

  const HandleDeleteTree = () => {
    setSteps([]);
    setSentPrompt(false);
    localStorage.setItem(StorageKey, "[]");
  };

  // update step content
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

  // Removal with fade-out
  const handleRemoveStep = (id: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => markStepAndChildrenAsDeleting(step, id))
    );
    setTimeout(() => {
      setSteps((prevSteps) => removeStepById(prevSteps, id));
    }, 300);
  };

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

  /* ------------------------------------------------------
Delete Functions END
------------------------------------------------------ */

  /* ------------------------------------------------------
Insert Steps Functions START
------------------------------------------------------ */

  // Insert with fade-in
  const insertTopLevelStepAt = (index: number) => {
    const newStep = createBlankStep(true);
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps.splice(index, 0, newStep);
      return newSteps;
    });
    setTimeout(() => {
      animateAndScrollTo(newStep.id);
    }, 0);
  };

  const insertSubStepAtPath = (
    parentPath: number[],
    insertionIndex: number,
    selected: boolean
  ) => {
    const newSubStep = createBlankStep(selected);
    newSubStep.content = "New Substep";
    newSubStep.hasparent = true;

    let shouldAnimate = false;

    const parentStep = parentPath.reduce(
      (acc: Step | null, index) => (acc ? acc.children[index] : steps[index]),
      null
    );

    if (parentStep?.isexpanded) {
      shouldAnimate = true;
    }

    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps));
      let parent = newSteps;
      for (let i = 0; i < parentPath.length; i++) {
        parent = parent[parentPath[i]].children;
      }
      parent.splice(insertionIndex, 0, newSubStep);
      return newSteps;
    });

    if (shouldAnimate) {
      setTimeout(() => {
        animateAndScrollTo(newSubStep.id);
      }, 0);
    }
  };

  const insertSubStepAtPathFromSelected = (
    parentPath: number[],
    insertionIndex: number,
    selected: boolean
  ) => {
    const newSubStep = createBlankStep(selected);
    newSubStep.content = "New Substep";
    newSubStep.hasparent = true;

    let shouldAnimate = false;

    const parentStep = parentPath.reduce(
      (acc: Step | null, index) => (acc ? acc.children[index] : steps[index]),
      null
    );

    if (parentStep?.isexpanded) {
      shouldAnimate = true;
    }

    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps));
      let parent = newSteps;
      for (let i = 0; i < parentPath.length; i++) {
        parent = parent[parentPath[i]].children;
      }
      parent.splice(insertionIndex, 0, newSubStep);
      return newSteps;
    });

    if (shouldAnimate) {
      setTimeout(() => {
        animateAndScrollTo(newSubStep.id + "-promoted");
      }, 0);
    }
  };

  function animatePromotedFadeIn(promotedElementId: string) {
    const el = document.getElementById(promotedElementId);
    if (!el) return;
    el.classList.remove("fade-in");
    // Force reflow to restart the animation
    void el.offsetWidth;
    el.classList.add("fade-in");
    el.addEventListener(
      "animationend",
      () => {
        el.classList.remove("fade-in");
      },
      { once: true }
    );
  }

  function animatePromotedFadeOut(promotedElementId: string) {
    const el = document.getElementById(promotedElementId);
    if (!el) return;
    el.classList.remove("fade-out");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add("fade-out");
        el.addEventListener(
          "animationend",
          () => {
            el.classList.remove("fade-out");
          },
          { once: true }
        );
      });
    });
  }

  function animateAndScrollTo(elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Reset animation by forcing a reflow
    el.classList.remove("fade-in");
    void el.offsetWidth; // 🔥 This line forces reflow
    el.classList.add("fade-in");

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const handleAnimationEnd = () => {
      el.classList.remove("fade-in");
      el.removeEventListener("animationend", handleAnimationEnd);
    };
    el.addEventListener("animationend", handleAnimationEnd);
  }

  /* ------------------------------------------------------
Insert Steps Functions END
------------------------------------------------------ */
  /* ----------------------------------------------------------
Editing logic START
---------------------------------------------------------- */
  const [editingPath, setEditingPath] = useState<number[] | null>(null);
  const [tempContent, setTempContent] = useState("");

  function handleStartEditing(path: number[], initialValue: string) {
    const isSamePath =
      editingPath &&
      editingPath.length === path.length &&
      editingPath.every((val, i) => val === path[i]);

    if (isSamePath) {
      setEditingPath(null);
      setTempContent("");
    } else {
      setEditingPath(path);
      setTempContent(initialValue);
    }
  }

  function handleBlur() {
    setTimeout(() => {
      if (editingPath !== null) {
        setSteps((prev) =>
          updateStepContentAtPath(prev, editingPath!, tempContent)
        );
        setEditingPath(null);
        setTempContent("");
      }
    }, 100);
  }

  /* ----------------------------------------------------------
  Editing logic END
  ---------------------------------------------------------- */

  /* ---------------------------------------
  Giving hint step END
  --------------------------------------- */

  // HINT Logic
  function getNumberForStep(step: Step): number | null {
    if (step.general_hint && !step.showGeneralHint1) return 3;
    else if (step.detailed_hint && !step.showDetailedHint1) return 2;
    else if (step.correctStep && !step.showCorrectStep1) return 1;
    return null;
  }

  // Actually open/close an unlocked hint
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

    setSteps((prevSteps) => updateStepHints(prevSteps));
  }

  // Reveal correct step
  function revealCorrectStep(path: number[]) {
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      current[stepIndex].showCorrectStep1 = true;
      current[stepIndex].content = current[stepIndex].correctStep; // Overwrite content
      return newSteps;
    });
    const stepId = `step-${path.join("-")}-correct`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  function handleGiveCorrectStep() {
    if (!showCorrectStepOverlay) return;
    // reveal correct
    revealCorrectStep(showCorrectStepOverlay);

    // save?
    if (saveCorrectStep) {
      const stepId = `step-${showCorrectStepOverlay.join("-")}-correct`;
      const updated = [...savedCorrectSteps, stepId];
      setSavedCorrectSteps(updated);
      localStorage.setItem("savedCorrectSteps", JSON.stringify(updated));
    }
    // done
    setShowCorrectStepOverlay(null);
    setSaveCorrectStep(false);
  }

  // handleGiveHint
  function handleGiveHint(path: number[], hintNumber: number | null) {
    if (hintNumber === null) return;

    // correct step => show overlay or reveal immediately if saved
    if (hintNumber === 1) {
      const stepId = `step-${path.join("-")}-correct`;
      if (savedCorrectSteps.includes(stepId)) {
        revealCorrectStep(path);
      } else {
        setShowCorrectStepOverlay(path); // triggers overlay
      }
      return;
    }

    // otherwise, general/detailed hints
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const stepIndex = path[path.length - 1];
      const step = current[stepIndex];
      if (hintNumber === 3) step.showGeneralHint1 = true;
      else if (hintNumber === 2) step.showDetailedHint1 = true;
      return newSteps;
    });

    const stepId = `step-${path.join("-")}-${hintNumber}`;
    setJustUnlockedHintId(stepId);
    setTimeout(() => {
      setJustUnlockedHintId(null);
    }, 300);
  }

  /* ---------------------------------------
  Giving hint step END
  --------------------------------------- */

  /* ---------------------------------------
  Splitting step function START
  --------------------------------------- */
  function HandleOnSplitStep(path: number[]) {
    return () => {
      let stepToClone!: Step;
      let clonedStep!: Step;

      setSteps((prevSteps) => {
        const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];

        let current = newSteps;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children;
        }

        const idx = path[path.length - 1];
        stepToClone = current[idx];

        clonedStep = {
          ...JSON.parse(JSON.stringify(stepToClone)),
          id: `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          isNewlyInserted: true,
          isDeleting: false,
        };

        current.splice(idx + 1, 0, clonedStep);
        return newSteps;
      });

      setTimeout(() => {
        const originalEl = document.getElementById(stepToClone.id);
        const clonedEl = document.getElementById(clonedStep.id);

        if (originalEl && clonedEl) {
          // Remove classes in case they're still there from a previous animation
          originalEl.classList.remove("dividing-original");
          clonedEl.classList.remove("dividing-new");

          // Force reflow to reset animation
          void originalEl.offsetWidth;
          void clonedEl.offsetWidth;

          // Add animation classes again
          originalEl.classList.add("dividing-original");
          clonedEl.classList.add("dividing-new");

          // Use separate cleanup functions to avoid removing both too early
          const removeOriginalClass = () => {
            originalEl.classList.remove("dividing-original");
            originalEl.removeEventListener("animationend", removeOriginalClass);
          };

          const removeClonedClass = () => {
            clonedEl.classList.remove("dividing-new");
            clonedEl.removeEventListener("animationend", removeClonedClass);
          };

          originalEl.addEventListener("animationend", removeOriginalClass);
          clonedEl.addEventListener("animationend", removeClonedClass);
        }
      }, 50);
    };
  }

  /* ---------------------------------------
  Splitting step function END
  --------------------------------------- */

  // Rendering logic
  function getBackgroundColor(step: Step): string {
    if (
      step.status.correctness === "" &&
      step.status.can_be_further_divided === ""
    )
      return "white";
    if (
      step.status.correctness === "correct" &&
      step.status.can_be_further_divided === "cannot"
    )
      return "rgb(96, 230, 96)";
    if (
      step.status.correctness === "incorrect" &&
      step.status.can_be_further_divided === "cannot"
    )
      return "rgb(255, 99, 99)";
    if (step.status.can_be_further_divided === "can") return "lightblue";
    return "white";
  }

  function getBorder(step: Step): string {
    if (step.status.correctness === "missing") return "dashed";
    return "solid";
  }

  const [expandedblock, setExpadedBlock] = useState<boolean | null>(null);

  function toggleStepExpanded(path: number[]) {
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)); // Deep clone
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      setExpadedBlock(true);
      const idx = path[path.length - 1];
      current[idx].isexpanded = !current[idx].isexpanded;
      if (!current[idx].isexpanded) {
        setExpadedBlock(false);
        current[idx].isHyperExpanded = false;
      }
      return newSteps;
    });
    setJustExpanding(path);
    setTimeout(() => {
      setJustExpanding([]);
    }, 300);
  }

  function toggleHyperExpanded(path: number[]) {
    setSteps((prevSteps) => {
      const newSteps = JSON.parse(JSON.stringify(prevSteps)); // Deep clone
      let current = newSteps;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]].children;
      }
      const idx = path[path.length - 1];
      current[idx].isHyperExpanded = !current[idx].isHyperExpanded;
      if (current[idx].isHyperExpanded) {
        current[idx].isexpanded = true;
      }
      if (!current[idx].isHyperExpanded && !expandedblock) {
        current[idx].isexpanded = false;
      }
      return newSteps;
    });
    setJustExpanding(path);
    setTimeout(() => {
      setJustExpanding([]);
    }, 300);
  }

  // Toggle function: simply toggles the "selected" flag on the step at currentPath.
  const toggleSelected = (currentPath: number[]) => {
    setSteps((prevSteps: Step[]) => {
      const updateSteps = (steps: Step[], path: number[]): Step[] => {
        if (path.length === 0) return steps;
        const index = path[0];
        return steps.map((step, i) => {
          if (i !== index) return step;
          if (path.length === 1) {
            return { ...step, selected: !step.selected };
          } else {
            return {
              ...step,
              children: updateSteps(step.children || [], path.slice(1)),
            };
          }
        });
      };
      return updateSteps(prevSteps, currentPath);
    });
  };

  // Helper to collect promoted substeps from a (nested) children array.
  // This function returns an array of JSX elements representing the promoted
  // substeps (i.e. those with selected === true) that should be rendered
  // at the top-level domain, immediately after their parent.
  function collectPromotedSubsteps(
    steps: Step[],
    parentPath: number[]
  ): JSX.Element[] {
    let promotedElements: JSX.Element[] = [];
    let lastPromotedPath: number[] | null = null;

    steps.forEach((step, index) => {
      const currentPath = [...parentPath, index];

      if (step.selected) {
        lastPromotedPath = [...currentPath] as number[]; // Save this path

        const displayPath = currentPath.map((i) => i + 1).join(".");
        const titleLabel = `Substep ${displayPath}:`;

        promotedElements.push(
          <Fragment key={`promoted-${currentPath.join("-")}`}>
            {/* Top PLUS: insert before this substep */}
            <div
              className="promotedPlus"
              key={`wrapper-promoted-plus-top-${currentPath.join("-")}`}
            >
              <PlusbetweenSteps
                key={`external-promoted-plus-top-${currentPath.join("-")}`}
                onClick={() => {
                  const parentPathOfSubstep = currentPath.slice(0, -1);
                  const indexInParent = currentPath[currentPath.length - 1];
                  insertSubStepAtPathFromSelected(
                    parentPathOfSubstep,
                    indexInParent,
                    true
                  );
                }}
              />
            </div>

            {/* Promoted Step */}
            <div
              className={`step-box promoted
                ${step.isDeleting && step.selected ? "fade-out" : ""} 
                ${step.isexpanded ? "expanded" : ""}
                ${step.isHyperExpanded ? "hyperExpanded" : ""} 
                ${
                  justExpanding?.toString() === currentPath.toString()
                    ? "isexpanding"
                    : ""
                }
              `}
              id={`${step.id}-promoted`}
              style={{
                backgroundColor: getBackgroundColor(step),
                border: "1px " + getBorder(step) + " black",
              }}
            >
              <div className="step-title">
                <div className="step-title-inner">{titleLabel}</div>
                <div className="icon-container-start-right">
                  <div className="leftSide-Icons">
                    <The_muskeltiers
                      number={getNumberForStep(step)}
                      fill={getNumberForStep(step) ? "yellow" : "none"}
                      prompt={step.prompt}
                      stepNumber={displayPath}
                      onAddChild={() =>
                        insertSubStepAtPathFromSelected(currentPath, 0, false)
                      }
                      onEditStep={() =>
                        handleStartEditing(currentPath, step.content)
                      }
                      onGiveHint={() =>
                        handleGiveHint(currentPath, getNumberForStep(step))
                      }
                      onSplitStep={HandleOnSplitStep(currentPath)}
                      onShowImplemented={async () => HandleImplemented()}
                    />
                    <div className="trash">
                      <Trash
                        onClick={() => handleRemoveStep(step.id)}
                        cursor="pointer"
                        strokeWidth={"1.2"}
                        className="trash-icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {editingPath &&
              editingPath.length === currentPath.length &&
              editingPath.every((val, i) => val === currentPath[i]) ? (
                <textarea
                  autoFocus
                  className="inline-edit-textarea-editing"
                  rows={3}
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  onBlur={handleBlur}
                />
              ) : (
                <div
                  className={`step-content ${
                    step.showCorrectStep1 ? "step-content-hinted" : ""
                  }`}
                  onDoubleClick={() =>
                    handleStartEditing(currentPath, step.content)
                  }
                >
                  {step.isexpanded ? step.content : ""}
                </div>
              )}

              {step.children && step.children.length > 0 && step.isexpanded && (
                <div className="substeps">
                  {renderTree(step.children, currentPath)}
                </div>
              )}
            </div>
          </Fragment>
        );
      }

      // Recurse
      if (step.children && step.children.length > 0) {
        promotedElements = promotedElements.concat(
          collectPromotedSubsteps(step.children, currentPath)
        );
      }
    });

    if (promotedElements.length > 0 && lastPromotedPath !== null) {
      const safePath: number[] = lastPromotedPath; // Now safePath is guaranteed to be number[]
      const parentPath = safePath.slice(0, -1);
      const index = safePath[safePath.length - 1] + 1;

      promotedElements.push(
        <div className="promotedPlus">
          <PlusbetweenSteps
            key={`final-promoted-plus-${parentPath.join("-")}`}
            onClick={() => {
              insertSubStepAtPathFromSelected(parentPath, index, true);
            }}
          />
        </div>
      );
    }

    return promotedElements;
  }

  /* ------------------------------------
Biggest render Tree ever recored START
------------------------------------ */

  function renderTree(steps: Step[], parentPath: number[] = []): JSX.Element[] {
    const elements: JSX.Element[] = [];

    // Render the plus button at the top of the current list.
    if (parentPath.length === 0) {
      elements.push(
        <PlusbetweenSteps
          key={`plus-top-0`}
          onClick={() => insertTopLevelStepAt(0)}
        />
      );
    } else {
      elements.push(
        <PlusbetweenSteps
          key={`${parentPath.join("-")}-plus-0`}
          onClick={() => insertSubStepAtPath(parentPath, 0, false)}
        />
      );
    }

    steps.forEach((step, index) => {
      const currentPath = [...parentPath, index];
      const displayPath = currentPath.map((i) => i + 1).join(".");
      const hintNumber = getNumberForStep(step);
      const isCurrentlyEditing =
        editingPath &&
        editingPath.length === currentPath.length &&
        editingPath.every((val, i) => val === currentPath[i]);

      // Determine title label: use "Substep" if not top-level.
      const titleLabel =
        parentPath.length > 0
          ? `Substep ${displayPath}:`
          : `Step ${displayPath}:`;

      // For substeps, clicking on the title toggles its selected state.
      /* const handleTitleClick = () => {
        if (parentPath.length > 0) {
          toggleSelected(currentPath);
        }
      }; */

      const handleTitleClick = () => {
        // If not selected, toggle selection and animate promoted element fade-in.
        if (!step.selected) {
          toggleSelected(currentPath);
          setTimeout(() => {
            animatePromotedFadeIn(`${step.id}-promoted`);
          }, 0);
        } else {
          animatePromotedFadeOut(`${step.id}-promoted`);
          setTimeout(() => {
            toggleSelected(currentPath);
          }, 300);
        }
      };

      // TOP LEVEL: NO PARENTS <-> NOT A SUBSTEP
      let view: JSX.Element;
      if (parentPath.length === 0) {
        // Top-level steps always show the full view.
        view = (
          <div
            className={`step-box 
            ${step.isDeleting ? "fade-out" : ""} 
            ${step.isexpanded ? "expanded" : ""} 
            ${step.isHyperExpanded ? "hyperExpanded" : ""} 
            ${
              justExpanding?.toString() === currentPath.toString()
                ? "isexpanding"
                : ""
            }
          `}
            id={step.id}
            style={{
              backgroundColor: getStepBoxColor(step),
              border: "1px " + getBorder(step) + " black",
            }}
          >
            <div className="step-title">
              <div className="step-title-inner">{titleLabel}</div>
              <div className="icon-container-start-right">
                <div className="leftSide-Icons">
                  <The_muskeltiers
                    number={hintNumber}
                    fill={hintNumber ? "yellow" : "none"}
                    prompt={step.prompt}
                    stepNumber={displayPath}
                    onAddChild={() =>
                      insertSubStepAtPath(currentPath, 0, false)
                    }
                    onEditStep={() =>
                      handleStartEditing(currentPath, step.content)
                    }
                    onGiveHint={() => handleGiveHint(currentPath, hintNumber)}
                    onSplitStep={HandleOnSplitStep(currentPath)}
                    onShowImplemented={async () => HandleImplemented()}
                  />
                  <div className="trash">
                    <Trash
                      onClick={() => handleRemoveStep(step.id)}
                      cursor="pointer"
                      strokeWidth={"1.2"}
                      className="trash-icon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isCurrentlyEditing ? (
              <textarea
                autoFocus
                className="inline-edit-textarea-editing"
                rows={3}
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              <div
                className={`step-content ${
                  step.showCorrectStep1 ? "step-content-hinted" : ""
                }`}
                onDoubleClick={() =>
                  handleStartEditing(currentPath, step.content)
                }
              >
                {step.isexpanded ? step.content : ""}
              </div>
            )}

            {step.children && step.children.length > 0 && step.isexpanded && (
              <div className="substeps">
                {renderTree(step.children, currentPath)}
              </div>
            )}
          </div>
        );
      } else {
        // For substeps: always render the base view (title and icons) only.
        view = (
          <div
            className={`step-box sub-steps ${
              step.isDeleting ? "fade-out" : ""
            } ${step.isexpanded ? "expanded" : ""} ${
              step.isHyperExpanded ? "hyperExpanded" : ""
            } ${
              justExpanding?.toString() === currentPath.toString()
                ? "isexpanding"
                : ""
            }`}
            id={step.id}
            style={{
              backgroundColor: getBackgroundColor(step),
              border: "1px " + getBorder(step) + " black",
            }}
            onClick={handleTitleClick}
          >
            <div className="step-title">
              <div className="step-title-inner">{titleLabel}</div>
              <div className="icon-container-start-right">
                <div className="leftSide-Icons">
                  <div className="trash">
                    <Trash
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStep(step.id);
                      }}
                      cursor="pointer"
                      strokeWidth={"1.2"}
                      className="trash-icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Push the view and the plus button after it.
      elements.push(
        <Fragment key={`step-${currentPath.join("-")}`}>
          {view}
          <Fragment
            key={
              parentPath.length === 0
                ? `plus-top-${index + 1}`
                : `${parentPath.join("-")}-plus-${index + 1}`
            }
          >
            {parentPath.length === 0 ? (
              <PlusbetweenSteps
                onClick={() => insertTopLevelStepAt(index + 1)}
              />
            ) : (
              <PlusbetweenSteps
                onClick={() =>
                  insertSubStepAtPath(parentPath, index + 1, false)
                }
              />
            )}
          </Fragment>
        </Fragment>
      );

      // --- TOP-LEVEL ONLY ---
      // Immediately after a top-level step, collect its promoted substeps.
      if (
        parentPath.length === 0 &&
        step.children &&
        step.children.length > 0
      ) {
        const promoted = collectPromotedSubsteps(step.children, currentPath);
        if (promoted.length > 0) {
          elements.push(...promoted);
          elements.push(
            <PlusbetweenSteps
              key={`external-promoted-plus-after-${currentPath.join("-")}`}
              onClick={() => insertTopLevelStepAt(currentPath[0] + 1)}
            />
          );
        }
      }
    });

    return elements;
  }

  /* ------------------------------------
Biggest render Tree ever recored END
------------------------------------ */

  return (
    <div className="Right-Side-main">
      <div className="right-sidecontent-main">
        <div className="right-header-main">
          Step Tree
          {steps.length > 0 && (
            <div className="trash">
              <ShieldCheck
                color="black"
                size={"1vw"}
                strokeWidth={1}
                cursor="pointer"
                className="trash-icon"
                onClick={async () => HandleImplemented()}
              />
              <Trash
                color="black"
                size={"1vw"}
                strokeWidth={1}
                cursor="pointer"
                onClick={HandleDeleteTree}
                className="trash-icon"
              />
            </div>
          )}
        </div>
        <div className="right-main-main">
          <div
            className={`container-step-tree
          ${!sentPrompt ? "height100" : ""}`}
          >
            {steps.length > 0 ? (
              <>
                <div className="button-container">
                  <button
                    className="Check-button"
                    onClick={() => handleGenerateWithChatGPTCheck("Check")}
                    disabled={loading}
                    style={{
                      padding: "6px 12px",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    <div className="Check">
                      {loading ? "Checking..." : "Check"}
                    </div>
                  </button>
                </div>
                {renderTree(steps)}
              </>
            ) : (
              <div className={`input-container ${loading ? "loading" : ""}`}>
                <div className="textarea-wrapper">
                  {!loading && (
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={handleInput}
                      className="text-input"
                      placeholder="Enter Your Thoughts"
                      rows={1}
                    />
                  )}
                  <button
                    className={`button-inside  ${loading ? "loadingB" : ""}`}
                    onClick={() => handleGenerateWithChatGPT("From Prompt")}
                    disabled={loading}
                  >
                    {loading ? <span className="spinner">✔</span> : "✔"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== FULLSCREEN OVERLAY ========== */}
      {showCorrectStepOverlay && (
        <CorrectStepOverlay
          onClose={() => setShowCorrectStepOverlay(null)}
          onConfirm={handleGiveCorrectStep}
          saveChecked={saveCorrectStep}
          setSaveChecked={setSaveCorrectStep}
        />
      )}
    </div>
  );
};

export default StartRight;
