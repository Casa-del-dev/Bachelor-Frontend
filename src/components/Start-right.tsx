import { useState, useEffect, useRef, JSX, Fragment } from "react";
import { Dispatch, SetStateAction } from "react";
import "./Start-right.css";
import {
  Trash,
  /*   Plus,
  Minus,
  MoveDiagonal,
  Martini, */
  ShieldCheck,
  ArrowDown,
  Minus,
  AlignJustify,
  /* Divide, */
} from "lucide-react";
import { Step } from "./Start";
import The_muskeltiers from "./BuildingBlocks/The_muskeltiers";
import { problemDetailsMap } from "./BuildingBlocks/ProblemDetailsText";
import { useAuth } from "../AuthContext";
import { apiCall } from "./AI_Prompt";
import PlusbetweenSteps from "./BuildingBlocks/PlusBetweenSteps";
import { apiCallCheck } from "./AI_Check";
import apiCallTree from "./AI_Tree";
import CustomLightbulb from "./BuildingBlocks/Custom-Lightbulb";
import {
  getStepsData,
  getChanged,
  setChanged,
} from "./BuildingBlocks/StepsData";

export interface FileItem {
  id: number;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
}

const tutorialStepTree1: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: `# Step 1
    roman_map = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    }`,
    content: "Create a mapping of Roman numerals to their integer values.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-2602",
    code: `# Step 2
    total = 0
    prev_value = 0`,
    content: "Initialize total and previous value variables.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-1176",
    code: `# Step 3
    for char in reversed(s):`,
    content:
      "Iterate over the characters in the reversed Roman numeral string.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "Consider breaking down the iteration process into smaller steps.",
    detailed_hint:
      "Each iteration involves multiple actions: retrieving the value, comparing it, and updating the total and previous value.",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-224",
    code: `# Step 4
    return total`,
    content: "Return the total integer value.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-8468",
    code: `# Step 3.1
        value = roman_map[char]`,
    content:
      "Retrieve the integer value for the current Roman numeral character.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-9166",
    code: `# Step 3.2
        if value < prev_value:
            total -= value  # Subtract if a smaller value precedes a larger one
        else:
            total += value
            prev_value = value`,
    content:
      "Compare the current value with the previous value to decide whether to add or subtract.",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialStepTree2: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: ``,
    content: "Test with children",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [
      {
        id: "step-1749592767704-9237",
        code: ``,
        content: "Child",
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
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: false,
        isexpanded: true,
        isHyperExpanded: false,
        selected: false,
      },
    ],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialStepTree3: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: ``,
    content: "Test with children",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "",
      can_be_further_divided: "",
    },
    general_hint: "",
    detailed_hint: "",
    hasparent: false,
    children: [
      {
        id: "step-1749592767704-9237",
        code: ``,
        content: "Child",
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
        showGeneralHint1: false,
        showDetailedHint1: false,
        showCorrectStep1: false,
        showGeneralHint2: false,
        showDetailedHint2: false,
        isNewlyInserted: false,
        isexpanded: true,
        isHyperExpanded: false,
        selected: true,
      },
    ],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialStepTree4: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: ``,
    content: "Missing step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "missing",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5928",
    code: ``,
    content: "Incorrect step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "incorrect",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5783",
    code: ``,
    content: "Correct but further dividable step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-9126",
    code: ``,
    content: "Correct step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialStepTree5: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: ``,
    content: "Missing step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "missing",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: true,
    showDetailedHint1: true,
    showCorrectStep1: false,
    showGeneralHint2: true,
    showDetailedHint2: true,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5928",
    code: ``,
    content: "Incorrect step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "incorrect",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5783",
    code: ``,
    content: "Correct but further dividable step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-9126",
    code: ``,
    content: "Correct step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

