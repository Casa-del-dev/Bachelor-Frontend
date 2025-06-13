export interface TutorialStep {
  /** key must match one of your refs below */
  targetKey: "first" | "second" | "third" | "fourth" | "fifth";
  title: string;
  content: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    targetKey: "first",
    title: "Problem Page",
    content:
      "On this page, you can browse through the problems and select one you'd like to solve.",
  },
  {
    targetKey: "second",
    title: "Manage Problems",
    content:
      "Here you can see all available problems that you can choose from.",
  },
  {
    targetKey: "third",
    title: "Select a Problem",
    content:
      "Simply click on a problem to select it. In this tutorial, we'll choose Problem 1.",
  },
  {
    targetKey: "fourth",
    title: "Problem Description",
    content:
      "On the right side, after selecting a problem, you can see the problem details and the task that needs to be solved.",
  },
  {
    targetKey: "fifth",
    title: "Start Solving",
    content: (
      <div>
        Once you've decided which problem you'd like to solve, click the{" "}
        <div
          className="check-button"
          style={{
            fontSize: "17px",
            width: "90px",
            height: "30px",
            display: "inline-block",
            borderRadius: "10px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          Solve
        </div>{" "}
        button. In this tutorial, we'll solve Problem 1.
      </div>
    ),
  },
  // … add as many steps as you like here
];

export default tutorialSteps;
