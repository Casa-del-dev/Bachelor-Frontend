export interface TutorialStep {
  /** key must match one of your refs below */
  targetKey: "first" | "second" | "third" | "fourth" | "fifth";
  title: string;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
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
  // … add as many steps as you like here
];

export default tutorialSteps;