const tutorialStepTree6: Step[] = [
  {
    id: "step-1749592767704-5318",
    code: `aa`,
    content: "Missing step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "missing",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: true,
    showDetailedHint1: true,
    showCorrectStep1: false,
    showGeneralHint2: true,
    showDetailedHint2: true,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5928",
    code: `aa`,
    content: "Incorrect step",
    correctStep: "Correct Step",
    prompt: "",
    status: {
      correctness: "incorrect",
      can_be_further_divided: "",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-5783",
    code: `aa`,
    content: "Correct but further dividable step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint: "General Hint",
    detailed_hint: "Detailed Hint",
    hasparent: false,
    children: [],
    isDeleting: false,
    showGeneralHint1: false,
    showDetailedHint1: false,
    showCorrectStep1: false,
    showGeneralHint2: false,
    showDetailedHint2: false,
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
  {
    id: "step-1749592767704-9126",
    code: `# Step 4
    return total`,
    content: "Correct step",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "cannot",
    },
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
    isNewlyInserted: false,
    isexpanded: true,
    isHyperExpanded: false,
    selected: false,
  },
];

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
        color: "black",
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

// ======================
// STEPS
// ======================

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

interface StartRightProps {
  fontSize: string;
  hoveredStepId: string | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fromEditor: boolean;
  setFromEditor: Dispatch<SetStateAction<boolean>>;
  codeMap: Record<string, string | null>;
  setCodeForFile: (fileId: number, code: string) => void;
  currentFile: number | null;
  fileTree: FileItem[];

  stepTree: Step[];
  setStepTree: React.Dispatch<React.SetStateAction<Step[]>>;

  ref1?: any;
  ref2?: React.RefObject<HTMLDivElement>;
  ref3?: React.RefObject<HTMLDivElement>;
  ref4?: React.RefObject<HTMLDivElement>;
  ref5?: React.RefObject<HTMLDivElement>;
  ref6?: any;
  ref7?: any;
  ref8?: React.RefObject<HTMLDivElement>;
  ref9?: React.RefObject<HTMLDivElement>;
  ref10?: React.RefObject<HTMLDivElement>;
  ref11?: React.RefObject<HTMLDivElement>;
  ref12?: React.RefObject<HTMLDivElement>;
  ref13?: React.RefObject<HTMLDivElement>;
  ref14?: React.RefObject<HTMLDivElement>;
  ref15?: React.RefObject<HTMLDivElement>;
  ref16?: any;
  ref17?: any;
  ref18?: React.RefObject<HTMLDivElement>;
  ref19?: React.RefObject<HTMLDivElement>;
  ref20?: React.RefObject<HTMLDivElement>;
  ref21?: React.RefObject<HTMLDivElement>;
  ref22?: React.RefObject<HTMLDivElement>;
  ref23?: React.RefObject<HTMLDivElement>;
  ref24?: React.RefObject<HTMLDivElement>;
  ref25?: React.RefObject<HTMLDivElement>;
  ref26?: any;
  ref27?: React.RefObject<HTMLDivElement>;
  stepIndexTutorial: number;
  isCustom: boolean;
  problemDescription: string;
}

const StartRight: React.FC<StartRightProps> = ({
  fontSize,
  hoveredStepId,
  loading,
  setLoading,
  fromEditor,
  setFromEditor,
  codeMap,
  setCodeForFile,
  currentFile,
  stepTree,
  setStepTree,
  fileTree,

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
  ref12,
  ref13,
  ref14,
  ref15,
  ref16,
  ref17,
  ref18,
  ref19,
  ref20,
  ref21,
  ref22,
  ref23,
  ref24,
  ref25,
  ref26,
  ref27,
  stepIndexTutorial,
  isCustom,
  problemDescription,
}) => {
  const [text, setText] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const skipHydration = useRef(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const { isAuthenticated } = useAuth();
  const [fadeInTree, setFadeInTree] = useState(false);
  const pendingStepTreeUpdate = useRef<Step[] | null>(null);

  // For revealing correct steps
  const [showCorrectStepOverlay, setShowCorrectStepOverlay] = useState<
    number[] | null
  >(null);
  const [saveCorrectStep, setSaveCorrectStep] = useState(false);

  // ephemeral for fade-in
  const [justUnlockedHintId, setJustUnlockedHintId] = useState<string | null>(
    null
  );

  const [justExpanding] = useState<number[]>([]);

  const [sentPrompt, setSentPrompt] = useState<boolean>(false);

  useEffect(() => {
    setSentPrompt(steps.length > 0);
  }, [steps]);

  useEffect(() => {
    if (skipHydration.current) {
      skipHydration.current = false;
    } else if (stepTree.length >= 0 && !localStorage.getItem("tutorialStep")) {
      setSteps(stepTree);
    }
  }, [stepTree]);

  useEffect(() => {
    if (
      pendingStepTreeUpdate.current &&
      !localStorage.getItem("tutorialStep")
    ) {
      setStepTree(pendingStepTreeUpdate.current);
      pendingStepTreeUpdate.current = null;
    }
  }, [steps]);

  function updateSteps(updater: Step[] | ((prev: Step[]) => Step[])) {
    skipHydration.current = true;
    if (typeof updater === "function") {
      setSteps((prev) => {
        const updated = (updater as (prev: Step[]) => Step[])(prev);
        pendingStepTreeUpdate.current = updated;
        return updated;
      });
    } else {
      setSteps(updater);
      pendingStepTreeUpdate.current = updater;
    }
  }

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
      isexpanded: true,
      isHyperExpanded: false,

      selected: /* hasParent ? true : */ false,
    };
  }

  function transformStepsObject(obj: any, hasParent: boolean = false): Step[] {
    return Object.keys(obj).map((key) => transformStep(obj[key], hasParent));
  }

  function findItemById(tree: FileItem[], targetId: number): FileItem | null {
    for (const item of tree) {
      if (item.id === targetId) return item;
      if (item.type === "folder" && item.children) {
        const found = findItemById(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  async function HandleImplemented() {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }

    if (
      currentFile === null ||
      findItemById(fileTree, currentFile) === null ||
      findItemById(fileTree, currentFile)?.type === "folder"
    )
      return;

    setSteps([]);
    setLoading(true);
    setLoadingCheck(true);

    try {
      const code = codeMap[currentFile];
      const gptResponse = await apiCallTree(JSON.stringify(steps), code || "");
      const rawMessage = gptResponse.choices[0].message.content;

      if (!rawMessage) {
        throw new Error("GPT response missing message content.");
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(rawMessage);
      } catch (e) {
        console.error("Failed to parse GPT response:", rawMessage);
        throw e;
      }

      if (parsedResponse.code) {
        if (typeof parsedResponse.code === "object") {
          Object.entries(parsedResponse.code).forEach(([fileId, codeValue]) => {
            if (typeof codeValue === "string") {
              setCodeForFile(Number(fileId), codeValue);
            } else {
              console.warn(`Invalid code for fileId ${fileId}:`, codeValue);
            }
          });
        } else if (typeof parsedResponse.code === "string") {
          // Apply to the currently active file
          if (currentFile !== null) {
            setCodeForFile(currentFile, parsedResponse.code);
          } else {
            console.warn(
              "Received single code string, but no current file is selected."
            );
          }
        } else {
          console.warn(
            "Unexpected type for 'code':",
            typeof parsedResponse.code
          );
        }
      } else {
        console.warn(
          "No 'code' field found in parsed response:",
          parsedResponse
        );
      }

      // Extract steps
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);
      setText("");
      setSentPrompt(true);
      updateSteps(stepsArray);
      setFadeInTree(true);
      setTimeout(() => setFadeInTree(false), 2000);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
      setLoadingCheck(false);
    }
  }

  /* -------------------------------------------------------------
Checking Code and Tree START
------------------------------------------------------------- */

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
      if (step.status.correctness === "missing") return "#ffffff";
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
      if (
        step.status.correctness === "incorrect" ||
        step.status.correctness === "missing"
      ) {
        return "black";
      }
      return "white";
    }

    return "black";
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
    const selectedProblemDetails = isCustom
      ? problemDescription
      : problemDetailsMap[selectedProblem];

    setLoading(true);
    setLoadingCheck(true);

    try {
      const gptResponse = await apiCall(text, selectedProblemDetails);
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      // Extract steps
      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);

      updateSteps(stepsArray);
      setFadeInTree(true);
      setText("");
      setSentPrompt(true);
      setTimeout(() => setFadeInTree(false), 2000);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoading(false);
      setLoadingCheck(false);
    }
  }

  //This is: for editor to steptree
  useEffect(() => {
    if (fromEditor) {
      HandleDeleteTree();
    }
    const fetchStepsData = () => {
      if (getChanged()) {
        const newStepsData = getStepsData();
        if (!newStepsData || localStorage.getItem("tutorialStep")) return;

        try {
          const stepsArray = transformStepsObject(newStepsData);

          updateSteps(stepsArray);
          setStepTree(stepsArray);
          setSentPrompt(true);
          setText("");
          setFadeInTree(true);
          setTimeout(() => setFadeInTree(false), 2000);
        } catch (error) {
          console.error("Error processing steps data:", error);
        } finally {
          setLoading(false);
          setLoadingCheck(false);
          setFromEditor(false);
          setChanged(false);
        }
      }
    };

    // Poll every 3 seconds for changes
    const interval = setInterval(fetchStepsData, 3000);
    return () => clearInterval(interval);
  }, [fromEditor]);

  async function handleGenerateWithChatGPTCheck(Context: string) {
    if (!isAuthenticated) {
      console.log("Login Needed");
      return;
    }
    if (Context === "From Prompt" && text.trim() === "") return;

    const selectedProblem =
      localStorage.getItem("selectedProblem") || "Default Problem";
    const selectedProblemDetails = isCustom
      ? problemDescription
      : problemDetailsMap[selectedProblem];

    setLoadingCheck(true);
    setLoading(true);

    try {
      const gptResponse = await apiCallCheck(
        selectedProblemDetails,
        JSON.stringify(steps)
      );
      const rawMessage = gptResponse.choices[0].message.content;
      const parsedResponse = JSON.parse(rawMessage);

      const stepsData = parsedResponse.steps
        ? parsedResponse.steps
        : parsedResponse;

      const stepsArray = transformStepsObject(stepsData);

      updateSteps(stepsArray);
      setText("");
      setFadeInTree(true);
      setTimeout(() => setFadeInTree(false), 2000);
    } catch (error) {
      console.error("Error generating steps with ChatGPT:", error);
    } finally {
      setLoadingCheck(false);
      setLoading(false);
    }
  }

  /* ------------------------------------------------------
Delete Functions START
------------------------------------------------------ */

  const HandleDeleteTree = () => {
    updateSteps([]);
    setSentPrompt(false);
  };

  // Removal with fade-out
  const handleRemoveStep = (id: string) => {
    updateSteps((prevSteps) =>
      prevSteps.map((step) => markStepAndChildrenAsDeleting(step, id))
    );

    setTimeout(() => {
      updateSteps((prevSteps) => {
        const newSteps = removeStepById(prevSteps, id);
        return newSteps;
      });
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

    updateSteps((prevSteps) => {
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
    updateSteps((prevSteps) => {
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

    updateSteps((prevSteps) => {
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

    /*     const editingStep = path ? getStepAtPath(steps, path) : null;
    console.log("Editing step:", editingStep); */

    if (isSamePath) {
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
        updateSteps((prev) =>
          updateStepContentAtPath(prev, editingPath!, tempContent)
        );
        setEditingPath(null);
        setTempContent("");
      }
    }, 100);
  }

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
        current[idx].status.correctness = "";
        current[idx].status.can_be_further_divided = "";
        current[idx].code = "";
        current[idx].showCorrectStep1 = false;
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

  /* ----------------------------------------------------------
  Editing logic END
  ---------------------------------------------------------- */

  /* ---------------------------------------
  Giving hint step END
  --------------------------------------- */
  // HINT Logic
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

    updateSteps((prevSteps) => updateStepHints(prevSteps));
  }

  // Reveal correct step
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

  // handleGiveHint
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

  /* ---------------------------------------
  Giving hint step END
  --------------------------------------- */

  useEffect(() => {
    // Utility: Try to get an element by its raw ID or with a "-promoted" suffix.
    const getElement = (id: string | null): HTMLElement | null => {
      if (!id) return null;
      return (
        document.getElementById(id) || document.getElementById(`${id}-promoted`)
      );
    };

    // Recursive function that, given a starting ID (for the hovered step),
    // will climb upward using your steps tree until it finds a rendered element.
    const findClosestHighlightElement = (
      stepsArray: Step[],
      currentId: string | null
    ): HTMLElement | null => {
      const el = getElement(currentId);
      if (el) return el;
      // If not found, try to get the parent ID of the currentId.
      const findParentId = (
        steps: Step[],
        targetId: string,
        parentId: string | null = null
      ): string | null => {
        for (const step of steps) {
          if (step.id === targetId) {
            return parentId;
          }
          if (step.children && step.children.length > 0) {
            const found = findParentId(step.children, targetId, step.id);
            if (found) return found;
          }
        }
        return null;
      };

      const parentId = findParentId(stepsArray, currentId!);
      if (parentId) {
        return findClosestHighlightElement(stepsArray, parentId);
      }
      return null;
    };

    // Start by trying to get the element directly from the hoveredStepId.
    let targetElement = getElement(hoveredStepId);
    // If not found, try climbing up the tree.
    if (!targetElement && hoveredStepId) {
      targetElement = findClosestHighlightElement(steps, hoveredStepId);
    }

    // If an element was found, add the highlighted class and scroll into view.
    if (targetElement) {
      targetElement.classList.add("highlighted-step");
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Cleanup: remove the highlight class when the hoveredStepId or steps change.
    return () => {
      if (targetElement) {
        targetElement.classList.remove("highlighted-step");
      }
    };
  }, [hoveredStepId, steps]);

  /* ---------------------------------------
  Splitting step function START
  --------------------------------------- */
  function newId() {
    return `step-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  const resetSelectedFlags = (step: Step): Step => {
    step.id = newId(); // assign a new unique id for this step
    if (step.children && step.children.length > 0) {
      step.children = step.children.map(resetSelectedFlags);
    }
    return step;
  };

  function HandleOnSplitStep(path: number[]) {
    return () => {
      let stepToClone!: Step;
      let clonedStep!: Step;

      updateSteps((prevSteps) => {
        const newSteps = JSON.parse(JSON.stringify(prevSteps)) as Step[];

        let current = newSteps;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]].children;
        }

        const idx = path[path.length - 1];
        stepToClone = current[idx];

        clonedStep = {
          ...JSON.parse(JSON.stringify(stepToClone)),
          isNewlyInserted: true,
          isDeleting: false,
          selected: stepToClone.selected,
        };

        clonedStep = resetSelectedFlags(clonedStep);

        current.splice(idx + 1, 0, clonedStep);
        return newSteps;
      });

      setTimeout(() => {
        const originalId = `${stepToClone.id}${
          stepToClone.hasparent ? "-promoted" : ""
        }`;
        const clonedId = `${clonedStep.id}${
          stepToClone.hasparent ? "-promoted" : ""
        }`;

        const originalEl = document.getElementById(originalId);
        const clonedEl = document.getElementById(clonedId);

        if (originalEl && clonedEl) {
          originalEl.classList.remove("dividing-original");
          clonedEl.classList.remove("dividing-new", "fade-from-zero");

          clonedEl.classList.add("fade-from-zero");

          // Forcing reflow to reset animation
          void originalEl.offsetWidth;
          void clonedEl.offsetWidth;

          originalEl.classList.add("dividing-original");
          clonedEl.classList.remove("fade-from-zero");
          clonedEl.classList.add("dividing-new");

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
      }, 0);
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

  function getBorder(step: Step): string {
    if (step.status.correctness === "missing") return "dashed";
    return "solid";
  }

  /* const [expandedblock, setExpadedBlock] = useState<boolean | null>(null); */

  /* function toggleStepExpanded(path: number[]) {
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
  } */

  /* ---------------------------------------------
  Animating Dots for Checking START
  --------------------------------------------- */

  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    if (!loadingCheck) return;
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(interval);
  }, [loadingCheck]);

  /* ---------------------------------------------
  Animating Dots for Checking END
  --------------------------------------------- */

  /* ---------------------------------------------
  Showing substeps when clicked START
  --------------------------------------------- */

  // Toggle function: simply toggles the "selected" flag on the step at currentPath.
  const toggleSelected = (currentPath: number[]) => {
    updateSteps((prevSteps: Step[]) => {
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

  function getLastLabelNumber(label: string): number {
    const parts = label.replace("Substep ", "").split(".");
    return parseInt(parts[parts.length - 1], 10);
  }

  /**
   * Returns the Step at the given path in the steps tree, or null if invalid.
   * @param steps The array of top-level Steps
   * @param path  An array of indices [0, 1, 2], etc.
   */
  function getStepAtPath(steps: Step[], path: number[]): Step | null {
    let currentArray = steps;
    let step: Step | null = null;

    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      if (index < 0 || index >= currentArray.length) {
        return null; // invalid path
      }
      step = currentArray[index];
      currentArray = step.children; // go deeper
    }
    return step;
  }

  const getAllDescendantPaths = (
    step: Step,
    basePath: number[]
  ): { child: Step; path: number[] }[] => {
    let result: { child: Step; path: number[] }[] = [];
    if (step.children && step.children.length > 0) {
      step.children.forEach((child, i) => {
        const childPath = [...basePath, i];
        result.push({ child, path: childPath });
        result = result.concat(getAllDescendantPaths(child, childPath));
      });
    }
    return result;
  };

  const handleUnpromote = (step: Step, currentPath: number[]) => {
    // Animate fade-out for the main promoted element
    animatePromotedFadeOut(`${step.id}-promoted`);

    // Get all descendant promoted elements and animate fade-out
    const descendants = getAllDescendantPaths(step, currentPath);
    descendants.forEach(({ child }) => {
      animatePromotedFadeOut(`${child.id}-promoted`);
    });

    // After a short delay (allowing the fade-out to play), toggle the selection state off
    setTimeout(() => {
      toggleSelected(currentPath);
      // Also deselect any descendant steps that might still be selected
      descendants.forEach(({ child, path }) => {
        if (child.selected) {
          toggleSelected(path);
        }
      });
    }, 300);
  };

  //step-box MaxWidth then we change the way we see the icons
  const [burgerIcon, setBurgerIcon] = useState(false);
  const [openBurgerFor, setOpenBurgerFor] = useState<string | null>(null);
  const wrapperRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (openBurgerFor) {
        const wrapper = wrapperRefs.current[openBurgerFor];
        if (wrapper && !wrapper.contains(e.target as Node)) {
          setOpenBurgerFor(null);
        }
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && openBurgerFor) {
        setOpenBurgerFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [openBurgerFor]);

  const stepBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepBoxRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        // toggle burgerIcon based on width
        setBurgerIcon(width <= 403);
      }
    });

    observer.observe(stepBoxRef.current);

    return () => {
      observer.disconnect();
    };
  }, [stepBoxRef]);

  // Helper to collect promoted substeps from a (nested) children array.
  // This function returns an array of JSX elements representing the promoted
  // substeps (i.e. those with selected === true) that should be rendered
  // at the top-level domain, immediately after their parent.
  function collectPromotedSubsteps(
    steps: Step[],
    parentPath: number[],
    all_step: Step[]
  ): JSX.Element[] {
    let promotedElements: JSX.Element[] = [];

    steps.forEach((step, index) => {
      const currentPath = [...parentPath, index];

      if (step.selected) {
        const displayPath = currentPath.map((i) => i + 1).join(".");
        const titleLabel = `Substep ${displayPath}:`;

        const currentIndex = currentPath[currentPath.length - 1];

        const isFirstSibling = currentIndex === 0;

        const parentPath = currentPath.slice(0, -1);
        const parentStep = getStepAtPath(all_step, parentPath);
        const siblingArray = parentStep ? parentStep.children : all_step;
        const isLastSibling = currentIndex === siblingArray.length - 1;
        const parentPathOfSubstep = currentPath.slice(0, -1);
        const indexInParent = currentPath[currentPath.length - 1];
        const isThisNodeEditing =
          editingPath !== null &&
          editingPath.length === currentPath.length &&
          editingPath.every((v, i) => v === currentPath[i]);

        promotedElements.push(
          <Fragment key={`promoted-${currentPath.join("-")}`}>
            {/* Top PLUS: insert before this substep */}
            <div
              className="promotedPlus"
              key={`wrapper-promoted-plus-top-${currentPath.join("-")}`}
            >
              <PlusbetweenSteps
                key={`external-promoted-plus-top-${currentPath.join("-")}`}
                tooltip={`Insert step ${parentPathOfSubstep
                  .map((i) => i + 1)
                  .join(".")}.${indexInParent + 1}`}
                onClick={() => {
                  insertSubStepAtPathFromSelected(
                    parentPathOfSubstep,
                    indexInParent,
                    true
                  );
                }}
                style={{ width: `100%` }}
              />
            </div>

            <div
              className="container-step-hint"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Promoted Step */}
              <div
                className={`step-box promoted
                ${step.isDeleting && step.selected ? "fade-out" : ""} 
                            ${
                              step.id === hoveredStepId
                                ? "highlighted-step"
                                : ""
                            }

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
                  backgroundColor: getStepBoxColor(step),
                  border: "1px " + getBorder(step) + " black",
                  color: getStepBoxTextColor(step),
                }}
              >
                <div className="unpromote">
                  <Minus
                    className="unpromote-icon"
                    onClick={() => handleUnpromote(step, currentPath)}
                  />
                </div>
                <div className="step-title">
                  <div className="step-title-inner">{titleLabel}</div>
                  <div
                    className={`icon-container-start-right ${
                      burgerIcon ? "one" : ""
                    }`}
                  >
                    {burgerIcon ? (
                      <div
                        ref={(el) => {
                          wrapperRefs.current[step.id] = el;
                        }}
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <AlignJustify
                          className="burger-icon-startRight"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenBurgerFor((of) =>
                              of === step.id ? null : step.id
                            );
                          }}
                        />

                        {openBurgerFor === step.id && (
                          <div
                            className="burger-dropdown"
                            onClick={() => {
                              setOpenBurgerFor(null);
                            }}
                          >
                            <div className="container-vertical-muskultiers">
                              <The_muskeltiers
                                onEditStep={() =>
                                  handleStartEditing(currentPath, step.content)
                                }
                                vertical={burgerIcon ?? true}
                                onSplitStep={HandleOnSplitStep(currentPath)}
                                selected={isThisNodeEditing}
                              />
                            </div>
                            <CustomLightbulb
                              number={getNumberForStep(step)}
                              fill={getNumberForStep(step) ? "yellow" : "none"}
                              color={getStepBoxTextColor(step)}
                              onGiveHint={() =>
                                handleGiveHint(
                                  currentPath,
                                  getNumberForStep(step)
                                )
                              }
                            />
                            <Trash
                              onClick={() => {
                                const key = `animatedSubsteps-${parentPath.join(
                                  "-"
                                )}`;
                                const currentIndex = getInitialIndex(key);
                                const lastLabel =
                                  getLastLabelNumber(titleLabel);

                                if (currentIndex >= lastLabel)
                                  setInitialIndex(key, currentIndex - 1);
                                handleRemoveStep(step.id);
                              }}
                              cursor="pointer"
                              strokeWidth={"1.2"}
                              color={getStepBoxTextColor(step)}
                              className="trash-icon"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="leftSide-Icons">
                          <The_muskeltiers
                            onEditStep={() =>
                              handleStartEditing(currentPath, step.content)
                            }
                            onSplitStep={HandleOnSplitStep(currentPath)}
                            selected={isThisNodeEditing}
                          />
                        </div>
                        <div className="trash">
                          <CustomLightbulb
                            number={getNumberForStep(step)}
                            fill={getNumberForStep(step) ? "yellow" : "none"}
                            color={getStepBoxTextColor(step)}
                            onGiveHint={() =>
                              handleGiveHint(
                                currentPath,
                                getNumberForStep(step)
                              )
                            }
                          />
                          <Trash
                            onClick={() => {
                              const key = `animatedSubsteps-${parentPath.join(
                                "-"
                              )}`;
                              const currentIndex = getInitialIndex(key);
                              const lastLabel = getLastLabelNumber(titleLabel);

                              if (currentIndex >= lastLabel)
                                setInitialIndex(key, currentIndex - 1);
                              handleRemoveStep(step.id);
                            }}
                            cursor="pointer"
                            strokeWidth={"1.2"}
                            color={getStepBoxTextColor(step)}
                            className="trash-icon"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {editingPath &&
                editingPath.length === currentPath.length &&
                editingPath.every((val, i) => val === currentPath[i]) ? (
                  <textarea
                    autoFocus
                    onFocus={(e) => {
                      const len = e.currentTarget.value.length;
                      e.currentTarget.setSelectionRange(len, len);
                    }}
                    className="inline-edit-textarea-editing"
                    style={{ color: getStepBoxTextColor(step) }}
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

                {step.children &&
                step.children.length > 0 &&
                step.isexpanded ? (
                  <div className="orientation-substeps">
                    <div className="orientation">
                      <div className="orientation-parent">
                        <button
                          className="orientation-buttons middle"
                          onClick={() => {
                            const parentPath = currentPath.slice(0, -1);
                            const parentStep = getStepAtPath(
                              all_step,
                              parentPath
                            );
                            if (!parentStep) {
                              console.warn(
                                "No parent found at path:",
                                parentPath
                              );
                              return;
                            }
                            const parentEl = document.getElementById(
                              parentStep.id
                            );
                            if (parentEl) {
                              parentEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              parentEl.classList.add("highlighted");

                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        parentEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(parentEl);
                            } else {
                              const parentEl2 = document.getElementById(
                                parentStep.id + "-promoted"
                              );
                              if (parentEl2) {
                                parentEl2.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                                parentEl2.classList.add("highlighted");

                                const observer = new IntersectionObserver(
                                  (entries, obs) => {
                                    entries.forEach((entry) => {
                                      if (entry.intersectionRatio >= 0.9) {
                                        setTimeout(() => {
                                          parentEl2.classList.remove(
                                            "highlighted"
                                          );
                                        }, 1000);
                                        obs.disconnect();
                                      }
                                    });
                                  },
                                  { threshold: 0.9 }
                                );
                                observer.observe(parentEl2);
                              }
                            }
                          }}
                        >
                          Parent
                        </button>
                      </div>
                      <div className="orientation-siblings">
                        <button
                          id={step.id + "-promoted-left"}
                          className={`orientation-buttons left ${
                            isFirstSibling ? "isEdgeSibling" : ""
                          }`}
                          disabled={isFirstSibling}
                          onClick={() => {
                            if (isFirstSibling) {
                              console.warn(
                                "Already at the first sibling; no previous sibling."
                              );
                              return;
                            }
                            const siblingPath = [...currentPath];
                            siblingPath[siblingPath.length - 1] =
                              currentIndex - 1;
                            const siblingStep = getStepAtPath(
                              all_step,
                              siblingPath
                            );
                            if (!siblingStep) {
                              console.warn(
                                "No previous sibling found at path:",
                                siblingPath
                              );
                              return;
                            }
                            const siblingEl = document.getElementById(
                              siblingStep.id + "-promoted"
                            );
                            if (siblingEl) {
                              siblingEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl);
                            } else {
                              if (!siblingStep.selected) {
                                toggleSelected(siblingPath);
                                setTimeout(() => {
                                  animatePromotedFadeIn(
                                    `${siblingStep.id}-promoted`
                                  );
                                }, 0);
                              }

                              //same as if entered in if
                              setTimeout(() => {
                                const siblingEl2 = document.getElementById(
                                  siblingStep.id + "-promoted"
                                );

                                if (siblingEl2) {
                                  siblingEl2.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  siblingEl2.classList.add("highlighted");
                                  const observer = new IntersectionObserver(
                                    (entries, obs) => {
                                      entries.forEach((entry) => {
                                        if (entry.intersectionRatio >= 0.9) {
                                          setTimeout(() => {
                                            siblingEl2.classList.remove(
                                              "highlighted"
                                            );
                                          }, 1000);
                                          obs.disconnect();
                                        }
                                      });
                                    },
                                    { threshold: 0.9 }
                                  );
                                  observer.observe(siblingEl2);
                                }
                              }, 1);
                            }
                          }}
                        >
                          Previous
                        </button>

                        <button
                          id={step.id + "-promoted-right"}
                          className={`orientation-buttons right ${
                            isLastSibling ? "isEdgeSibling" : ""
                          }`}
                          disabled={isLastSibling}
                          onClick={() => {
                            if (isLastSibling) {
                              console.warn(
                                "Already at the last sibling; no next sibling available."
                              );
                              return;
                            }

                            const siblingPath = [...currentPath];
                            const currentIndex =
                              currentPath[currentPath.length - 1];
                            siblingPath[siblingPath.length - 1] =
                              currentIndex + 1;

                            const siblingStep = getStepAtPath(
                              all_step,
                              siblingPath
                            );
                            if (!siblingStep) {
                              console.warn(
                                "No next sibling found at path:",
                                siblingPath
                              );
                              return;
                            }

                            const siblingEl = document.getElementById(
                              siblingStep.id + "-promoted"
                            );
                            if (siblingEl) {
                              siblingEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl.classList.add("highlighted");

                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );

                              observer.observe(siblingEl);
                            } else {
                              if (!siblingStep.selected) {
                                toggleSelected(siblingPath);
                                setTimeout(() => {
                                  animatePromotedFadeIn(
                                    `${siblingStep.id}-promoted`
                                  );
                                }, 0);
                              }

                              //same as if entered in if
                              setTimeout(() => {
                                const siblingEl2 = document.getElementById(
                                  siblingStep.id + "-promoted"
                                );

                                if (siblingEl2) {
                                  siblingEl2.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  siblingEl2.classList.add("highlighted");
                                  const observer = new IntersectionObserver(
                                    (entries, obs) => {
                                      entries.forEach((entry) => {
                                        if (entry.intersectionRatio >= 0.9) {
                                          setTimeout(() => {
                                            siblingEl2.classList.remove(
                                              "highlighted"
                                            );
                                          }, 1000);
                                          obs.disconnect();
                                        }
                                      });
                                    },
                                    { threshold: 0.9 }
                                  );
                                  observer.observe(siblingEl2);
                                }
                              }, 1);
                            }
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    <div className="substeps">
                      <AnimatedSubsteps
                        substeps={step.children}
                        parentPath={currentPath}
                        parentId={step.id}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="orientation-filling">
                    <div className="orientation">
                      <div className="orientation-parent">
                        <button
                          className="orientation-buttons middle"
                          onClick={() => {
                            const parentPath = currentPath.slice(0, -1);
                            const parentStep = getStepAtPath(
                              all_step,
                              parentPath
                            );
                            if (!parentStep) {
                              console.warn(
                                "No parent found at path:",
                                parentPath
                              );
                              return;
                            }
                            const parentEl = document.getElementById(
                              parentStep.id
                            );
                            if (parentEl) {
                              parentEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              parentEl.classList.add("highlighted");

                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        parentEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(parentEl);
                            } else {
                              const parentEl2 = document.getElementById(
                                parentStep.id + "-promoted"
                              );
                              if (parentEl2) {
                                parentEl2.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                                parentEl2.classList.add("highlighted");

                                const observer = new IntersectionObserver(
                                  (entries, obs) => {
                                    entries.forEach((entry) => {
                                      if (entry.intersectionRatio >= 0.9) {
                                        setTimeout(() => {
                                          parentEl2.classList.remove(
                                            "highlighted"
                                          );
                                        }, 1000);
                                        obs.disconnect();
                                      }
                                    });
                                  },
                                  { threshold: 0.9 }
                                );
                                observer.observe(parentEl2);
                              }
                            }
                          }}
                        >
                          Parent
                        </button>
                      </div>
                      <div className="orientation-siblings">
                        <button
                          id={step.id + "-promoted-left"}
                          className={`orientation-buttons left ${
                            isFirstSibling ? "isEdgeSibling" : ""
                          }`}
                          disabled={isFirstSibling}
                          onClick={() => {
                            if (isFirstSibling) {
                              console.warn(
                                "Already at the first sibling; no previous sibling."
                              );
                              return;
                            }
                            const siblingPath = [...currentPath];
                            siblingPath[siblingPath.length - 1] =
                              currentIndex - 1;
                            const siblingStep = getStepAtPath(
                              all_step,
                              siblingPath
                            );
                            if (!siblingStep) {
                              console.warn(
                                "No previous sibling found at path:",
                                siblingPath
                              );
                              return;
                            }
                            const siblingEl = document.getElementById(
                              siblingStep.id + "-promoted"
                            );
                            if (siblingEl) {
                              siblingEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl);
                            } else {
                              if (!siblingStep.selected) {
                                toggleSelected(siblingPath);
                                setTimeout(() => {
                                  animatePromotedFadeIn(
                                    `${siblingStep.id}-promoted`
                                  );
                                }, 0);
                              }

                              //same as if entered in if
                              setTimeout(() => {
                                const siblingEl2 = document.getElementById(
                                  siblingStep.id + "-promoted"
                                );

                                if (siblingEl2) {
                                  siblingEl2.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  siblingEl2.classList.add("highlighted");
                                  const observer = new IntersectionObserver(
                                    (entries, obs) => {
                                      entries.forEach((entry) => {
                                        if (entry.intersectionRatio >= 0.9) {
                                          setTimeout(() => {
                                            siblingEl2.classList.remove(
                                              "highlighted"
                                            );
                                          }, 1000);
                                          obs.disconnect();
                                        }
                                      });
                                    },
                                    { threshold: 0.9 }
                                  );
                                  observer.observe(siblingEl2);
                                }
                              }, 1);
                            }
                          }}
                        >
                          Previous
                        </button>

                        <button
                          id={step.id + "-promoted-right"}
                          className={`orientation-buttons right ${
                            isLastSibling ? "isEdgeSibling" : ""
                          }`}
                          disabled={isLastSibling}
                          onClick={() => {
                            if (isLastSibling) {
                              console.warn(
                                "Already at the last sibling; no next sibling available."
                              );
                              return;
                            }

                            const siblingPath = [...currentPath];
                            const currentIndex =
                              currentPath[currentPath.length - 1];
                            siblingPath[siblingPath.length - 1] =
                              currentIndex + 1;

                            const siblingStep = getStepAtPath(
                              all_step,
                              siblingPath
                            );
                            if (!siblingStep) {
                              console.warn(
                                "No next sibling found at path:",
                                siblingPath
                              );
                              return;
                            }

                            const siblingEl = document.getElementById(
                              siblingStep.id + "-promoted"
                            );
                            if (siblingEl) {
                              siblingEl.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl.classList.add("highlighted");

                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );

                              observer.observe(siblingEl);
                            } else {
                              if (!siblingStep.selected) {
                                toggleSelected(siblingPath);
                                setTimeout(() => {
                                  animatePromotedFadeIn(
                                    `${siblingStep.id}-promoted`
                                  );
                                }, 0);
                              }

                              //same as if entered in if
                              setTimeout(() => {
                                const siblingEl2 = document.getElementById(
                                  siblingStep.id + "-promoted"
                                );

                                if (siblingEl2) {
                                  siblingEl2.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                  });
                                  siblingEl2.classList.add("highlighted");
                                  const observer = new IntersectionObserver(
                                    (entries, obs) => {
                                      entries.forEach((entry) => {
                                        if (entry.intersectionRatio >= 0.9) {
                                          setTimeout(() => {
                                            siblingEl2.classList.remove(
                                              "highlighted"
                                            );
                                          }, 1000);
                                          obs.disconnect();
                                        }
                                      });
                                    },
                                    { threshold: 0.9 }
                                  );
                                  observer.observe(siblingEl2);
                                }
                              }, 1);
                            }
                          }}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                    <div className="container-filling-emptyness">
                      <div
                        className="filling-emptyness"
                        onClick={() =>
                          insertSubStepAtPath(currentPath, 0, false)
                        }
                      >
                        Create a Substep <br /> +
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="hint-container promoted">
                {step.detailed_hint && step.showDetailedHint1 && (
                  <Collapsible
                    isOpen={step.showDetailedHint2}
                    id={`hint-detailed-${step.id}`}
                    toggleHint={toggleHint}
                    stepId={step.id}
                    what={"detailed"}
                  >
                    {/* Show fade-in if we just unlocked it */}
                    <div
                      className={
                        "hint-inner " +
                        (step.showDetailedHint2
                          ? "extended "
                          : "fade-out-hint") +
                        (justUnlockedHintId ===
                        `step-${currentPath.join("-")}-2`
                          ? "fade-in-hint "
                          : "")
                      }
                    >
                      {step.showDetailedHint2 ? (
                        <>
                          <strong>Detailed Hint:</strong>
                          <span className="hint-content">
                            {step.detailed_hint}
                          </span>
                        </>
                      ) : (
                        <div className="not-extented-hint">
                          <strong>Detailed Hint:</strong>
                          <span
                            className="hint-content"
                            style={{ visibility: "hidden" }}
                          >
                            {step.detailed_hint}
                          </span>
                        </div>
                      )}
                    </div>
                  </Collapsible>
                )}

                {step.general_hint && step.showGeneralHint1 && (
                  <Collapsible
                    isOpen={step.showGeneralHint2}
                    id={`hint-general-${step.id}`}
                    toggleHint={toggleHint}
                    stepId={step.id}
                    what={"general"}
                  >
                    <div
                      className={
                        "hint-inner " +
                        (step.showGeneralHint2 ? "extended " : "") +
                        (justUnlockedHintId ===
                        `step-${currentPath.join("-")}-3`
                          ? "fade-in-hint "
                          : "")
                      }
                    >
                      {step.showGeneralHint2 ? (
                        <>
                          <strong>General Hint:</strong>
                          <span className="hint-content">
                            {step.general_hint}
                          </span>
                        </>
                      ) : (
                        <div className="not-extented-hint">
                          <strong>General Hint</strong>
                          <span
                            className="hint-content"
                            style={{ visibility: "hidden" }}
                          >
                            {step.general_hint}
                          </span>
                        </div>
                      )}
                    </div>
                  </Collapsible>
                )}
              </div>
            </div>
          </Fragment>
        );
      }

      // ─── INSERT the “plus” immediately *after* the promoted step with conditions ───
      const parent = currentPath.slice(0, -1);
      const insertionIndex = currentPath[currentPath.length - 1] + 1;

      if (step.selected && !(index === 0 || !steps[index - 1].selected)) {
        promotedElements.push(
          <div
            className="promotedPlus"
            key={`promoted-plus-after-${currentPath.join("-")}`}
          >
            <PlusbetweenSteps
              tooltip={`Insert step ${parent.map((i) => i + 1).join(".")}.${
                insertionIndex + 1
              }`}
              onClick={() =>
                insertSubStepAtPathFromSelected(parent, insertionIndex, true)
              }
              style={{ width: `100%` }}
            />
          </div>
        );
      }

      // Recurse
      if (step.children && step.children.length > 0) {
        promotedElements = promotedElements.concat(
          collectPromotedSubsteps(step.children, currentPath, all_step)
        );
      }
    });

    return promotedElements;
  }

  /* ---------------------------------------------
  Showing substeps when clicked END
  --------------------------------------------- */

  function blendColors(
    color1: string,
    color2: string,
    weight: number = 0.5
  ): string {
    const hexToRgb = (hex: string) => {
      hex = hex.replace("#", "");
      if (hex.length === 3) {
        hex = hex
          .split("")
          .map((c) => c + c)
          .join("");
      }
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const rgbToHex = (r: number, g: number, b: number): string =>
      `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

    // Edge cases
    if (weight <= 0) return color1;
    if (weight >= 1) return color2;

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r * (1 - weight) + rgb2.r * weight);
    const g = Math.round(rgb1.g * (1 - weight) + rgb2.g * weight);
    const b = Math.round(rgb1.b * (1 - weight) + rgb2.b * weight);

    return rgbToHex(r, g, b);
  }

  /* ----------------------------------------
  AnimatedSubsteps Component START
  ---------------------------------------- */
  // This component renders all substeps (only title and trash icon) in a scrollable, animated container.
  // It applies a folding rotation and stacking effect.

  // A single in-memory object to store indices
  const indicesRef = useRef<Record<string, number>>({});

  function getInitialIndex(key: string, defaultValue = 0): number {
    return indicesRef.current[key] ?? defaultValue;
  }

  function setInitialIndex(key: string, index: number): void {
    indicesRef.current[key] = index;
  }

  function AnimatedSubsteps({
    substeps,
    parentPath,
    parentId,
  }: {
    substeps: Step[];
    parentPath: number[];
    parentId: string;
  }) {
    const indexKey = `animatedSubsteps-${parentId}`;
    const [isHoveredTitle, setIsHoveredTitle] = useState(false);
    const [isHoveringTrashTitle, setIsHoveringTrashTitle] = useState(false);
    const handleMouseEnterStep = () => setIsHoveredTitle(true);
    const handleMouseLeaveStep = () => setIsHoveredTitle(false);

    const [recentlyActivatedIndex, setRecentlyActivatedIndex] = useState<
      number | null
    >(null);

    const handleEnterTrash = () => setIsHoveringTrashTitle(true);
    const handleLeaveTrash = () => setIsHoveringTrashTitle(false);

    function backgroundColorTitle(substep: Step, condition: boolean): string {
      const color = getStepBoxColor(substep);
      if (condition) {
        return isHoveredTitle && !isHoveringTrashTitle
          ? blendColors(blendColors(color, "#000", 0.2), "#000", 0.1)
          : blendColors(color, "#000", 0.2);
      } else {
        return isHoveredTitle && !isHoveringTrashTitle
          ? blendColors(color, "#000", 0.1)
          : color;
      }
    }
    const containerRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef(false);
    const [currentIndex, setCurrentIndex] = useState(() =>
      getInitialIndex(indexKey)
    );

    //For window width doing this (vw)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const vw = windowWidth / 100;

    const containerHeight = 200; // px
    const cardHeight = containerHeight * 0.05;
    const getStepHeight = (fontSize: string): number => {
      let stepFontSize = 1 * vw;
      if (fontSize.endsWith("px")) {
        stepFontSize = parseFloat(fontSize);
      } else if (fontSize.endsWith("vw")) {
        stepFontSize = parseFloat(fontSize) * vw;
      }
      return 1 * vw + (stepFontSize * 1.8 + 10) * 1.2;
    };
    // Assume fontSize and backgroundColorTitle, isHoveredTitle, and your other helper functions exist.
    const activeTop = containerHeight * 0.213;
    const baselineAbove = containerHeight * 0.1;
    const baselineBelow = containerHeight * 0.313 + getStepHeight(fontSize);
    const plusOffset = baselineBelow * 0.1; // 2% of containerHeight, adjust as needed

    // Helper that calculates the blank top for any given active index.
    const getBlankTopFor = (i: number, active: number): number => {
      const distanceFromActive = Math.abs(i - active);
      if (i < active) {
        return baselineAbove - (distanceFromActive + 1) * cardHeight * 0.4;
      } else if (i > active) {
        return baselineBelow + 10 + (distanceFromActive - 1) * cardHeight * 0.6;
      } else {
        return activeTop;
      }
    };

    // Current blank top based on currentIndex.
    const getBlankTop = (i: number): number => {
      return getBlankTopFor(i, currentIndex);
    };

    // --- Compute visible indices (active plus up to 3 above and 3 below) ---
    const total = substeps.length;
    const start = Math.max(0, currentIndex - 3);
    const end = Math.min(total - 1, currentIndex + 3);
    const visibleIndices: number[] = [];
    for (let i = start; i <= end; i++) {
      visibleIndices.push(i);
    }

    // In parent or context
    const [pendingScrollIndex, setPendingScrollIndex] = useState<number | null>(
      null
    );

    // --- Scrolling and Interaction ---
    const scrollToIndex = (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const cards = container.querySelectorAll(".substep-card");
      const card = cards[index] as HTMLElement;
      if (card) {
        container.scrollTo({ top: card.offsetTop, behavior: "smooth" });
      }
    };

    const handleTitleClick = (step: Step, currentPath: number[]) => {
      const index = currentPath[currentPath.length - 1];
      setInitialIndex(indexKey, index);

      if (!step.selected) {
        toggleSelected(currentPath);
        setTimeout(() => {
          animatePromotedFadeIn(`hint-general-${step.id}`);
          animatePromotedFadeIn(`hint-detailed-${step.id}`);
          animatePromotedFadeIn(`${step.id}-promoted-arrow`);
          animatePromotedFadeIn(`${step.id}-promoted`);
        }, 0);
      } else {
        animatePromotedFadeOut(`hint-general-${step.id}`);
        animatePromotedFadeOut(`hint-detailed-${step.id}`);
        animatePromotedFadeOut(`${step.id}-promoted`);
        animatePromotedFadeOut(`${step.id}-promoted-arrow`);

        const descendants = getAllDescendantPaths(step, currentPath);

        descendants.forEach(({ child }) => {
          animatePromotedFadeOut(`hint-general-${step.id}`);
          animatePromotedFadeOut(`hint-detailed-${step.id}`);
          animatePromotedFadeOut(`${child.id}-promoted`);
          animatePromotedFadeOut(`${child.id}-promoted-arrow`);
        });

        setTimeout(() => {
          toggleSelected(currentPath);

          descendants.forEach(({ child, path }) => {
            if (child.selected) {
              toggleSelected(path);
            }
          });
        }, 300);
      }
    };

    const scrollStep = (direction: 1 | -1) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const newIndex =
        direction > 0
          ? Math.min(total - 1, currentIndex + 1)
          : Math.max(0, currentIndex - 1);

      // If the index changes, update state and scroll.
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setRecentlyActivatedIndex(newIndex);
        scrollToIndex(newIndex);
      }
      // Allow the scroll animation to complete (adjust 400ms as needed)
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 400);
    };

    const triggerInsertAbove = () => {
      InsertAbove();
      setTimeout(() => {
        scrollStep(-1);
      }, 10);
    };

    // Trigger scrolling downward (simulate scrolling below)
    const triggerInsertBelow = () => {
      InsertBelow();
      setTimeout(() => {
        scrollStep(1);
      }, 500);
    };

    const InsertBelow = () => {
      const newSubStep = createBlankStep(false);
      newSubStep.content = "New Substep";
      newSubStep.hasparent = true;
      updateSteps((prevSteps) => {
        const newSteps = JSON.parse(JSON.stringify(prevSteps));
        let parent = newSteps;
        for (let i = 0; i < parentPath.length; i++) {
          parent = parent[parentPath[i]].children;
        }
        parent.splice(currentIndex + 1, 0, newSubStep);
        setInitialIndex(indexKey, currentIndex + 1); // since old active shifts down
        return newSteps;
      });
      setPendingScrollIndex(currentIndex + 1);
    };

    const InsertAbove = () => {
      const newSubStep = createBlankStep(false);
      newSubStep.content = "New Substep";
      newSubStep.hasparent = true;
      updateSteps((prevSteps) => {
        const newSteps = JSON.parse(JSON.stringify(prevSteps));
        let parent = newSteps;
        for (let i = 0; i < parentPath.length; i++) {
          parent = parent[parentPath[i]].children;
        }
        parent.splice(currentIndex, 0, newSubStep);
        //initialIndexRef.current = currentIndex; // since old active shifts down
        return newSteps;
      });
    };

    useEffect(() => {
      if (
        pendingScrollIndex !== null &&
        containerRef.current &&
        pendingScrollIndex < substeps.length
      ) {
        scrollToIndex(pendingScrollIndex);
        setPendingScrollIndex(null); // clear after done
      }
    }, [substeps, pendingScrollIndex]);

    useEffect(() => {
      if (recentlyActivatedIndex !== null) {
        const timeout = setTimeout(() => setRecentlyActivatedIndex(null), 300); // 300ms flash
        return () => clearTimeout(timeout);
      }
    }, [recentlyActivatedIndex]);

    useEffect(() => {
      const maxIndex = substeps.length - 1;

      if (getInitialIndex(indexKey) > maxIndex) {
        setInitialIndex(indexKey, maxIndex);
        setCurrentIndex(maxIndex); // ensure view updates too
      } else if (substeps.length === 1) {
        setCurrentIndex(0); // optional depending on use case
      }
    }, [substeps]);

    // Handle wheel events to update currentIndex.
    const handleWheel = (e: WheelEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const atTop = container.scrollTop === 0;
      const atBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      const scrollingDown = e.deltaY > 0;
      if ((scrollingDown && !atBottom) || (!scrollingDown && !atTop)) {
        e.preventDefault();
      }
      const direction = scrollingDown ? 1 : -1;
      const newIndex = Math.max(
        0,
        Math.min(total - 1, currentIndex + direction)
      );
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
        handleLeaveTrash();
      }

      if (newIndex !== currentIndex) {
        isAnimatingRef.current = true;
        setCurrentIndex(newIndex);
        scrollToIndex(newIndex);
        handleLeaveTrash();
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 400);
      }
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const handleWheelEvent = (e: WheelEvent) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        handleWheel(e);
      };
      container.addEventListener("wheel", handleWheelEvent, {
        passive: false,
        capture: true,
      });
      return () =>
        container.removeEventListener("wheel", handleWheelEvent, {
          capture: true,
        });
    }, [currentIndex, substeps]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      let startY: number | null = null;
      const threshold = 30;

      function onTouchStart(e: TouchEvent) {
        startY = e.touches[0].clientY;
      }
      function onTouchMove(e: TouchEvent) {
        if (startY === null) return;
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const delta = startY - currentY;
        if (Math.abs(delta) > threshold) {
          scrollStep(delta > 0 ? 1 : -1);
          startY = currentY;
        }
      }
      function onTouchEnd() {
        startY = null;
      }

      container.addEventListener("touchstart", onTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", onTouchMove, { passive: false });
      container.addEventListener("touchend", onTouchEnd);

      return () => {
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      };
    }, [currentIndex, substeps]);

    const getZIndex = (i: number): number => {
      if (i === currentIndex) return 2;
      return i < currentIndex ? 1 : 3;
    };

    const fullHeight = getStepHeight(fontSize);
    const animatedElements = visibleIndices.map((i) => {
      const substep = substeps[i];
      const currentPath = [...parentPath, i];
      const displayPath = currentPath.map((i) => i + 1).join(".");

      const outerStyle = (step: Step): React.CSSProperties => ({
        transition: "top 0.5s ease-out",
        transform: "none",
        zIndex: getZIndex(i),
        position: i === currentIndex ? "relative" : "absolute",
        top: i === currentIndex ? getBlankTop(i) : `${getBlankTop(i)}px`,
        padding: i === currentIndex ? `` : `0`,
        width: "100%",
        backgroundColor:
          i === currentIndex
            ? recentlyActivatedIndex === i
              ? "#ffff"
              : substep.selected
              ? backgroundColorTitle(substep, true)
              : backgroundColorTitle(substep, false)
            : getStepBoxColor(substep),

        color: getStepBoxTextColor(substep),
        cursor: isHoveredTitle ? "pointer" : "default",
        border: "1px " + getBorder(step) + " black",
      });

      // Inner container: transition only the height (and optionally opacity)
      const innerStyle: React.CSSProperties = {
        transition: "height 0.5s ease, opacity 0.5s ease, transform 0.5s ease",
        height: i !== currentIndex ? `${cardHeight}px` : `${fullHeight}px`,
        display: "flex",
        alignItems: "center",

        opacity: i === currentIndex ? 1 : 0,
        width: "100%",
        transform: "scale(1)",
      };

      return (
        <div
          key={substep.id}
          className={`step-box substep-card ${
            substep.isDeleting ? "fade-out" : ""
          }`}
          style={outerStyle(substep)}
          onMouseEnter={() => {
            if (i === currentIndex) {
              setInitialIndex(indexKey, currentPath[currentPath.length - 1]);
              handleMouseEnterStep();
            }
          }}
          onMouseLeave={() => {
            if (i === currentIndex) {
              setInitialIndex(indexKey, currentPath[currentPath.length - 1]);
              handleMouseLeaveStep();
            }
          }}
          onClick={() =>
            i === currentIndex ? handleTitleClick(substep, currentPath) : ""
          }
          ref={ref14}
        >
          <div style={innerStyle}>
            {i === currentIndex && (
              <div className="step-title" style={{ padding: "5px" }}>
                <div className="step-title-inner">{`Substep ${displayPath}`}</div>
                <div
                  className="icon-container-start-right titleonly"
                  style={{ justifyContent: "flex-end" }}
                >
                  {
                    <div
                      id={`${substep.id}-promoted-arrow`}
                      className="arrow-fade"
                      style={{
                        visibility: `${
                          substep.selected ? "visible" : "hidden"
                        }`,
                        pointerEvents: `${substep.selected ? "auto" : "none"}`,
                      }}
                    >
                      <ArrowDown
                        className="arrow-down"
                        style={{ strokeWidth: "1.2" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const index = currentPath[currentPath.length - 1];
                          setInitialIndex(indexKey, index);

                          const element = document.getElementById(
                            `${substep.id}-promoted`
                          );
                          if (element) {
                            element.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });

                            const observer = new IntersectionObserver(
                              (entries, obs) => {
                                entries.forEach((entry) => {
                                  if (entry.intersectionRatio >= 0.9) {
                                    element.classList.add("highlighted");
                                    setTimeout(() => {
                                      element.classList.remove("highlighted");
                                    }, 1000);
                                    obs.disconnect();
                                  }
                                });
                              },
                              { threshold: 0.9 }
                            );
                            observer.observe(element);
                          }

                          setTimeout(() => {
                            const updatedLength = substeps.length - 1;
                            if (index === currentIndex && updatedLength > 0) {
                              const nextIndex = Math.min(
                                currentIndex,
                                updatedLength - 1
                              );
                              setCurrentIndex(nextIndex);
                              scrollToIndex(nextIndex);
                            }
                            handleLeaveTrash();
                            handleMouseLeaveStep();
                          }, 400);
                        }}
                      />
                    </div>
                  }

                  <Trash
                    onMouseEnter={handleEnterTrash}
                    onMouseLeave={handleLeaveTrash}
                    onClick={(e) => {
                      e.stopPropagation();
                      const index = currentPath[currentPath.length - 1];
                      setInitialIndex(indexKey, index);
                      handleRemoveStep(substep.id);
                      setTimeout(() => {
                        const updatedLength = substeps.length - 1;
                        if (index === currentIndex && updatedLength > 0) {
                          const nextIndex = Math.min(
                            currentIndex,
                            updatedLength - 1
                          );
                          setCurrentIndex(nextIndex);
                          scrollToIndex(nextIndex);
                        }
                        handleLeaveTrash();
                        handleMouseLeaveStep();
                      }, 400);
                    }}
                    color={getStepBoxTextColor(substep)}
                    cursor="pointer"
                    strokeWidth={"1.2"}
                    className="trash-icon"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });

    // --- Render the Component ---
    return (
      <div
        ref={containerRef}
        className="animated-substeps-container"
        style={{
          maxHeight: `${baselineBelow * 1.5}px`,
          overscrollBehavior: "contain",
          position: "relative",
          bottom: "0",
          width: "100%",
        }}
      >
        {/* PLUS button above */}
        <PlusbetweenSteps
          key={`plus-top-${currentIndex}`}
          onClick={() => {
            triggerInsertAbove();
          }}
          style={{
            position: "absolute",
            top: getBlankTop(currentIndex - 1) + cardHeight + 3,
            margin: "0",
            opacity: "1",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          plus={false}
        />
        {/* {blankElements} */}
        {animatedElements}
        {/* PLUS button below */}
        <PlusbetweenSteps
          key={`plus-bottom-${currentIndex}`}
          onClick={() => triggerInsertBelow()}
          style={{
            position: "absolute",
            top: getBlankTop(currentIndex + 1) - plusOffset,
            margin: "0",
            opacity: "1",
            border: "0",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          plus={false}
        />
      </div>
    );
  }

  /* ----------------------------------------
  AnimatedSubsteps Component END
  ---------------------------------------- */

  /* ------------------------------------
Biggest render Tree ever recored START
------------------------------------ */

  function renderTree(steps: Step[], parentPath: number[] = []): JSX.Element[] {
    const elements: JSX.Element[] = [];

    // Render the plus button at the top of the current list.
    if (parentPath.length === 0) {
      elements.push(
        <PlusbetweenSteps
          tooltip="Insert step 1"
          key={`plus-top-0`}
          onClick={() => insertTopLevelStepAt(0)}
        />
      );
    } else {
      elements.push(
        <PlusbetweenSteps
          tooltip="Insert step ${parentPath + 1}"
          key={`${parentPath.join("-")}-plus-0`}
          onClick={() => insertSubStepAtPath(parentPath, 0, false)}
        />
      );
    }

    steps.forEach((step, index) => {
      const currentPath = [...parentPath, index];
      const displayPath = currentPath.map((i) => i + 1).join(".");
      const hintNumber = getNumberForStep(step);
      const isFirstSibling = currentPath[currentPath.length - 1] === 0;

      const siblingArray = steps;

      const isLastSibling =
        currentPath[currentPath.length - 1] === siblingArray.length - 1;

      const isCurrentlyEditing =
        editingPath &&
        editingPath.length === currentPath.length &&
        editingPath.every((val, i) => val === currentPath[i]);

      // Determine title label: use "Substep" if not top-level.
      const titleLabel =
        parentPath.length > 0
          ? `Substep ${displayPath}:`
          : `Step ${displayPath}:`;

      const isThisNodeEditing =
        editingPath !== null &&
        editingPath.length === currentPath.length &&
        editingPath.every((v, i) => v === currentPath[i]);

      // TOP LEVEL: NO PARENTS <-> NOT A SUBSTEP
      let view: JSX.Element;

      // Top-level steps always show the full view.
      view = (
        <>
          <div
            className={`step-box 
            ${step.isDeleting ? "fade-out" : ""} 
            ${step.id === hoveredStepId ? "highlighted-step" : ""}
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
              color: getStepBoxTextColor(step),
            }}
            ref={(el) => {
              if (el) {
                if (
                  stepIndexTutorial === 40 &&
                  step.id === "step-1749592767704-5318"
                )
                  ref19!.current = el;
                if (
                  stepIndexTutorial === 43 &&
                  step.id === "step-1749592767704-5928"
                )
                  ref22!.current = el;
                if (
                  stepIndexTutorial === 44 &&
                  step.id === "step-1749592767704-5783"
                )
                  ref23!.current = el;
                if (
                  stepIndexTutorial === 45 &&
                  step.id === "step-1749592767704-9126"
                )
                  ref24!.current = el;
                ref27!.current = el;
              }
            }}
          >
            <div className="step-title">
              <div className="step-title-inner">{titleLabel}</div>
              <div
                className={`icon-container-start-right ${
                  burgerIcon ? "one" : ""
                }`}
              >
                {burgerIcon ? (
                  <div
                    ref={(el) => {
                      wrapperRefs.current[step.id] = el;
                    }}
                    style={{
                      position: "relative",
                      display: "inline-block",
                    }}
                  >
                    <AlignJustify
                      className="burger-icon-startRight"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenBurgerFor((of) =>
                          of === step.id ? null : step.id
                        );
                      }}
                    />

                    {openBurgerFor === step.id && (
                      <div
                        className="burger-dropdown"
                        onClick={() => {
                          setOpenBurgerFor(null);
                        }}
                      >
                        <div className="container-vertical-muskultiers">
                          <The_muskeltiers
                            onEditStep={() =>
                              handleStartEditing(currentPath, step.content)
                            }
                            vertical={burgerIcon ?? true}
                            onSplitStep={HandleOnSplitStep(currentPath)}
                            selected={isThisNodeEditing}
                          />
                        </div>
                        <CustomLightbulb
                          number={getNumberForStep(step)}
                          fill={getNumberForStep(step) ? "yellow" : "none"}
                          color={getStepBoxTextColor(step)}
                          onGiveHint={() =>
                            handleGiveHint(currentPath, getNumberForStep(step))
                          }
                        />
                        <Trash
                          onClick={() => {
                            const key = `animatedSubsteps-${parentPath.join(
                              "-"
                            )}`;
                            const currentIndex = getInitialIndex(key);
                            const lastLabel = getLastLabelNumber(titleLabel);

                            if (currentIndex >= lastLabel)
                              setInitialIndex(key, currentIndex - 1);
                            handleRemoveStep(step.id);
                          }}
                          cursor="pointer"
                          strokeWidth={"1.2"}
                          color={getStepBoxTextColor(step)}
                          className="trash-icon"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="leftSide-Icons">
                      <The_muskeltiers
                        onEditStep={() =>
                          handleStartEditing(currentPath, step.content)
                        }
                        onSplitStep={HandleOnSplitStep(currentPath)}
                        selected={isThisNodeEditing}
                        ref1={ref9}
                        ref2={ref10}
                      />
                    </div>
                    <div className="trash">
                      <CustomLightbulb
                        number={hintNumber}
                        fill={hintNumber ? "yellow" : "none"}
                        color={getStepBoxTextColor(step)}
                        onGiveHint={() =>
                          handleGiveHint(currentPath, hintNumber)
                        }
                        ref1={ref11}
                        ref2={
                          step.id === "step-1749592767704-5318"
                            ? ref20
                            : undefined
                        }
                      />
                      <div
                        ref={ref12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Trash
                          onClick={() => {
                            const key = `animatedSubsteps-${parentPath.join(
                              "-"
                            )}`;
                            const currentIndex = getInitialIndex(key);
                            const lastLabel = getLastLabelNumber(titleLabel);

                            if (currentIndex >= lastLabel)
                              setInitialIndex(key, currentIndex - 1);
                            handleRemoveStep(step.id);
                          }}
                          cursor="pointer"
                          strokeWidth={"1.2"}
                          color={getStepBoxTextColor(step)}
                          className="trash-icon"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {isCurrentlyEditing ? (
              <textarea
                autoFocus
                onFocus={(e) => {
                  const len = e.currentTarget.value.length;
                  e.currentTarget.setSelectionRange(len, len);
                }}
                className="inline-edit-textarea-editing"
                style={{ color: getStepBoxTextColor(step) }}
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

            {step.children && step.children.length > 0 && step.isexpanded ? (
              <div className="orientation-substeps">
                <div className="orientation" ref={ref13}>
                  <div className="orientation-parent">
                    <button className="orientation-buttons middle isEdgeSibling">
                      Parent
                    </button>
                  </div>
                  <div className="orientation-siblings">
                    <button
                      id={step.id + "-promoted-left"}
                      className={`orientation-buttons left ${
                        isFirstSibling ? "isEdgeSibling" : ""
                      }`}
                      disabled={isFirstSibling}
                      onClick={() => {
                        if (isFirstSibling) {
                          console.warn(
                            "Already at the first sibling; no previous sibling."
                          );
                          return;
                        }
                        const siblingPath = [...currentPath];
                        siblingPath[siblingPath.length - 1] =
                          currentPath[currentPath.length - 1] - 1;
                        const siblingStep = getStepAtPath(steps, siblingPath);
                        if (!siblingStep) {
                          console.warn(
                            "No previous sibling found at path:",
                            siblingPath
                          );
                          return;
                        }
                        const siblingEl = document.getElementById(
                          siblingStep.id
                        );
                        if (siblingEl) {
                          siblingEl.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          siblingEl.classList.add("highlighted");
                          const observer = new IntersectionObserver(
                            (entries, obs) => {
                              entries.forEach((entry) => {
                                if (entry.intersectionRatio >= 0.9) {
                                  setTimeout(() => {
                                    siblingEl.classList.remove("highlighted");
                                  }, 1000);
                                  obs.disconnect();
                                }
                              });
                            },
                            { threshold: 0.9 }
                          );
                          observer.observe(siblingEl);
                        } else {
                          if (!siblingStep.selected) {
                            toggleSelected(siblingPath);
                            setTimeout(() => {
                              animatePromotedFadeIn(
                                `${siblingStep.id}-promoted`
                              );
                            }, 0);
                          }

                          //same as if entered in if
                          setTimeout(() => {
                            const siblingEl2 = document.getElementById(
                              siblingStep.id + "-promoted"
                            );

                            if (siblingEl2) {
                              siblingEl2.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl2.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl2.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl2);
                            }
                          }, 1);
                        }
                      }}
                    >
                      Previous
                    </button>

                    <button
                      id={step.id + "-promoted-right"}
                      className={`orientation-buttons right ${
                        isLastSibling ? "isEdgeSibling" : ""
                      }`}
                      disabled={isLastSibling}
                      onClick={() => {
                        if (isLastSibling) {
                          console.warn(
                            "Already at the last sibling; no next sibling available."
                          );
                          return;
                        }

                        const siblingPath = [...currentPath];
                        const currentIndex =
                          currentPath[currentPath.length - 1];
                        siblingPath[siblingPath.length - 1] = currentIndex + 1;

                        const siblingStep = getStepAtPath(steps, siblingPath);
                        if (!siblingStep) {
                          console.warn(
                            "No next sibling found at path:",
                            siblingPath
                          );
                          return;
                        }

                        const siblingEl = document.getElementById(
                          siblingStep.id
                        );
                        if (siblingEl) {
                          siblingEl.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          siblingEl.classList.add("highlighted");

                          const observer = new IntersectionObserver(
                            (entries, obs) => {
                              entries.forEach((entry) => {
                                if (entry.intersectionRatio >= 0.9) {
                                  setTimeout(() => {
                                    siblingEl.classList.remove("highlighted");
                                  }, 1000);
                                  obs.disconnect();
                                }
                              });
                            },
                            { threshold: 0.9 }
                          );

                          observer.observe(siblingEl);
                        } else {
                          if (!siblingStep.selected) {
                            toggleSelected(siblingPath);
                            setTimeout(() => {
                              animatePromotedFadeIn(
                                `${siblingStep.id}-promoted`
                              );
                            }, 0);
                          }

                          //same as if entered in if
                          setTimeout(() => {
                            const siblingEl2 = document.getElementById(
                              siblingStep.id + "-promoted"
                            );

                            if (siblingEl2) {
                              siblingEl2.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl2.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl2.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl2);
                            }
                          }, 1);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div
                  className="substeps"
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <AnimatedSubsteps
                    substeps={step.children}
                    parentPath={currentPath}
                    parentId={step.id}
                  />
                </div>
              </div>
            ) : (
              <div className="orientation-filling">
                <div className="orientation">
                  <div className="orientation-parent">
                    <button className="orientation-buttons middle isEdgeSibling">
                      Parent
                    </button>
                  </div>
                  <div className="orientation-siblings">
                    <button
                      id={step.id + "-promoted-left"}
                      className={`orientation-buttons left ${
                        isFirstSibling ? "isEdgeSibling" : ""
                      }`}
                      disabled={isFirstSibling}
                      onClick={() => {
                        if (isFirstSibling) {
                          console.warn(
                            "Already at the first sibling; no previous sibling."
                          );
                          return;
                        }
                        const siblingPath = [...currentPath];
                        siblingPath[siblingPath.length - 1] =
                          currentPath[currentPath.length - 1] - 1;
                        const siblingStep = getStepAtPath(steps, siblingPath);
                        if (!siblingStep) {
                          console.warn(
                            "No previous sibling found at path:",
                            siblingPath
                          );
                          return;
                        }
                        const siblingEl = document.getElementById(
                          siblingStep.id
                        );
                        if (siblingEl) {
                          siblingEl.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          siblingEl.classList.add("highlighted");
                          const observer = new IntersectionObserver(
                            (entries, obs) => {
                              entries.forEach((entry) => {
                                if (entry.intersectionRatio >= 0.9) {
                                  setTimeout(() => {
                                    siblingEl.classList.remove("highlighted");
                                  }, 1000);
                                  obs.disconnect();
                                }
                              });
                            },
                            { threshold: 0.9 }
                          );
                          observer.observe(siblingEl);
                        } else {
                          if (!siblingStep.selected) {
                            toggleSelected(siblingPath);
                            setTimeout(() => {
                              animatePromotedFadeIn(
                                `${siblingStep.id}-promoted`
                              );
                            }, 0);
                          }

                          //same as if entered in if
                          setTimeout(() => {
                            const siblingEl2 = document.getElementById(
                              siblingStep.id + "-promoted"
                            );

                            if (siblingEl2) {
                              siblingEl2.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl2.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl2.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl2);
                            }
                          }, 1);
                        }
                      }}
                    >
                      Previous
                    </button>

                    <button
                      id={step.id + "-promoted-right"}
                      className={`orientation-buttons right ${
                        isLastSibling ? "isEdgeSibling" : ""
                      }`}
                      disabled={isLastSibling}
                      onClick={() => {
                        if (isLastSibling) {
                          console.warn(
                            "Already at the last sibling; no next sibling available."
                          );
                          return;
                        }

                        const siblingPath = [...currentPath];
                        const currentIndex =
                          currentPath[currentPath.length - 1];
                        siblingPath[siblingPath.length - 1] = currentIndex + 1;

                        const siblingStep = getStepAtPath(steps, siblingPath);
                        if (!siblingStep) {
                          console.warn(
                            "No next sibling found at path:",
                            siblingPath
                          );
                          return;
                        }

                        const siblingEl = document.getElementById(
                          siblingStep.id
                        );
                        if (siblingEl) {
                          siblingEl.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                          siblingEl.classList.add("highlighted");

                          const observer = new IntersectionObserver(
                            (entries, obs) => {
                              entries.forEach((entry) => {
                                if (entry.intersectionRatio >= 0.9) {
                                  setTimeout(() => {
                                    siblingEl.classList.remove("highlighted");
                                  }, 1000);
                                  obs.disconnect();
                                }
                              });
                            },
                            { threshold: 0.9 }
                          );

                          observer.observe(siblingEl);
                        } else {
                          if (!siblingStep.selected) {
                            toggleSelected(siblingPath);
                            setTimeout(() => {
                              animatePromotedFadeIn(
                                `${siblingStep.id}-promoted`
                              );
                            }, 0);
                          }

                          //same as if entered in if
                          setTimeout(() => {
                            const siblingEl2 = document.getElementById(
                              siblingStep.id + "-promoted"
                            );

                            if (siblingEl2) {
                              siblingEl2.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                              siblingEl2.classList.add("highlighted");
                              const observer = new IntersectionObserver(
                                (entries, obs) => {
                                  entries.forEach((entry) => {
                                    if (entry.intersectionRatio >= 0.9) {
                                      setTimeout(() => {
                                        siblingEl2.classList.remove(
                                          "highlighted"
                                        );
                                      }, 1000);
                                      obs.disconnect();
                                    }
                                  });
                                },
                                { threshold: 0.9 }
                              );
                              observer.observe(siblingEl2);
                            }
                          }, 1);
                        }
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="container-filling-emptyness">
                  <div
                    className="filling-emptyness"
                    onClick={() => insertSubStepAtPath(currentPath, 0, false)}
                  >
                    Create a Substep <br /> +
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="hint-container"
            ref={step.id === "step-1749592767704-5318" ? ref21 : undefined}
          >
            {step.detailed_hint && step.showDetailedHint1 && (
              <Collapsible
                isOpen={step.showDetailedHint2}
                id={`hint-detailed-${step.id}`}
                toggleHint={toggleHint}
                stepId={step.id}
                what={"detailed"}
              >
                {/* Show fade-in if we just unlocked it */}
                <div
                  className={
                    "hint-inner " +
                    (step.showDetailedHint2 ? "extended " : "fade-out-hint") +
                    (justUnlockedHintId === `step-${currentPath.join("-")}-2`
                      ? "fade-in-hint "
                      : "")
                  }
                >
                  {step.showDetailedHint2 ? (
                    <>
                      <strong>Detailed Hint:</strong>
                      <span className="hint-content">{step.detailed_hint}</span>
                    </>
                  ) : (
                    <div className="not-extented-hint">
                      <strong>Detailed Hint:</strong>
                      <span
                        className="hint-content"
                        style={{ visibility: "hidden" }}
                      >
                        {step.detailed_hint}
                      </span>
                    </div>
                  )}
                </div>
              </Collapsible>
            )}

            {step.general_hint && step.showGeneralHint1 && (
              <Collapsible
                isOpen={step.showGeneralHint2}
                id={`hint-general-${step.id}`}
                toggleHint={toggleHint}
                stepId={step.id}
                what={"general"}
              >
                <div
                  className={
                    "hint-inner " +
                    (step.showGeneralHint2 ? "extended " : "") +
                    (justUnlockedHintId === `step-${currentPath.join("-")}-3`
                      ? "fade-in-hint "
                      : "")
                  }
                >
                  {step.showGeneralHint2 ? (
                    <>
                      <strong>General Hint:</strong>
                      <span className="hint-content">{step.general_hint}</span>
                    </>
                  ) : (
                    <div className="not-extented-hint">
                      <strong>General Hint</strong>
                      <span
                        className="hint-content"
                        style={{ visibility: "hidden" }}
                      >
                        {step.general_hint}
                      </span>
                    </div>
                  )}
                </div>
              </Collapsible>
            )}
          </div>
        </>
      );

      // Push the view and the plus button after it.
      elements.push(
        <Fragment key={step.id}>
          {view}
          <Fragment
            key={
              parentPath.length === 0
                ? `plus-top-${step.id}`
                : `${step.id}-plus-${index + 1}`
            }
          >
            {parentPath.length === 0 ? (
              <PlusbetweenSteps
                tooltip={`Insert step ${index + 2}`}
                onClick={() => insertTopLevelStepAt(index + 1)}
              />
            ) : (
              <PlusbetweenSteps
                tooltip={`Insert step ${parentPath
                  .map((i) => i + 1)
                  .join(".")}.${index + 2}`}
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
        const promoted = collectPromotedSubsteps(
          step.children,
          currentPath,
          steps
        );
        if (promoted.length > 0) {
          elements.push(...promoted);
          elements.push(
            <PlusbetweenSteps
              tooltip={`Insert step ${currentPath[0] + 1}`}
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

  /* ------------------------------------
TUTORIAL START
------------------------------------ */

  useEffect(() => {
    if (stepIndexTutorial === 1) {
      setSteps([]);
    }
    if (stepIndexTutorial === 18) {
      setLoading(false);
    }
    if (stepIndexTutorial === 19) {
      setLoading(true);
      setSteps([]);
    } else if (stepIndexTutorial === 20) {
      setLoading(false);
      setSteps(tutorialStepTree1);
    } else if (stepIndexTutorial === 24) {
      setSteps(tutorialStepTree1);
    } else if (stepIndexTutorial === 25) {
      setSteps([]);
    } else if (stepIndexTutorial === 27) {
      setLoading(false);
    } else if (stepIndexTutorial === 28) {
      setLoading(true);
      setSteps([]);
    } else if (stepIndexTutorial === 29) {
      setLoading(false);
      setSteps(tutorialStepTree2);
    } else if (stepIndexTutorial === 35) {
      setSteps(tutorialStepTree2);
    } else if (stepIndexTutorial === 36) {
      setSteps(tutorialStepTree3);
    } else if (stepIndexTutorial === 36) {
      setSteps(tutorialStepTree3);
    } else if (stepIndexTutorial === 37) {
      setLoadingCheck(false);
    } else if (stepIndexTutorial === 38) {
      setSteps(tutorialStepTree3);
      setLoadingCheck(true);
    } else if (stepIndexTutorial === 39) {
      setSteps(tutorialStepTree4);
      setLoadingCheck(false);
    } else if (stepIndexTutorial === 41) {
      setSteps(tutorialStepTree4);
    } else if (stepIndexTutorial === 42) {
      setSteps(tutorialStepTree5);
    } else if (stepIndexTutorial === 46) {
      setLoadingCheck(false);
    } else if (stepIndexTutorial === 47) {
      setSteps(tutorialStepTree5);
      setLoadingCheck(true);
    } else if (stepIndexTutorial === 48) {
      setSteps(tutorialStepTree6);
      setLoadingCheck(false);
    } else if (stepIndexTutorial === 49) {
      setSteps(tutorialStepTree6);
    }
  }, [stepIndexTutorial]);

  const tutorialScrollRefs: Record<number, React.RefObject<HTMLDivElement>> = {
    30: ref9!,
    31: ref10!,
    32: ref11!,
    33: ref12!,
    34: ref13!,
    35: ref14!,
    37: ref16!,
    40: ref19!,
    41: ref20!,
    42: ref21!,
    43: ref22!,
    44: ref23!,
    45: ref24!,
    47: ref26!,
    49: ref27!,
  };
  useEffect(() => {
    const scrollRef = tutorialScrollRefs[stepIndexTutorial];
    if (!scrollRef) return;

    const id = window.setTimeout(() => {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [stepIndexTutorial]);

  /* ------------------------------------
TUTORIAL END
------------------------------------ */

  return (
    <div
      className="Right-Side-main"
      ref={(el: HTMLDivElement | null) => {
        stepBoxRef.current = el;
        if (el) {
          ref2!.current = el;
        }
      }}
    >
      {hoveredStepId && <div className="hovered-step-indicator"></div>}
      <div
        className="right-sidecontent-main"
        ref={(el) => {
          if (el) {
            ref8!.current = el;
            ref15!.current = el;
            ref18!.current = el;
          }
        }}
      >
        <div className="right-header-main">
          Step Tree
          {steps.length > 0 && (
            <div className="trash">
              <div
                ref={ref25}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <ShieldCheck
                  size={"1vw"}
                  strokeWidth={1}
                  cursor="pointer"
                  className="trash-icon header-shield"
                  onClick={
                    loading
                      ? () => console.log("undefined")
                      : async () => HandleImplemented()
                  }
                />
              </div>
              <div
                ref={ref3}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <Trash
                  size={"1vw"}
                  strokeWidth={1}
                  cursor="pointer"
                  onClick={HandleDeleteTree}
                  className="trash-icon header-trash"
                />
              </div>
            </div>
          )}
        </div>
        <div className="right-main-main">
          <div
            className={`container-step-tree
              ${fadeInTree ? "fade-in-tree" : ""} 
              ${!sentPrompt ? "height100" : ""}`}
          >
            {steps.length > 0 ? (
              <>
                <div className="button-container">
                  <button
                    className="Check-button"
                    onClick={() => handleGenerateWithChatGPTCheck("Check")}
                    disabled={loadingCheck}
                    style={{
                      cursor: loadingCheck ? "not-allowed" : "pointer",
                    }}
                    ref={(el) => {
                      if (el) {
                        ref16!.current = el;
                        ref17!.current = el;
                        ref26!.current = el;
                      }
                    }}
                  >
                    <div
                      className="Check"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {loadingCheck ? (
                        <>Checking{".".repeat(dotCount)}</>
                      ) : (
                        "Check"
                      )}
                    </div>
                  </button>
                </div>

                {renderTree(steps)}
              </>
            ) : (
              <div
                className={`input-container ${loading ? "loading" : ""}`}
                ref={(el) => {
                  if (el) {
                    ref4!.current = el;
                    ref5!.current = el;
                  }
                }}
              >
                <div className="textarea-wrapper">
                  {!loading && (
                    <textarea
                      ref={textareaRef}
                      value={
                        localStorage.getItem("tutorialStep") &&
                        (stepIndexTutorial === 26 || stepIndexTutorial === 27)
                          ? "Test input with children"
                          : text
                      }
                      onChange={handleInput}
                      className="text-input"
                      placeholder="Enter Your Thoughts"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerateWithChatGPT("From Prompt");
                        }
                        // Shift+Enter will insert a newline as usual
                      }}
                    />
                  )}
                  <button
                    className={`button-inside  ${loading ? "loadingB" : ""}`}
                    style={{ cursor: loading ? "default" : "pointer" }}
                    onClick={() => handleGenerateWithChatGPT("From Prompt")}
                    disabled={loading}
                    ref={(el) => {
                      if (el) {
                        ref1!.current = el;
                        ref6!.current = el;
                        ref7!.current = el;
                      }
                    }}
                  >
                    {loading ? (
                      <span className="spinner" style={{ cursor: "default" }}>
                        ✔
                      </span>
                    ) : (
                      "✔"
                    )}
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
          onConfirm={() => handleGiveCorrectStep(saveCorrectStep.toString())}
          saveChecked={saveCorrectStep}
          setSaveChecked={setSaveCorrectStep}
        />
      )}
    </div>
  );
};

export default StartRight;
