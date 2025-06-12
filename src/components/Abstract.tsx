import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./Abstract.css";
import {
  X,
  Check,
  Pen,
  Trash,
  SquarePlus,
  SearchCheck,
  SearchX,
  Eye,
  EyeOff,
  Recycle,
  Users,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import CustomLightbulb from "./BuildingBlocks/Custom-Lightbulb";
import apiCallAbstract from "./AI_Abstract";
import AbstractionOverlay from "./AbstractionOverlay";
import GradientSpinner from "./BuildingBlocks/GradientSpinner";

import tutorialStepsAbstract, {
  TutorialStep,
} from "./BuildingBlocks/TutorialStepsAbstract";
import tutorialStepsStart from "./BuildingBlocks/TutorialStepsStart";
import tutorialSteps from "./BuildingBlocks/TutorialStepsProblem";
import { tutorialRoutes } from "./BuildingBlocks/TutorialRoutes";
import { useLocation, useNavigate } from "react-router-dom";

// ======================
// CORRECT STEP OVERLAY
// ======================
interface CorrectStepOverlayProps {
  onClose: () => void;
  onConfirm: () => void;
  saveChecked: boolean;
  setSaveChecked: (val: boolean) => void;
}

interface StepNode {
  content: string;
  general_hint: string;
  detailed_hint: string;
  substeps: Record<string, StepNode>;
}

interface AbstractionItem {
  id: string;
  steps: { id: string }[][];
  correct_answer: {
    stepsTree: Record<string, StepNode>;
  };
}

const tutorialStepJSON1: Step[] = [
  {
    id: "step-1748855935470-1128",
    code: "",
    content: "Sort the input array (Incorrect)",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "incorrect",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into receiving the input and sorting it.",
    detailed_hint:
      "Divide this step into receiving the input array and sorting it in ascending order.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-3631",
        code: "",
        content: "Receive nums, an array of distinct positive integers.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7564",
        code: "",
        content: "Sort nums in ascending order.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-4497",
        code: "",
        content: "After sorting, let’s call the resulting array A.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
    id: "step-1748855935470-8536",
    code: "",
    content: "Prepare DP and traceback arrays",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing the arrays and setting initial values.",
    detailed_hint:
      "Divide this step into initializing the dp and prev arrays and setting their initial values.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-5410",
        code: "",
        content: "Let n = A.length.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7961",
        code: "",
        content:
          "Create an integer array dp[0…n–1], where dp[i] will store the size of the largest divisible subset ending exactly at index i.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-1670",
        code: "",
        content:
          "Create an integer array prev[0…n–1], where prev[i] will store the index of the previous element in the chain that leads to A[i]. If there is no previous element, store –1.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-135",
        code: "",
        content:
          "Initialize each dp[i] = 1 (each element by itself is a subset of size 1).",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-9712",
        code: "",
        content: "Initialize each prev[i] = –1 (no predecessor yet).",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
  {
    id: "step-1748855935470-5851",
    code: "",
    content: "Iterate through all pairs to fill DP table",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into iterating through pairs and updating dp and prev arrays.",
    detailed_hint:
      "Divide this step into iterating through pairs and checking divisibility, then updating dp and prev arrays accordingly.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-1941",
        code: "",
        content: "For each i from 0 to n–1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into iterating through j and checking divisibility.",
        detailed_hint:
          "Divide this step into iterating through j and checking if A[i] is divisible by A[j].",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-4885",
            code: "",
            content: "For each j from 0 to i–1:",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "can",
            },
            general_hint:
              "This step can be further divided into checking divisibility and updating dp and prev arrays.",
            detailed_hint:
              "Divide this step into checking if A[i] % A[j] == 0 and updating dp and prev arrays if true.",
            hasparent: true,
            children: [
              {
                id: "step-1748855935470-4786",
                code: "",
                content: "Check if A[i] % A[j] == 0.",
                correctStep: "",
                prompt: "",
                status: {
                  correctness: "correct",
                  can_be_further_divided: "can",
                },
                general_hint:
                  "This step can be further divided into computing candidate size and updating dp and prev arrays.",
                detailed_hint:
                  "Divide this step into computing candidate size and updating dp and prev arrays if candidate size is greater.",
                hasparent: true,
                children: [
                  {
                    id: "step-1748855935470-3278",
                    code: "",
                    content:
                      "If yes, then element A[i] can be appended to the best subset ending at j.",
                    correctStep: "",
                    prompt: "",
                    status: {
                      correctness: "correct",
                      can_be_further_divided: "can",
                    },
                    general_hint:
                      "This step can be further divided into computing candidate size and updating dp and prev arrays.",
                    detailed_hint:
                      "Divide this step into computing candidate size and updating dp and prev arrays if candidate size is greater.",
                    hasparent: true,
                    children: [
                      {
                        id: "step-1748855935470-7628",
                        code: "",
                        content:
                          "Compute a candidate subset size: candidateSize = dp[j] + 1.",
                        correctStep: "",
                        prompt: "",
                        status: {
                          correctness: "correct",
                          can_be_further_divided: "cannot",
                        },
                        general_hint: "",
                        detailed_hint: "",
                        hasparent: true,
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
                        id: "step-1748855935470-5922",
                        code: "",
                        content: "If candidateSize > dp[i], then:",
                        correctStep: "",
                        prompt: "",
                        status: {
                          correctness: "correct",
                          can_be_further_divided: "can",
                        },
                        general_hint:
                          "This step can be further divided into updating dp and prev arrays.",
                        detailed_hint:
                          "Divide this step into updating dp[i] and prev[i] if candidate size is greater.",
                        hasparent: true,
                        children: [
                          {
                            id: "step-1748855935470-1610",
                            code: "",
                            content: "Update dp[i] = candidateSize.",
                            correctStep: "",
                            prompt: "",
                            status: {
                              correctness: "correct",
                              can_be_further_divided: "cannot",
                            },
                            general_hint: "",
                            detailed_hint: "",
                            hasparent: true,
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
                            id: "step-1748855935470-7556",
                            code: "",
                            content: "Update prev[i] = j.",
                            correctStep: "",
                            prompt: "",
                            status: {
                              correctness: "correct",
                              can_be_further_divided: "cannot",
                            },
                            general_hint: "",
                            detailed_hint: "",
                            hasparent: true,
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
  {
    id: "step-1748855935470-8112",
    code: "",
    content: "Find the maximum‐length ending index",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing variables and iterating to find the maximum.",
    detailed_hint:
      "Divide this step into initializing maxSize and maxIndex, then iterating through dp array to find the maximum.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-1795",
        code: "",
        content: "Let maxSize = 0 and maxIndex = 0.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-2497",
        code: "",
        content: "For each i from 0 to n–1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into checking and updating maxSize and maxIndex.",
        detailed_hint:
          "Divide this step into checking if dp[i] is greater than maxSize and updating maxSize and maxIndex if true.",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-599",
            code: "",
            content:
              "If dp[i] > maxSize, then set maxSize = dp[i] and maxIndex = i.",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
  {
    id: "step-1748855935470-1916",
    code: "",
    content: "Reconstruct the largest divisible subset via backtracking",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing the answer list and backtracking to reconstruct the subset.",
    detailed_hint:
      "Divide this step into creating the answer list, setting cur to maxIndex, and backtracking through prev array to reconstruct the subset.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-8452",
        code: "",
        content: "Create an empty list answer = [].",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-6931",
        code: "",
        content: "Let cur = maxIndex.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-6703",
        code: "",
        content: "While cur != -1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into appending elements to the answer list and updating cur.",
        detailed_hint:
          "Divide this step into appending A[cur] to the answer list and updating cur to prev[cur].",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-681",
            code: "",
            content: "Prepend A[cur] to the front of answer.",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
            id: "step-1748855935470-8861",
            code: "",
            content: "Update cur = prev[cur].",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
  {
    id: "step-1748855935470-7413",
    code: "",
    content: "Return the result",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into confirming the answer and returning it.",
    detailed_hint:
      "Divide this step into confirming that the answer list holds a valid subset and returning it.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-5042",
        code: "",
        content: "answer now holds one valid largest divisible subset.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7772",
        code: "",
        content: "Return answer.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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

const tutorialStepJSON2: Step[] = [
  {
    id: "step-1748855935470-1128",
    code: "",
    content: "Sort the input array (Correct)",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into receiving the input and sorting it.",
    detailed_hint:
      "Divide this step into receiving the input array and sorting it in ascending order.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-3631",
        code: "",
        content: "Receive nums, an array of distinct positive integers.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7564",
        code: "",
        content: "Sort nums in ascending order.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-4497",
        code: "",
        content: "After sorting, let’s call the resulting array A.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
    id: "step-1748855935470-8536",
    code: "",
    content: "Prepare DP and traceback arrays",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing the arrays and setting initial values.",
    detailed_hint:
      "Divide this step into initializing the dp and prev arrays and setting their initial values.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-5410",
        code: "",
        content: "Let n = A.length.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7961",
        code: "",
        content:
          "Create an integer array dp[0…n–1], where dp[i] will store the size of the largest divisible subset ending exactly at index i.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-1670",
        code: "",
        content:
          "Create an integer array prev[0…n–1], where prev[i] will store the index of the previous element in the chain that leads to A[i]. If there is no previous element, store –1.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-135",
        code: "",
        content:
          "Initialize each dp[i] = 1 (each element by itself is a subset of size 1).",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-9712",
        code: "",
        content: "Initialize each prev[i] = –1 (no predecessor yet).",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
  {
    id: "step-1748855935470-5851",
    code: "",
    content: "Iterate through all pairs to fill DP table",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into iterating through pairs and updating dp and prev arrays.",
    detailed_hint:
      "Divide this step into iterating through pairs and checking divisibility, then updating dp and prev arrays accordingly.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-1941",
        code: "",
        content: "For each i from 0 to n–1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into iterating through j and checking divisibility.",
        detailed_hint:
          "Divide this step into iterating through j and checking if A[i] is divisible by A[j].",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-4885",
            code: "",
            content: "For each j from 0 to i–1:",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "can",
            },
            general_hint:
              "This step can be further divided into checking divisibility and updating dp and prev arrays.",
            detailed_hint:
              "Divide this step into checking if A[i] % A[j] == 0 and updating dp and prev arrays if true.",
            hasparent: true,
            children: [
              {
                id: "step-1748855935470-4786",
                code: "",
                content: "Check if A[i] % A[j] == 0.",
                correctStep: "",
                prompt: "",
                status: {
                  correctness: "correct",
                  can_be_further_divided: "can",
                },
                general_hint:
                  "This step can be further divided into computing candidate size and updating dp and prev arrays.",
                detailed_hint:
                  "Divide this step into computing candidate size and updating dp and prev arrays if candidate size is greater.",
                hasparent: true,
                children: [
                  {
                    id: "step-1748855935470-3278",
                    code: "",
                    content:
                      "If yes, then element A[i] can be appended to the best subset ending at j.",
                    correctStep: "",
                    prompt: "",
                    status: {
                      correctness: "correct",
                      can_be_further_divided: "can",
                    },
                    general_hint:
                      "This step can be further divided into computing candidate size and updating dp and prev arrays.",
                    detailed_hint:
                      "Divide this step into computing candidate size and updating dp and prev arrays if candidate size is greater.",
                    hasparent: true,
                    children: [
                      {
                        id: "step-1748855935470-7628",
                        code: "",
                        content:
                          "Compute a candidate subset size: candidateSize = dp[j] + 1.",
                        correctStep: "",
                        prompt: "",
                        status: {
                          correctness: "correct",
                          can_be_further_divided: "cannot",
                        },
                        general_hint: "",
                        detailed_hint: "",
                        hasparent: true,
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
                        id: "step-1748855935470-5922",
                        code: "",
                        content: "If candidateSize > dp[i], then:",
                        correctStep: "",
                        prompt: "",
                        status: {
                          correctness: "correct",
                          can_be_further_divided: "can",
                        },
                        general_hint:
                          "This step can be further divided into updating dp and prev arrays.",
                        detailed_hint:
                          "Divide this step into updating dp[i] and prev[i] if candidate size is greater.",
                        hasparent: true,
                        children: [
                          {
                            id: "step-1748855935470-1610",
                            code: "",
                            content: "Update dp[i] = candidateSize.",
                            correctStep: "",
                            prompt: "",
                            status: {
                              correctness: "correct",
                              can_be_further_divided: "cannot",
                            },
                            general_hint: "",
                            detailed_hint: "",
                            hasparent: true,
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
                            id: "step-1748855935470-7556",
                            code: "",
                            content: "Update prev[i] = j.",
                            correctStep: "",
                            prompt: "",
                            status: {
                              correctness: "correct",
                              can_be_further_divided: "cannot",
                            },
                            general_hint: "",
                            detailed_hint: "",
                            hasparent: true,
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
  {
    id: "step-1748855935470-8112",
    code: "",
    content: "Find the maximum‐length ending index",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing variables and iterating to find the maximum.",
    detailed_hint:
      "Divide this step into initializing maxSize and maxIndex, then iterating through dp array to find the maximum.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-1795",
        code: "",
        content: "Let maxSize = 0 and maxIndex = 0.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-2497",
        code: "",
        content: "For each i from 0 to n–1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into checking and updating maxSize and maxIndex.",
        detailed_hint:
          "Divide this step into checking if dp[i] is greater than maxSize and updating maxSize and maxIndex if true.",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-599",
            code: "",
            content:
              "If dp[i] > maxSize, then set maxSize = dp[i] and maxIndex = i.",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
  {
    id: "step-1748855935470-1916",
    code: "",
    content: "Reconstruct the largest divisible subset via backtracking",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into initializing the answer list and backtracking to reconstruct the subset.",
    detailed_hint:
      "Divide this step into creating the answer list, setting cur to maxIndex, and backtracking through prev array to reconstruct the subset.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-8452",
        code: "",
        content: "Create an empty list answer = [].",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-6931",
        code: "",
        content: "Let cur = maxIndex.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-6703",
        code: "",
        content: "While cur != -1:",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "can",
        },
        general_hint:
          "This step can be further divided into appending elements to the answer list and updating cur.",
        detailed_hint:
          "Divide this step into appending A[cur] to the answer list and updating cur to prev[cur].",
        hasparent: true,
        children: [
          {
            id: "step-1748855935470-681",
            code: "",
            content: "Prepend A[cur] to the front of answer.",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
            id: "step-1748855935470-8861",
            code: "",
            content: "Update cur = prev[cur].",
            correctStep: "",
            prompt: "",
            status: {
              correctness: "correct",
              can_be_further_divided: "cannot",
            },
            general_hint: "",
            detailed_hint: "",
            hasparent: true,
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
  {
    id: "step-1748855935470-7413",
    code: "",
    content: "Return the result",
    correctStep: "",
    prompt: "",
    status: {
      correctness: "correct",
      can_be_further_divided: "can",
    },
    general_hint:
      "The step is correct but can be further divided into confirming the answer and returning it.",
    detailed_hint:
      "Divide this step into confirming that the answer list holds a valid subset and returning it.",
    hasparent: false,
    children: [
      {
        id: "step-1748855935470-5042",
        code: "",
        content: "answer now holds one valid largest divisible subset.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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
        id: "step-1748855935470-7772",
        code: "",
        content: "Return answer.",
        correctStep: "",
        prompt: "",
        status: {
          correctness: "correct",
          can_be_further_divided: "cannot",
        },
        general_hint: "",
        detailed_hint: "",
        hasparent: true,
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

const testDataTutorial: AbstractionItem[] = [
  {
    id: "abstraction-1748260426981-83469",
    steps: [
      [{ id: "step-1748855935470-1128" }, { id: "step-1748855935470-3631" }],
      [{ id: "step-1748855935470-1795" }],
      [{ id: "step-1748855935470-681" }],
    ],
    correct_answer: {
      stepsTree: {
        R: {
          content: "Generalized iteration and processing",
          general_hint: "Generalized iteration and processing of characters",
          detailed_hint:
            "This step involves iterating over characters and performing a processing action.",
          substeps: {
            R1: {
              content: "Iterate over characters",
              general_hint: "Iterate over characters",
              detailed_hint:
                "This substep involves iterating over each character in a sequence.",
              substeps: {},
            },
            R2: {
              content: "Process character",
              general_hint: "Process character",
              detailed_hint:
                "This substep involves processing the current character.",
              substeps: {},
            },
          },
        },
      },
    },
  },
  {
    id: "abstraction-1748260426981-6579",
    steps: [
      [{ id: "step-1748855935470-1128" }, { id: "step-1748855935470-3631" }],
    ],
    correct_answer: {
      stepsTree: {
        R: {
          content: "Generalized iteration and processing",
          general_hint: "Generalized iteration and processing of characters",
          detailed_hint:
            "This step involves iterating over characters and performing a processing action.",
          substeps: {
            R1: {
              content: "Iterate over characters",
              general_hint: "Iterate over characters",
              detailed_hint:
                "This substep involves iterating over each character in a sequence.",
              substeps: {},
            },
            R2: {
              content: "Process character",
              general_hint: "Process character",
              detailed_hint:
                "This substep involves processing the current character.",
              substeps: {},
            },
            R3: {
              content: "Process character",
              general_hint: "Process character",
              detailed_hint:
                "This substep involves processing the current character.",
              substeps: {},
            },
            R4: {
              content: "Process character",
              general_hint: "Process character",
              detailed_hint:
                "This substep involves processing the current character.",
              substeps: {},
            },
          },
        },
      },
    },
  },
];

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

  isGhost?: boolean;

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { search, pathname } = useLocation();
  const tutorialParam = new URLSearchParams(search).get("tutorial");
  const navigate = useNavigate();
  const startLen = tutorialStepsStart.length;
  const probLen = tutorialSteps.length;
  const absLen = tutorialStepsAbstract.length;

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

  //used for adding step drag and drop
  const [draggingNew, setDraggingNew] = useState(false);

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

  const saveStepTree = useCallback(
    async (newTree: Step[]) => {
      if (!problemId || localStorage.getItem("tutorialStep")) return;

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

  useEffect(() => {
    const el = zoomContentRef.current;
    if (el) {
      el.style.setProperty("--scale", transform.scale.toString());
    }
  }, [transform.scale]);

  //when mouse leftclick down move div grab
  // Mirror React state in a ref
  const transformRef = useRef<Transform>(transform);
  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  //such that the text is focus after zoom in
  useEffect(() => {
    // every time your scale changes, fire a fake resize
    window.dispatchEvent(new Event("resize"));
  }, [transform.scale]);

  //showtheFixing overlay!!
  const [showHoverOverlay, setShowHoverOverlay] = useState(false);

  //One big pan+zoom effect—bind once, direct DOM writes
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
      if (showHoverOverlay) return;
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
      if (showHoverOverlay) return;
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
      if (showHoverOverlay) return;
      dragReady = false;
      if (dragging) {
        dragging = false;
        container.releasePointerCapture(e.pointerId);
        container.style.cursor = "default";
        setTransform({ ...transformRef.current });
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (showHoverOverlay) return;
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

    container.addEventListener("pointerdown", (e) => {
      if (showHoverOverlay) return;
      onPointerDown(e);
    });
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
  }, [draggingNew, showHoverOverlay]);

  const handleDividerDblClick = () => {
    setAnimateToRight(true);
    setTimeout(() => {
      window.location.href = "/start";
    }, 500);
  };
  /* ---------------------------------------
  render Tree function START
--------------------------------------- */
  function calculateStepBoxWidthPx() {
    return 300 + 36;
  }

  const [stepBoxWidth, setStepBoxWidth] = useState(calculateStepBoxWidthPx());

  useEffect(() => {
    const handleResize = () => setStepBoxWidth(calculateStepBoxWidthPx());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialCentering = useRef(true);

  //Start the view from center
  useEffect(() => {
    if (initialCentering.current && steps.length > 0) {
      const firstItem = document.querySelector(".map-abstract-container");
      if (firstItem) {
        firstItem.scrollIntoView({
          behavior: "auto",
          inline: "nearest",
          block: "nearest",
        });
      }
      initialCentering.current = false;
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

  /* COLORING AND BORDER START */

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

  /* COLORING AND BORDER END */

  /* EDITING FUNCTIONALITIES START */

  const [editingPath, setEditingPath] = useState<number[] | null>(null);
  const [tempContent, setTempContent] = useState("");

  //disable pan zoom handler
  const editingRef = useRef(false);
  useEffect(() => {
    editingRef.current = editingPath !== null;
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

  //focus on right step after clicking edit
  useEffect(() => {
    if (editingPath && textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true });
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [editingPath]);

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
      setEditingPath(path);
      setTempContent(initialValue);
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
          saveStepTree(updatedTree);
          // 3) return for React state
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

  /* EDITING FUNCTIONALITIES END */

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
      saveStepTree(updated); // Save the freshly updated tree
      return updated;
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
        saveStepTree(newSteps);
        return newSteps;
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
        saveStepTree(filtered);
        return filtered;
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

  /*------------------------------*/
  /* DRAG AND DROP FUNCTIONS START*/
  /*------------------------------*/

  const [blankStep, setBlankStep] = useState<Step | null>(null);
  interface InsertTarget {
    index: number;
    path: number[];
    /** the X‐coordinate of the slot midpoint or right edge */
    dropX?: number;
  }
  const [insertTarget, setInsertTarget] = useState<InsertTarget | null>(null);
  const insertTargetRef = useRef<InsertTarget | null>(null);
  const blankStepRef = useRef<Step | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const SNAP_THRESHOLD = 200;
  const VERTICAL_THRESHOLD = SNAP_THRESHOLD;

  interface SnapPoint {
    path: number[]; // zero-based path into your tree
    left: number; // left edge x
    right: number; // right edge x
    mid: number; // center x
    top: number; // top y
    bottom: number; // bottom y
  }
  const snapPointsRef = useRef<SnapPoint[]>([]);

  function startNewStepDrag(e: React.PointerEvent) {
    e.preventDefault();

    (e.currentTarget as Element).setPointerCapture(e.pointerId);

    if (stepsRef.current.length === 0) {
      // 1) create & show the blank
      const newBlank = createBlankStep(true);
      blankStepRef.current = newBlank;
      setBlankStep(newBlank);
      setDraggingNew(true);

      // 2) position ghost under the mouse immediately
      setGhostPos({ x: e.clientX, y: e.clientY });

      // 3) listen for move + up + escape
      document.addEventListener("pointermove", onDrag);
      document.addEventListener("pointerup", onDrop);
      document.addEventListener("keydown", onKeyDown);

      // 4) our “insert at root index 0” target
      const emptyTarget = { path: [], index: 0, dropX: e.clientX };
      insertTargetRef.current = emptyTarget;
      setInsertTarget(emptyTarget);

      return;
    }

    (e.currentTarget as Element).setPointerCapture(e.pointerId);

    // grab every actual .tree-node-ab (not the container)
    const boxes = Array.from(
      document.querySelectorAll<HTMLElement>(".tree-node-ab")
    );

    snapPointsRef.current = boxes.map((box) => {
      // derive its path by parsing the parent .tree-root-item’s id="step-…-…"
      const container = box.closest(".tree-root-item") as HTMLElement;
      const id = container.id.replace(/^step-/, "");
      const path = id.split("-").map((n) => parseInt(n, 10));

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

    // insert our ghost placeholder into state
    const newBlank = createBlankStep(true);
    blankStepRef.current = newBlank;
    setBlankStep(newBlank);
    setDraggingNew(true);
    setGhostPos({ x: e.clientX, y: e.clientY });

    document.addEventListener("pointermove", onDrag);
    document.addEventListener("pointerup", onDrop);
    document.addEventListener("keydown", onKeyDown);
  }

  //to add child to childless nodes
  const stepsRef = useRef<Step[]>(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

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
        nodeList = node!.children;
      }
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
      saveStepTree([realStep]);

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

      saveStepTree(newTree);
      return newTree;
    });

    cleanupDrag();
  };

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") cleanupDrag();
  }, []);

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

  function createBlankStep(Selected: boolean): Step {
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
      isGhost: true,
      selected: Selected,
    };
  }

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
  /*------------------------------*/
  /* DRAG AND DROP FUNCTIONS END  */
  /*------------------------------*/

  //------------------------------------------//
  //------------LLM CALLING-------------------//
  //------------------------------------------//

  const [treeCorrect, setTreeCorrect] = useState(true); //used to keep track if the tree is correct!

  useEffect(() => {
    const allStepsAreCorrect = (step: Step): boolean => {
      if (step.status.correctness !== "correct") {
        setTreeCorrect(false);
        return false;
      }
      return step.children.every(allStepsAreCorrect);
    };

    const result = steps.every(allStepsAreCorrect);

    if (result) {
      setTreeCorrect(true);
    }
  }, [steps]);

  //hovering over incorrect tree
  const [isHoveringAbstraction, setIsHoveringAbstraction] = useState(false);
  const [abstractionTooltipPos, setAbstractionTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //simlifying the tree structure to save money on the llm
  function simplifyStepTree(steps: Step[]): any[] {
    return steps.map((step) => ({
      id: step.id,
      content: step.content,
      substeps: simplifyStepTree(step.children),
    }));
  }

  const saveAbstraction = useCallback(
    async (abstraction: any) => {
      if (!problemId || !localStorage.getItem("tutorialStep")) return;

      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch(
          `https://bachelor-backend.erenhomburg.workers.dev/abstraction/v1/saveAbstraction?id=${encodeURIComponent(
            problemId
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ abstraction }),
          }
        );
        if (!res.ok) throw new Error(`Save abstraction failed (${res.status})`);
      } catch (err) {
        console.error("Error in saveAbstraction:", err);
      }
    },
    [problemId]
  );

  const [isLoadingAbstraction, setIsLoadingAbstraction] = useState(false);

  const handleCallAbstraction = async () => {
    if (!treeCorrect || localStorage.get("tutorialStep")) return;

    // 2) Turn on loading
    setIsLoadingAbstraction(true);

    try {
      const simplifiedTree = simplifyStepTree(steps);
      setToggleAbstraction("false");
      const gptResponse = await apiCallAbstract(simplifiedTree); // <-- await here!
      const rawMessage = gptResponse.choices[0].message.content;

      let abstractionJson;
      try {
        abstractionJson = JSON.parse(rawMessage);
      } catch (e) {
        console.error("Failed to parse abstraction JSON:", e);
        return;
      }

      setToggleAbstraction("true");
      await saveAbstraction(abstractionJson);
    } catch (error) {
      console.error("Failed to get response from API Abstract:", error);
    } finally {
      // 3) Always turn loading off, whether success or error
      setIsLoadingAbstraction(false);
    }
  };

  //the abstraction
  const [abstractions, setAbstractions] = useState<AbstractionItem[]>([]);

  const [abstractionToSteps, setAbstractionToSteps] = useState<
    Record<string, string[]>
  >({});
  const [stepToAbstractions, setStepToAbstractions] = useState<
    Record<string, string[]>
  >({});
  //neeeded to load the abstraction everytime we toggle the abstraction
  useEffect(() => {
    if (!problemId) return;

    const load = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return setAbstractions([]);
      try {
        const res = await fetch(
          `https://bachelor-backend.erenhomburg.workers.dev/abstraction/v1/loadAbstraction?id=${encodeURIComponent(
            problemId
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.status === 404) {
          setAbstractions([]);
        } else {
          /*           const data = (await res.json()) as AbstractionItem[];
           */ const testData: AbstractionItem[] = [
            {
              id: "abstraction-1748260426981-83469",
              steps: [
                [
                  { id: "step-1748855935470-1128" },
                  { id: "step-1748855935470-3631" },
                ],
                [{ id: "step-1748855935470-1795" }],
                [{ id: "step-1748855935470-681" }],
              ],
              correct_answer: {
                stepsTree: {
                  R: {
                    content: "Generalized iteration and processing",
                    general_hint:
                      "Generalized iteration and processing of characters",
                    detailed_hint:
                      "This step involves iterating over characters and performing a processing action.",
                    substeps: {
                      R1: {
                        content: "Iterate over characters",
                        general_hint: "Iterate over characters",
                        detailed_hint:
                          "This substep involves iterating over each character in a sequence.",
                        substeps: {},
                      },
                      R2: {
                        content: "Process character",
                        general_hint: "Process character",
                        detailed_hint:
                          "This substep involves processing the current character.",
                        substeps: {},
                      },
                    },
                  },
                },
              },
            },
            {
              id: "abstraction-1748260426981-6579",
              steps: [
                [
                  { id: "step-1748855935470-1128" },
                  { id: "step-1748855935470-3631" },
                ],
              ],
              correct_answer: {
                stepsTree: {
                  R: {
                    content: "Generalized iteration and processing",
                    general_hint:
                      "Generalized iteration and processing of characters",
                    detailed_hint:
                      "This step involves iterating over characters and performing a processing action.",
                    substeps: {
                      R1: {
                        content: "Iterate over characters",
                        general_hint: "Iterate over characters",
                        detailed_hint:
                          "This substep involves iterating over each character in a sequence.",
                        substeps: {},
                      },
                      R2: {
                        content: "Process character",
                        general_hint: "Process character",
                        detailed_hint:
                          "This substep involves processing the current character.",
                        substeps: {},
                      },
                      R3: {
                        content: "Process character",
                        general_hint: "Process character",
                        detailed_hint:
                          "This substep involves processing the current character.",
                        substeps: {},
                      },
                      R4: {
                        content: "Process character",
                        general_hint: "Process character",
                        detailed_hint:
                          "This substep involves processing the current character.",
                        substeps: {},
                      },
                    },
                  },
                },
              },
            },
          ];

          setAbstractions(testData);
          /*           setAbstractions(data || []);
           */

          //here we create the arrays that are easily accessable

          const abstractionToSteps: Record<string, string[]> = {};
          const stepToAbstractions: Record<string, string[]> = {};

          for (const abstraction of testData) {
            const abstractionId = abstraction.id;
            const stepIds: string[] = [];

            for (const group of abstraction.steps) {
              for (const step of group) {
                stepIds.push(step.id);

                // Update reverse mapping: step -> abstraction
                if (!stepToAbstractions[step.id]) {
                  stepToAbstractions[step.id] = [];
                }
                stepToAbstractions[step.id].push(abstractionId);
              }
            }

            // Store abstraction -> step list
            abstractionToSteps[abstractionId] = stepIds;
          }

          setAbstractionToSteps(abstractionToSteps);
          setStepToAbstractions(stepToAbstractions);
        }
      } catch (e) {
        console.error(e);
        setAbstractions([]);
      }
    };

    load();
  }, [problemId]);

  const [abstractionStepLabels, setAbstractionStepLabels] = useState<string[]>(
    []
  );

  const idToLabelMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    function traverse(nodes: Step[], parentPath = "") {
      nodes.forEach((node, i) => {
        const path = parentPath ? `${parentPath}.${i + 1}` : `${i + 1}`;
        map[node.id] = path;
        if (node.children.length) {
          traverse(node.children, path);
        }
      });
    }
    traverse(steps);
    return map;
  }, [steps]);

  //passed as reference to abstractionOverlay
  const [abstractionType, setAbstractionType] = useState<"Group" | "Recycle">(
    "Group"
  );

  //Hovering the abstraction
  const [hoverGroupIds, setHoverGroupIds] = useState<string[]>([]);
  const [hoverPolys, setHoverPolys] = useState<[number, number][][]>([]);
  const [centralHub, setCentralHub] = useState<{ x: number; y: number } | null>(
    null
  );

  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  const doHighlight = useCallback(
    (id: string) => {
      const singleGroupAbstraction = abstractions.find(
        (a) => a.steps.length === 1 && a.steps[0].some((s) => s.id === id)
      );

      let chosen = singleGroupAbstraction;

      // Otherwise fallback to any abstraction containing this step
      if (!chosen) {
        chosen = abstractions.find((a) =>
          a.steps.some((group) => group.some((s) => s.id === id))
        );
      }

      if (!chosen) return;

      const containerRect = mapContainerRef.current!.getBoundingClientRect();

      const newPolys: [number, number][][] = [];
      const newCentroids: { x: number; y: number }[] = [];

      for (const group of chosen.steps) {
        // 1. gather corners for *this* group
        const corners: [number, number][] = [];
        for (const { id: sid } of group) {
          const el = document.querySelector<HTMLElement>(
            `[data-node-id="${sid}"]`
          );
          if (!el) continue;
          const r = el.getBoundingClientRect();
          corners.push(
            [r.left, r.top],
            [r.right, r.top],
            [r.right, r.bottom],
            [r.left, r.bottom]
          );
        }
        if (corners.length === 0) continue;

        // 2. convex hull + pad + smooth (reuse your convexHull + chaikin)
        let hull = convexHull(corners);
        if (hull.length < 3) hull = corners;
        const cx = hull.reduce((sum, [x]) => sum + x, 0) / hull.length;
        const cy = hull.reduce((sum, [, y]) => sum + y, 0) / hull.length;
        const padded = hull.map(([x, y]) => {
          const dx = x - cx,
            dy = y - cy,
            d = Math.hypot(dx, dy) || 1;
          const PAD = 20;
          return [cx + (dx / d) * (d + PAD), cy + (dy / d) * (d + PAD)] as [
            number,
            number
          ];
        });
        const smooth = chaikin(padded, 2);

        // 3. shift to container-relative coords
        const rel = smooth.map(
          ([x, y]) =>
            [x - containerRect.left, y - containerRect.top] as [number, number]
        );
        newPolys.push(rel);

        // 4. record centroid in container coords
        newCentroids.push({
          x: cx - containerRect.left,
          y: cy - containerRect.top,
        });
      }

      const allIds = Array.from(
        new Set(chosen.steps.flatMap((group) => group.map((s) => s.id)))
      );
      setHoverGroupIds(allIds);

      setHoverPolys(newPolys);

      const centralPoint = {
        x: newCentroids.reduce((sum, c) => sum + c.x, 0) / newCentroids.length,
        y: newCentroids.reduce((sum, c) => sum + c.y, 0) / newCentroids.length,
      };
      setCentralHub(centralPoint);
    },
    [abstractions /*…*/]
  );

  useEffect(() => {
    const inTutorial = Boolean(localStorage.getItem("tutorialStep"));
    if (!inTutorial) return;

    // slight delay can help ensure the DOM has updated
    setTimeout(() => {
      doHighlightAll();
    }, 0);
  }, [
    abstractions,
    toggleAbstraction,
    transform.x,
    transform.y,
    transform.scale,
  ]);

  const doHighlightAll = useCallback(() => {
    if (toggleAbstraction === "false") {
      setHoverPolys([]);
      setHoverGroupIds([]);
      setCentralHub(null);

      return;
    }
    if (!mapContainerRef.current) return;
    const containerRect = mapContainerRef.current.getBoundingClientRect();

    // 1) Gather every group (each array of steps) from all abstractions
    const allGroups = abstractions.flatMap((a) => a.steps);

    // 2) For each group, build its hull, pad & smooth it (your existing convexHull + chaikin logic)
    const newPolys: [number, number][][] = [];
    const centroids: { x: number; y: number }[] = [];
    allGroups.forEach((group) => {
      // collect every corner of every step‐box in this group
      const corners: [number, number][] = group.flatMap(({ id }) => {
        const el = document.querySelector<HTMLElement>(
          `[data-node-id="${id}"]`
        );
        if (!el) return [];
        const r = el.getBoundingClientRect();
        return [
          [r.left, r.top],
          [r.right, r.top],
          [r.right, r.bottom],
          [r.left, r.bottom],
        ] as [number, number][];
      });
      if (corners.length === 0) return;

      // convex hull
      let hull = convexHull(corners);
      if (hull.length < 3) hull = corners;

      // centroid
      const cx = hull.reduce((s, [x]) => s + x, 0) / hull.length;
      const cy = hull.reduce((s, [, y]) => s + y, 0) / hull.length;
      centroids.push({ x: cx - containerRect.left, y: cy - containerRect.top });

      // pad & smooth
      const padded = hull.map(([x, y]) => {
        const dx = x - cx,
          dy = y - cy,
          d = Math.hypot(dx, dy) || 1;
        const PAD = 20;
        return [cx + (dx / d) * (d + PAD), cy + (dy / d) * (d + PAD)] as [
          number,
          number
        ];
      });
      const smooth = chaikin(padded, 2);

      // shift into container‐relative coords
      newPolys.push(
        smooth.map(
          ([x, y]) =>
            [x - containerRect.left, y - containerRect.top] as [number, number]
        )
      );
    });

    // 3) Highlight every step ID that belongs to any group
    const allStepIds = Array.from(
      new Set(allGroups.flatMap((g) => g.map((s) => s.id)))
    );

    setHoverPolys(newPolys);
    setHoverGroupIds(allStepIds);

    // 4) Optionally draw a “starburst” hub in the center of all centroids
    if (centroids.length) {
      const hub = centroids.reduce(
        (acc, c) => ({
          x: acc.x + c.x,
          y: acc.y + c.y,
        }),
        { x: 0, y: 0 }
      );
      setCentralHub({
        x: hub.x / centroids.length,
        y: hub.y / centroids.length,
      });
    }

    console.log(hoverPolys, hoverGroupIds, centralHub);
  }, [abstractions, toggleAbstraction]);

  // Needed for reclicks after overlay closes
  const lastHoveredRef = useRef<string | null>(null);

  function onStepMouseEnter(id: string) {
    if (toggleAbstraction !== "true") return;
    lastHoveredRef.current = id;
    setIsHoveringStep(true);
    setHoveredStepId(id);
    doHighlight(id);
  }

  useEffect(() => {
    if (hoverPolys.length === 0) {
      lastHoveredRef.current = null;
    }
  }, [hoverPolys]);

  //used for curves
  function chaikin(
    points: [number, number][],
    iterations = 1
  ): [number, number][] {
    let pts = points;
    for (let it = 0; it < iterations; it++) {
      const newPts: [number, number][] = [];
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[(i + 1) % pts.length];
        // Q = 0.75 * P[i] + 0.25 * P[i+1]
        newPts.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1]);
        // R = 0.25 * P[i] + 0.75 * P[i+1]
        newPts.push([0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]);
      }
      pts = newPts;
    }
    return pts;
  }

  //lines connecting the poly bubbles
  function getEdgeIntersectionWithPolygonEdge(
    polygon: [number, number][],
    origin: { x: number; y: number }
  ): { x: number; y: number } | null {
    if (isPointInPolygon(origin, polygon)) {
      return null; // 🚫 Don't draw a line if the origin is inside the polygon
    }

    const intersections: { x: number; y: number; dist2: number }[] = [];

    for (let i = 0; i < polygon.length; i++) {
      const a = { x: polygon[i][0], y: polygon[i][1] };
      const b = {
        x: polygon[(i + 1) % polygon.length][0],
        y: polygon[(i + 1) % polygon.length][1],
      };

      const intersection = raySegmentIntersection(origin, a, b);
      if (intersection) {
        const dx = intersection.x - origin.x;
        const dy = intersection.y - origin.y;
        intersections.push({
          ...intersection,
          dist2: dx * dx + dy * dy,
        });
      }
    }

    if (intersections.length === 0) return null;

    intersections.sort((a, b) => a.dist2 - b.dist2);
    return { x: intersections[0].x, y: intersections[0].y };
  }
  //helper for getEdgeIntersectionWithPolygonEdge
  function raySegmentIntersection(
    origin: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
  ): { x: number; y: number } | null {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const edge = { x: dx, y: dy };
    const ray = { x: b.x - origin.x, y: b.y - origin.y }; // ray direction

    const s1_x = edge.x;
    const s1_y = edge.y;
    const s2_x = ray.x;
    const s2_y = ray.y;

    const denom = -s2_x * s1_y + s1_x * s2_y;
    if (Math.abs(denom) < 1e-6) return null; // parallel

    const s = (-s1_y * (a.x - origin.x) + s1_x * (a.y - origin.y)) / denom;
    const t = (s2_x * (a.y - origin.y) - s2_y * (a.x - origin.x)) / denom;

    if (s >= 0 && t >= 0 && t <= 1) {
      return {
        x: a.x + t * s1_x,
        y: a.y + t * s1_y,
      };
    }

    return null;
  }
  //helper for getEdgeIntersectionWithPolygonEdge
  function isPointInPolygon(
    point: { x: number; y: number },
    polygon: [number, number][]
  ): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      const intersect =
        yi > point.y !== yj > point.y &&
        point.x <
          ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Monotone chain (Andrew) convex hull
  function convexHull(points: [number, number][]): [number, number][] {
    if (points.length < 4) return points.slice();
    // sort lexicographically
    points = points.slice().sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
    const cross = (
      [ax, ay]: [number, number],
      [bx, by]: [number, number],
      [cx, cy]: [number, number]
    ) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);

    const lower: [number, number][] = [];
    for (let p of points) {
      while (
        lower.length >= 2 &&
        cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
      ) {
        lower.pop();
      }
      lower.push(p);
    }

    const upper: [number, number][] = [];
    for (let i = points.length - 1; i >= 0; i--) {
      let p = points[i];
      while (
        upper.length >= 2 &&
        cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
      ) {
        upper.pop();
      }
      upper.push(p);
    }

    // remove duplicates of endpoints
    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }

  useEffect(() => {
    if (hoveredStepId) {
      doHighlight(hoveredStepId);
    }
    if (localStorage.getItem("tutorialStep") && toggleAbstraction === "false") {
      setTimeout(() => {
        doHighlightAll();
      }, 0);
    }
  }, [
    transform.x,
    transform.y,
    transform.scale,
    doHighlight,
    hoveredStepId,
    toggleAbstraction,
  ]);

  useEffect(() => {
    const onResize = () => {
      if (hoveredStepId) doHighlight(hoveredStepId);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hoveredStepId, doHighlight]);

  const [isHoveringStep, setIsHoveringStep] = useState(false);
  const [isHoveringPoly, setIsHoveringPoly] = useState(false);

  useEffect(() => {
    if (showHoverOverlay) return;
    if (!isHoveringStep && !isHoveringPoly) {
      setHoveredStepId(null);
      setHoverPolys([]);
      setHoverGroupIds([]);
    }
  }, [isHoveringStep, isHoveringPoly, showHoverOverlay]);

  /**
   * Recursively renders a node and its children
   */
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
            className={`tree-node-ab ${
              hoverGroupIds.includes(node.id) ? "highlighted" : ""
            }`}
            data-node-id={node.id}
            onMouseEnter={() => onStepMouseEnter(node.id)}
            onMouseLeave={() => {
              setIsHoveringStep(false);
            }}
            style={{
              border: `2px ${getBorder(node)} black`,
              backgroundColor: getStepBoxColor(node),
              color: getStepBoxTextColor(node),
            }}
          >
            <div className="tree-node-text">
              <div
                className="the-top-part-of-step-box-abstract"
                style={{ width: "100%" }}
              >
                <div className="title-icon-tree-ab">
                  <strong>Step {indexPath}</strong>
                  <div className="icon-container">
                    <div className="leftSide-Icons">
                      <Pen
                        className="Filetext-tree abstract"
                        strokeWidth={1.2}
                        onClick={() => handleStartEditing(path, node.content)}
                        style={{ fill: editingPath ? "lightgray" : undefined }}
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
                      />
                      <Trash
                        cursor="pointer"
                        strokeWidth={1.2}
                        color={getStepBoxTextColor(node)}
                        onClick={() => handleRemoveStep(node.id)}
                        className="trash-icon abstract"
                      />
                    </div>
                  </div>
                </div>
                <div className="group-or-recycle">
                  {(toggleAbstraction === "true" ||
                    toggleAbstraction === "false") &&
                    (() => {
                      // 1) Find all abstractions that mention this step-ID:
                      const absIds = stepToAbstractions[node.id] || [];
                      const matches = abstractions.filter((a) =>
                        absIds.includes(a.id)
                      );

                      // 2) Determine flags:
                      const hasGrouping = matches.some(
                        (a) => a.steps.length === 1
                      );
                      const hasRecycling = matches.some(
                        (a) => a.steps.length > 1
                      );

                      if (!treeCorrect) return;

                      // 3) Render according to rules:
                      if (!hasGrouping && !hasRecycling) {
                        // No matching abstraction at all
                        return (
                          <div
                            className="container-icon-grouping-recycling letsgoski"
                            ref={
                              node.id === "step-1748855935470-7564"
                                ? refs.ten
                                : undefined
                            }
                          >
                            Fully Abstracted
                          </div>
                        );
                      }

                      return (
                        <>
                          {hasGrouping && (
                            <div
                              className="container-icon-grouping-recycling"
                              ref={
                                node.id === "step-1748855935470-1128"
                                  ? refs.eigth
                                  : undefined
                              }
                            >
                              <Users
                                style={{ width: "20px", height: "20px" }}
                              />
                            </div>
                          )}

                          {hasRecycling && (
                            <div
                              className="container-icon-grouping-recycling"
                              ref={
                                node.id === "step-1748855935470-1128"
                                  ? refs.nine
                                  : undefined
                              }
                            >
                              <Recycle
                                style={{ width: "20px", height: "20px" }}
                              />
                            </div>
                          )}
                        </>
                      );
                    })()}
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

  /**
   * Entry point rendering the whole tree
   */
  function renderTree(tree = steps) {
    return (
      <div className="tree-root">
        {tree.map((node, i) => renderNode(node, `${i + 1}`, [i]))}
      </div>
    );
  }

  //particles coming out of the hovered steps
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (hoverPolys.length === 0) return;
    const svg = svgRef.current!;
    const paths = svg.querySelectorAll<SVGPathElement>(".highlight-path");

    const SPAWN_RATE = 50;
    const PARTICLE_LIFE = 800;

    const id = window.setInterval(() => {
      paths.forEach((path) => {
        const pathLen = path.getTotalLength();
        const { x, y } = path.getPointAtLength(Math.random() * pathLen);

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", `${x}`);
        circle.setAttribute("cy", `${y}`);
        circle.setAttribute("r", "2");
        circle.setAttribute("class", "particle-circle");
        svg.appendChild(circle);

        const angle = Math.random() * Math.PI * 2;
        const dist = 20 + Math.random() * 10;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        circle.animate(
          [
            { transform: "translate(0,0)", opacity: 1 },
            { transform: `translate(${dx}px,${dy}px)`, opacity: 0 },
          ],
          {
            duration: PARTICLE_LIFE,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        setTimeout(() => {
          if (circle.parentNode === svg) svg.removeChild(circle);
        }, PARTICLE_LIFE + 50);
      });
    }, SPAWN_RATE);

    return () => window.clearInterval(id);
  }, [hoverPolys]);

  //used for sending the correct prompt
  const [chosenAbstraction, setChosenAbstraction] =
    useState<AbstractionItem | null>(null);

  /* ---------------------------------------
  render Tree function END
--------------------------------------- */

  /* ---------------------------------------
  TUTORIAL START
--------------------------------------- */

  const [stepIndex, setStepIndex] = useState<number>(
    Number(localStorage.getItem("tutorialStep") || "0")
  );
  const SPACING = 10;
  const [holeRect, setHoleRect] = useState<DOMRect | null>(null);
  const [animate, setAnimate] = useState<boolean>(true);
  const tutorialModalRef = useRef<HTMLDivElement>(null);
  const [modalSize, setModalSize] = useState({
    width: 0,
    height: 0,
  });
  const TOTAL_STEPS = (tutorialParam === "3" ? startLen + probLen : 0) + absLen;
  const modalRef = useRef<HTMLDivElement>(null);

  const current = tutorialStepsAbstract[stepIndex - 1] || null;

  const refs: Record<
    TutorialStep["targetKey"],
    React.RefObject<HTMLDivElement>
  > = {
    first: useRef<HTMLDivElement>(null!),
    second: useRef<HTMLDivElement>(null!),
    third: useRef<HTMLDivElement>(null!),
    fourth: useRef<HTMLDivElement>(null!),
    fifth: useRef<HTMLDivElement>(null!),
    six: useRef<HTMLDivElement>(null!),
    seven: useRef<HTMLDivElement>(null!),
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

  useEffect(() => {
    if (tutorialParam !== "3" && stepIndex !== 0) {
      setStepIndex(0);
      localStorage.removeItem("tutorialStep");
    }
    if (tutorialParam !== "3" && stepIndex !== -1) {
      setStepIndex(0);
      localStorage.removeItem("tutorialStep");
    }
  }, [pathname, search]);

  useEffect(() => {
    if (tutorialParam === "3") {
      setAnimate(true);
      if (stepIndex === -1) {
        /* setStepIndex(49); */
        //last step
      } else {
        setStepIndex(1);
      }
    }
  }, [tutorialParam]);

  useEffect(() => {
    if (stepIndex > 0) {
      localStorage.setItem("tutorialStep", String(stepIndex));
    } else {
      localStorage.removeItem("tutorialStep");
    }
  }, [stepIndex]);

  useLayoutEffect(() => {
    if (stepIndex > 0) {
      setAnimate(true); // if you still want your anim flag reset
      const cur = tutorialStepsAbstract[stepIndex - 1];
      if (!cur) {
        setHoleRect(null);
      } else {
        // 1) measure hole
        const r = refs[cur.targetKey].current?.getBoundingClientRect() || null;
        setHoleRect(r);
        // 2) measure modal
        if (tutorialModalRef.current) {
          const m = tutorialModalRef.current.getBoundingClientRect();
          setModalSize({ width: m.width, height: m.height });
        }
      }
      // persist
      if (stepIndex > 0) {
        localStorage.setItem("tutorialStep", String(stepIndex));
      }
    }
  }, [stepIndex, transform.x, transform.y]);

  // debounce disable-restore animate on resize/scroll
  const animateRef = useRef(animate);
  // will store the animate value that needs to be restored
  const prevAnimateRef = useRef<boolean>(animate);
  const resizeTimer = useRef<number | null>(null);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const measureHole = () => {
    if (current) {
      const r =
        refs[current.targetKey].current?.getBoundingClientRect() || null;
      setHoleRect(r);
    } else {
      setHoleRect(null);
    }
  };
  const measureModal = () => {
    if (modalRef.current) {
      const r = modalRef.current.getBoundingClientRect();
      setModalSize({ width: r.width, height: r.height });
    }
  };

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

  // compute modal position (flip logic)
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

  const go = (idx: number, animated: boolean) => {
    setAnimate(animated);
    if (idx < 1 || idx > TOTAL_STEPS) {
      nextFinish();
    } else {
      setStepIndex(idx);
    }
  };

  const cancelTutorial = () => {
    setStepIndex(0);
    localStorage.removeItem("tutorialStep");
    setSteps(originalStepsRef.current);
    setAbstractions([]);
    setHoverPolys([]);
    setHoverGroupIds([]);
    setCentralHub(null);
    navigate(pathname, { replace: true });
  };

  const nextFinish = () => {
    setSteps(originalStepsRef.current);
    setStepIndex(0);
    localStorage.removeItem("tutorialStep");
    navigate(pathname, { replace: true });
  };

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

  // ─── TUTORIAL OVERLAY JSX ────────────────────────────────────
  // place this right before your final `return ( … )` closing brace:
  const originalStepsRef = useRef<Step[]>([]);

  const startTutorial = () => {
    originalStepsRef.current = steps;

    setStepIndex(1);
    setSteps(tutorialStepJSON1);
  };

  useEffect(() => {
    if (stepIndex === 4) {
      setSteps(tutorialStepJSON1);
    } else if (stepIndex === 5) {
      setSteps(tutorialStepJSON2);
      setAbstractions([]);
      setAbstractionToSteps({});
      setStepToAbstractions({});
    } else if (stepIndex === 6) {
      setToggleAbstraction("true");
      setAbstractions([...testDataTutorial]);

      const abstractionToSteps: Record<string, string[]> = {};
      const stepToAbstractions: Record<string, string[]> = {};

      for (const abstraction of testDataTutorial) {
        const abstractionId = abstraction.id;
        const stepIds: string[] = [];

        for (const group of abstraction.steps) {
          for (const step of group) {
            stepIds.push(step.id);

            // Update reverse mapping: step -> abstraction
            if (!stepToAbstractions[step.id]) {
              stepToAbstractions[step.id] = [];
            }
            stepToAbstractions[step.id].push(abstractionId);
          }
        }

        // Store abstraction -> step list
        abstractionToSteps[abstractionId] = stepIds;
      }

      setAbstractionToSteps({ ...abstractionToSteps });
      setStepToAbstractions({ ...stepToAbstractions });
    } else if (stepIndex === 7) {
      setToggleAbstraction("true");
    } else if (stepIndex === 8) {
      setToggleAbstraction("false");
    }
  }, [stepIndex]);
  /* ---------------------------------------
  TUTORIAL END
--------------------------------------- */

  return (
    <div
      ref={(el) => {
        if (el) {
          mainContainerRef.current = el;
          refs.first.current = el;
          refs.six.current = el;
        }
      }}
      className={`main-container-abstract ${
        animateToRight ? "slide-right" : ""
      }`}
    >
      {isLoadingAbstraction && (
        <div className="abstraction-spinner-overlay">
          <GradientSpinner />
        </div>
      )}
      {/* Left line container*/}

      <div ref={rightAbstractRef} className="right-abstract-container">
        <div
          className="divider abstract"
          onDoubleClick={() => {
            setAnimateToRight(true);
            handleDividerDblClick();
          }}
        />
      </div>
      {/* Header container*/}
      <div className="header-abstract">
        <div ref={headerRef} className="header-text-abstract">
          <div className="header-left-ab-container">
            <div className="header-left-abstraction">
              <div
                className="container-icons-ab"
                onClick={handleToggleAbstraction}
                ref={refs.seven}
              >
                {toggleAbstraction === "true" ? (
                  <Eye className="Check-abstract" strokeWidth="1px" />
                ) : (
                  <EyeOff className="X-abstract" strokeWidth="1px" />
                )}
              </div>
              <div
                className="left-header-container-ab-notIcon"
                onClick={treeCorrect ? handleCallAbstraction : undefined}
                onMouseEnter={() => setIsHoveringAbstraction(true)}
                onMouseLeave={() => {
                  setIsHoveringAbstraction(false);
                  setAbstractionTooltipPos(null);
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setAbstractionTooltipPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                style={{ position: "relative" }}
                ref={(el) => {
                  if (el) {
                    refs.fourth.current = el;
                    refs.fifth.current = el;
                  }
                }}
              >
                Abstraction {treeCorrect ? <SearchCheck /> : <SearchX />}
                {/*Hovering over the incorrect step tree*/}
                {!treeCorrect &&
                  isHoveringAbstraction &&
                  abstractionTooltipPos && (
                    <div
                      style={{
                        position: "absolute",
                        left: abstractionTooltipPos.x,
                        top: abstractionTooltipPos.y + 20,
                        background: "#fff5f5",
                        border: "1px solid #ff4d4f",
                        borderRadius: "6px",
                        padding: "6px 10px",
                        color: "#ff4d4f",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        transform: "translate(-50%, 0)",
                        zIndex: 1000,
                        pointerEvents: "none",
                      }}
                    >
                      Tree is not correct!
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div
            className="select-problem-abstract"
            ref={(el) => {
              if (el) {
                dropdownRef.current = el;
                refs.third.current = el;
              }
            }}
          >
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
              className={`dropdown-list-abstract ${
                isDropdownOpen ? "open" : ""
              }`}
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
        <div className="container-plus-ab" ref={refs.second}>
          <SquarePlus
            className="square-plus-ab"
            onPointerDown={startNewStepDrag}
            style={{ touchAction: "none" }}
          />
        </div>
      </div>

      {/* Tree Container container*/}
      {draggingNew && ghostPos && (
        <div
          style={{
            position: "fixed",
            top: ghostPos.y - 12, // roughly half the icon’s height
            left: ghostPos.x - 12, // roughly half the icon’s width
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
      <div className="map-abstract-container" ref={mapContainerRef}>
        <div className="zoom-content" ref={zoomContentRef}>
          {renderTree(getPreviewSteps())}
        </div>

        {/* ========== SVG overlay for group highlight ========== */}
        {hoverPolys.length > 0 && (
          <svg
            ref={svgRef}
            className="abstraction-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {hoverPolys.map((poly, i) => (
              <polygon
                key={i}
                className="highlight-poly"
                points={poly.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke="white"
                strokeWidth={4}
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  pointerEvents: "all",
                }}
                onMouseEnter={() => {
                  setIsHoveringPoly(true);
                  if (hoveredStepId) doHighlight(hoveredStepId);
                }}
                onMouseLeave={() => {
                  setIsHoveringPoly(false);
                }}
                onClick={() => {
                  // allow click even if hoveredStepId was cleared
                  const clickId = hoveredStepId ?? lastHoveredRef.current;
                  if (hoverPolys.length > 0 && clickId) {
                    const matches = abstractions.filter((a) =>
                      a.steps.some((group) =>
                        group.some((s) => s.id === clickId)
                      )
                    );
                    const chosen =
                      matches.find((a) => a.steps.length === 1) ??
                      // otherwise take the first match (a multi-group)
                      matches[0];

                    const getAbstractionType = matches.find(
                      (a) => a.steps.length === 1
                    )
                      ? "Group"
                      : "Recycle";

                    if (getAbstractionType === "Recycle") {
                      // Flatten out every step‐ID in the chosen Recycle abstraction:
                      const allStepIds: string[] = chosen.steps.flatMap(
                        (group) => group.map((s) => s.id)
                      );

                      // Now check: for each of those step‐IDs, is there still a “Group” abstraction
                      // (i.e. some abstraction whose .steps.length > 1) that contains it?
                      const needsMoreGrouping = allStepIds.some((stepId) => {
                        const containingAbstractions =
                          stepToAbstractions[stepId] || [];

                        return containingAbstractions.some((absId) => {
                          // 1) Skip the Recycle abstraction we just clicked on:
                          if (absId === chosen.id) return false;

                          // 2) If any *other* abstraction is a “Group” type (i.e. steps.length === 1),
                          //    block the click immediately:
                          const abs = abstractions.find((a) => a.id === absId);
                          return !!abs && abs.steps.length === 1;
                        });
                      });

                      if (needsMoreGrouping) {
                        // At least one step is still in some OTHER Group‐type abstraction,
                        // so we block the Recycle click by returning early.
                        return;
                      }

                      if (needsMoreGrouping) {
                        console.log("ci");
                        // As soon as you find at least one step‐ID that still belongs to a multi‐step group,
                        // “block” the Recycle click by returning early.
                        return;
                      }
                    }

                    if (chosen) {
                      setChosenAbstraction(chosen);
                      setShowHoverOverlay(true);
                      const labels = chosen.steps.flatMap((group) =>
                        group.map((s) => {
                          const num = idToLabelMap[s.id] ?? s.id;
                          return `Step ${num}`;
                        })
                      );

                      setChosenAbstraction(chosen);
                      setAbstractionStepLabels(labels);
                      setShowHoverOverlay(true);
                      setAbstractionType(getAbstractionType);
                    }
                  }
                }}
              />
            ))}

            {/* if you have at least two centroids, connect them */}
            <defs>
              <linearGradient
                id="energy-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            {centralHub &&
              hoverPolys.map((poly, i) => {
                const point = getEdgeIntersectionWithPolygonEdge(
                  poly,
                  centralHub
                );
                if (!point) return null;
                return (
                  <React.Fragment key={`line-group-${i}`}>
                    <line
                      x1={centralHub.x}
                      y1={centralHub.y}
                      x2={point.x}
                      y2={point.y}
                      className="lines-connecting-abstract-bubbles"
                      strokeWidth={2}
                      strokeDasharray="4 2"
                    />
                    <line
                      x1={centralHub.x}
                      y1={centralHub.y}
                      x2={point.x}
                      y2={point.y}
                      className="line-pulse"
                      strokeWidth={2}
                    />
                  </React.Fragment>
                );
              })}

            {hoverPolys.map((poly, i) => (
              <path
                key={`path-${i}`}
                id={i === 0 ? "highlight-path" : undefined}
                // keep the original id on the first one for your existing useEffect
                className="highlight-path"
                d={`M${poly.map((p) => p.join(" ")).join(" L")} Z`}
                fill="none"
                stroke="none"
              />
            ))}
          </svg>
        )}
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
      {showHoverOverlay && (
        <div
          className="fullscreen-overlay fade-in-correctStep"
          style={{ pointerEvents: "all" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowHoverOverlay(false);
            }
          }}
        >
          <AbstractionOverlay
            saveAbstraction={saveAbstraction}
            originalAbstraction={abstractions}
            originalSetAbstraction={setAbstractions}
            originalSteps={steps}
            originalSetSteps={setSteps}
            onClose={() => setShowHoverOverlay(false)}
            abstraction={chosenAbstraction}
            abstractionToSteps={abstractionToSteps}
            stepLabels={abstractionStepLabels}
            getType={abstractionType}
          />
        </div>
      )}
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
              width: holeRect.width,
              height: holeRect.height,
            }}
            onClick={() => go(stepIndex + 1, animate)}
          />

          <div
            ref={modalRef}
            className="tutorial-step-container"
            style={
              holeRect &&
              (current?.targetKey === "first" || current?.targetKey === "six")
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
                        (tutorialParam === "3"
                          ? tutorialSteps.length + tutorialStepsStart.length
                          : 0)) /
                        TOTAL_STEPS) *
                      100
                    }%`,
                  }}
                >
                  <span className="tutorial-progress-number">
                    {stepIndex +
                      (tutorialParam === "3"
                        ? tutorialSteps.length + tutorialStepsStart.length
                        : 0)}
                  </span>
                </div>
                <span className="tutorial-progress-total">/ {TOTAL_STEPS}</span>
              </div>
            </div>
            <div className="tutorial-content">
              <p>{current.content}</p>
            </div>
            <div className="tutorial-footer">
              <button
                disabled={stepIndex === 1 && tutorialParam !== "3"}
                onClick={() => {
                  if (tutorialParam === "3" && stepIndex === 1) {
                    localStorage.setItem(
                      "tutorialStep",
                      String(-1) // last Problem step
                    );

                    window.location.href = `${tutorialRoutes[1]}/Problem%201?tutorial=2`;
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

      <div className="container-tutorial-problem abstract">
        <div className="Tutorial-Problem" onClick={startTutorial}>
          ?
        </div>
      </div>
    </div>
  );
};

export default Abstract;
