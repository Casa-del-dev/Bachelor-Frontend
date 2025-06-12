export interface TutorialStep {
  /** key must match one of your refs below */
  targetKey:
    | "first"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "six"
    | "seven"
    | "eigth"
    | "nine"
    | "ten"
    | "eleven"
    | "twelve"
    | "thirteen"
    | "fourteen"
    | "fifthteen"
    | "sixthteen"
    | "seventeen"
    | "eighteen"
    | "nineteen"
    | "twenty"
    | "twentyone"
    | "twentytwo"
    | "twentythree"
    | "twentyfour";
  title: string;
  content: string;
}

const tutorialStepsAbstract: TutorialStep[] = [
  {
    targetKey: "first",
    title: "Tutorial Step",
    content: "This is the list of problems.",
  },
  {
    targetKey: "second",
    title: "Tutorial Step",
    content: "This thin line separates list from details.",
  },
  {
    targetKey: "third",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "fourth",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "fifth",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "six",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "seven",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "eigth",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "nine",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "ten",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "eleven",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twelve",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "thirteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "fourteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "fifthteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "sixthteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "seventeen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "eighteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "nineteen",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twenty",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twentyone",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twentytwo",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twentythree",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },
  {
    targetKey: "twentyfour",
    title: "Tutorial Step",
    content: "Here you see the details of your selection.",
  },

  // … add as many steps as you like here
];

export default tutorialStepsAbstract;
