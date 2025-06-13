import {
  Check,
  Eye,
  EyeOff,
  Hash,
  LayoutTemplate,
  Lightbulb,
  Recycle,
  Search,
  SquarePlus,
  Users,
  X,
} from "lucide-react";

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
  content: React.ReactNode;
}

const tutorialStepsAbstract: TutorialStep[] = [
  {
    targetKey: "first",
    title: "Abstraction Page",
    content:
      "The Abstraction Page is designed to help you further develop your skills. In programming, it's common to reuse certain parts of your code. Abstraction allows you to generalize specific steps so they can be reused in other parts of your step tree.",
  },
  {
    targetKey: "second",
    title: "Adding Steps",
    content: (
      <p>
        You can drag the <SquarePlus style={{ verticalAlign: "middle" }} /> icon
        into the tree to add new steps.
      </p>
    ),
  },
  {
    targetKey: "third",
    title: "Quick Problem Switch",
    content:
      "If you're feeling stuck or frustrated with the current problem, you can use this dropdown to quickly switch to a different one you'd like to solve.",
  },
  {
    targetKey: "fourth",
    title: "Find Abstraction",
    content: (
      <p>
        Use the <Search style={{ verticalAlign: "middle" }} /> button to call an
        AI model that identifies possible abstractions in your step tree. As you
        can see, there's an <X style={{ verticalAlign: "middle" }} /> icon
        overlay, indicating the tree isn't fully correct. To search for
        abstractions, you first need to complete and correct your step tree.
      </p>
    ),
  },
  {
    targetKey: "fifth",
    title: "Find Abstraction",
    content:
      "Now that the step tree is correct, we can proceed to call the abstraction model.",
  },
  {
    targetKey: "six",
    title: "Abstraction View",
    content: (
      <p>
        Abstractions are displayed using bubbles. Some bubbles contain multiple
        steps — these are <Users style={{ verticalAlign: "middle" }} />{" "}
        <strong>Grouping Abstractions</strong>, which identify steps that can be
        combined into fewer, more general steps.
        <br />
        <br />
        Other abstractions span multiple bubbles across the tree—these are{" "}
        <Recycle style={{ verticalAlign: "middle" }} />{" "}
        <strong>Recycling Abstractions</strong>, where the same generalized step
        can replace repeated patterns.
        <br />
        <br />
        In this case, you can see a grouping bubble on the left. When zooming
        out to view the entire tree, you'll also see the recycling bubbles that
        span across it.
        <br />
        <br />
        <em>
          For the purpose of this tutorial, all abstraction bubbles are always
          visible. In practice, they only appear when you hover over the
          corresponding steps.
        </em>
      </p>
    ),
  },
  {
    targetKey: "seven",
    title: "Toggle Abstraction View",
    content: (
      <p>
        These bubbles can sometimes feel overwhelming to work with. You can use
        the <Eye style={{ verticalAlign: "middle" }} /> button to toggle the
        abstraction view on and off as needed.
      </p>
    ),
  },
  {
    targetKey: "eigth",
    title: "Grouping",
    content: (
      <p>
        This icon represents <Users style={{ verticalAlign: "middle" }} />{" "}
        <strong>Grouping Abstractions</strong>, which identify local steps that
        can be combined into fewer, more general steps.
      </p>
    ),
  },
  {
    targetKey: "nine",
    title: "Recycle",
    content: (
      <p>
        This icon represents <Recycle style={{ verticalAlign: "middle" }} />{" "}
        <strong>Recycling Abstractions</strong>, which identify global steps
        that can be replaced with the same generalized step.
      </p>
    ),
  },
  {
    targetKey: "ten",
    title: "Fully Abstracted",
    content: (
      <div>
        <div
          className="container-icon-grouping-recycling letsgoski"
          style={{
            width: "120px",
            display: "inline-block",
            verticalAlign: "middle",
            textAlign: "center",
            fontSize: "15px",
            fontWeight: "normal",
            padding: "3px 5px",
          }}
        >
          Fully abstracted{" "}
        </div>{" "}
        steps are already generalized and do not require any further
        abstraction.
      </div>
    ),
  },
  {
    targetKey: "eleven",
    title: "Toggle Abstraction View",
    content: (
      <p>
        Click the <EyeOff style={{ verticalAlign: "middle" }} /> button to turn
        on the abstraction view so we can begin abstracting.
      </p>
    ),
  },
  {
    targetKey: "twelve",
    title: "Start Abstracting",
    content:
      "Click on the bubble to open the abstraction overlay, where you can begin creating abstractions. You always need to start by abstracting the Grouping abstraction before moving on to the Recycling ones. So, we'll begin by clicking on the Grouping bubble.",
  },
  {
    targetKey: "thirteen",
    title: "Abstraction Overlay",
    content:
      "Here you can create abstractions freely. Once your new tree is correct, it will replace the original bubble in the main step tree.",
  },
  {
    targetKey: "fourteen",
    title: "Title",
    content:
      "The title indicates which type of abstraction you're currently working on. In this tutorial, we are in the Grouping phase.",
  },
  {
    targetKey: "fifthteen",
    title: "Steps to Be Abstracted",
    content: "Here you see a list of all the steps that will be abstracted.",
  },
  {
    targetKey: "sixthteen",
    title: "Adding Steps",
    content: (
      <p>
        You can drag the <SquarePlus style={{ verticalAlign: "middle" }} /> icon
        into the tree to add new steps.
      </p>
    ),
  },
  {
    targetKey: "seventeen",
    title: "Hint: Steps Required",
    content: (
      <p>
        Clicking <Hash style={{ verticalAlign: "middle" }} /> hint will show you
        the number of steps needed to achieve an optimal abstraction.
      </p>
    ),
  },
  {
    targetKey: "eighteen",
    title: "Steps Required",
    content:
      "After clicking the hash hint, we now know that 5 steps are needed for a perfect abstraction.",
  },
  {
    targetKey: "nineteen",
    title: "Hint: Layout Reveal",
    content: (
      <p>
        After clicking <LayoutTemplate style={{ verticalAlign: "middle" }} />{" "}
        hint, you’ll see the exact step layout required for the abstraction. At
        this point, you can no longer add additional steps.
      </p>
    ),
  },
  {
    targetKey: "twenty",
    title: "Layout Reveal",
    content: (
      <p>
        As you can see, after clicking{" "}
        <LayoutTemplate style={{ verticalAlign: "middle" }} />, the full layout
        is revealed. From this point on, you only need to work on the content of
        each step.
      </p>
    ),
  },
  {
    targetKey: "twentyone",
    title: "Hint: Reveal Hints",
    content: (
      <p>
        Clicking the <Lightbulb style={{ verticalAlign: "middle" }} /> icon will
        reveal hints for all steps, just like you’ve seen on the Start Page.
      </p>
    ),
  },
  {
    targetKey: "twentytwo",
    title: "Step Hints",
    content:
      "Each step provides three hints: a general hint, a detailed hint, and the correct answer.",
  },
  {
    targetKey: "twentythree",
    title: "Check Button",
    content: (
      <p>
        Once you're confident in your abstraction, click the{" "}
        <Check style={{ verticalAlign: "middle" }} /> button. This will send
        your solution to an AI model. If it's correct, your abstraction will be
        substituted into the original step tree.
      </p>
    ),
  },
  {
    targetKey: "twentyfour",
    title: "Abstraction Result",
    content:
      "As you can see, the left part of your tree has been completely replaced by your new abstraction and now only requires a Recycling abstraction. Of course, in this tutorial the abstraction doesn’t actually make sense and wouldn’t work in practice—it’s only meant to demonstrate the process.",
  },

  // … add as many steps as you like here
];

export default tutorialStepsAbstract;
