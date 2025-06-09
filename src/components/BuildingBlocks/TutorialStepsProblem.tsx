export interface TutorialStep {
  /** key must match one of your refs below */
  targetKey: "left" | "sep" | "right";
  title: string;
  content: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    targetKey: "left",
    title: "Tutorial Step 1/3",
    content: "This is the list of problems.",
  },
  {
    targetKey: "sep",
    title: "Tutorial Step 2/3",
    content: "This thin line separates list from details.",
  },
  {
    targetKey: "right",
    title: "Tutorial Step 3/3",
    content: "Here you see the details of your selection.",
  },
  // … add as many steps as you like here
];

export default tutorialSteps;
