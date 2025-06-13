import {
  FolderPlus,
  Lightbulb,
  Network,
  Paintbrush,
  Pen,
  ShieldCheck,
  TableRowsSplit,
  Trash,
} from "lucide-react";
import { FaCog, FaHourglassHalf, FaPlay } from "react-icons/fa";

export interface TutorialStepStart {
  /** key must match one of your refs below */
  targetKey:
    | "first"
    | "second"
    | "third"
    | "fourth"
    | "fifth"
    | "sixth"
    | "seventh"
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
    | "twentyfour"
    | "twentyfive"
    | "twentysix"
    | "twentyseven"
    | "twentyeight"
    | "twentynine"
    | "thirty"
    | "thirtyone"
    | "thirtytwo"
    | "thirtythree"
    | "thirtyfour"
    | "thirtyfive"
    | "thirtysix"
    | "thirtyseven"
    | "thirtyeigth"
    | "thirtynine"
    | "fourty"
    | "fourtyone"
    | "fourtytwo"
    | "fourtythree"
    | "fourtyfour"
    | "fourtyfive"
    | "fourtysix"
    | "fourtyseven"
    | "fourtyeigth"
    | "fourtynine";
  title: string;
  content: React.ReactNode;
}

const tutorialSteps: TutorialStepStart[] = [
  {
    targetKey: "first",
    title: "Start Page",
    content:
      "On this page, you can solve your selected problems using Python. With the help of the decomposition box, you can improve your problem-solving skills and deepen your interest in programming. On this webpage, we'll be focusing on solving problems only by using Python.",
  },
  {
    targetKey: "second",
    title: "Left Side",
    content:
      "On the left side of the start page, you can find your files and a description of the problem you're currently trying to solve.",
  },
  {
    targetKey: "third",
    title: "Navigation Buttons",
    content:
      "With these two buttons, you can easily switch between the file view and the problem description.",
  },
  {
    targetKey: "fourth",
    title: "Problem Button",
    content: "Click on the problem button.",
  },
  {
    targetKey: "fifth",
    title: "Problem View on the Start Page",
    content:
      "This view shows you the problem description again, allowing you to refer back to the task while working on your solution. And...",
  },
  {
    targetKey: "sixth",
    title: "Quick Problem Switch",
    content:
      "If you're feeling stuck or frustrated with the current problem, you can use this dropdown to quickly switch to a different one you'd like to solve.",
  },
  {
    targetKey: "seventh",
    title: "Project System Files",
    content: "Click on the project system files button.",
  },
  {
    targetKey: "eigth",
    title: "File Tree",
    content: (
      <p>
        Here you can view your file tree. You can{" "}
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          add{" "}
          <FolderPlus
            style={{ width: "16px", height: "16px", verticalAlign: "middle" }}
          />
        </span>
        ,{" "}
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          delete{" "}
          <Trash
            style={{ width: "16px", height: "16px", verticalAlign: "middle" }}
          />
        </span>
        , or rename files and folders by double-clicking on the names.
      </p>
    ),
  },
  {
    targetKey: "nine",
    title: "Test Files",
    content:
      "When you test your files, they are checked against all the test cases listed in this section.",
  },
  {
    targetKey: "ten",
    title: "Selecting a File",
    content: "Let's select a file.",
  },
  {
    targetKey: "eleven",
    title: "Code Section",
    content:
      "Here you can view and edit the code of the currently selected file.",
  },
  {
    targetKey: "twelve",
    title: "Terminal Section",
    content:
      "This is your terminal. It runs locally on your device and can be used to execute Python scripts, and view output.",
  },
  {
    targetKey: "thirteen",
    title: "Terminal Buttons",
    content: (
      <p>
        Here you have three terminal buttons:{" "}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginRight: "10px",
          }}
        >
          Run <FaPlay style={{ verticalAlign: "middle" }} />,
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginRight: "10px",
          }}
        >
          Compile <FaCog style={{ verticalAlign: "middle" }} />,
        </span>
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          Test <FaHourglassHalf style={{ verticalAlign: "middle" }} />.
        </span>
      </p>
    ),
  },
  {
    targetKey: "fourteen",
    title: "Run",
    content: (
      <p>
        Click the <strong>Run</strong> button to run all your files and{" "}
        <strong>see the output</strong> in the terminal.
      </p>
    ),
  },
  {
    targetKey: "fifthteen",
    title: "Compile",
    content: (
      <p>
        Click the <strong>Compile</strong> button to compile all your files and{" "}
        <strong>see the output</strong> in the terminal.
      </p>
    ),
  },
  {
    targetKey: "sixthteen",
    title: "Test",
    content: (
      <p>
        Click the <strong>Test</strong> button to test all your files and{" "}
        <strong>see the output</strong> in the terminal.
      </p>
    ),
  },
  {
    targetKey: "seventeen",
    title: "Coding and Decomposition Step Tree",
    content:
      "The middle and right sections are closely connected. We’ll now look at how you can work with both and communicate between them effectively.",
  },
  {
    targetKey: "eighteen",
    title: "Generate Decomposition from Code",
    content: (
      <p>
        You can choose whether to start with coding or with the decomposition
        tree. If you begin by writing code, you can click the{" "}
        <Network style={{ display: "inline", verticalAlign: "middle" }} />{" "}
        button at the top to generate a step tree using an AI model that
        translates your code into structured steps.
      </p>
    ),
  },
  {
    targetKey: "nineteen",
    title: "Loading",
    content: (
      <p>
        While the AI model is processing, you'll see a rotating check icon ✓.
      </p>
    ),
  },
  {
    targetKey: "twenty",
    title: "Step Tree",
    content:
      "Once loading is complete, you'll see a step tree showing all your steps along with their correctness. Additionally...",
  },
  {
    targetKey: "twentyone",
    title: "Commented Code",
    content:
      "Additionally, your code is automatically commented, with each comment corresponding to its respective step.",
  },
  {
    targetKey: "twentytwo",
    title: "Paintbrush Button",
    content: (
      <p>
        After your code has been commented, click the{" "}
        <Paintbrush
          style={{ display: "inline-block", verticalAlign: "middle" }}
        />{" "}
        button to activate the interaction between your code and the step tree.
      </p>
    ),
  },
  {
    targetKey: "twentythree",
    title: "Interaction: Code ↔ Step Tree",
    content:
      "When hovering over lines of code, you'll normally see the corresponding step highlighted in the decomposition tree. However, this interaction is disabled during the tutorial.",
  },
  {
    targetKey: "twentyfour",
    title: "Delete Step Tree",
    content: (
      <p>
        In the previous approach, you started with the code and then generated
        the step tree. Now, let's reverse the process and start with the tree.
        First, delete the current tree by clicking the{" "}
        <Trash style={{ display: "inline-block", verticalAlign: "middle" }} />{" "}
        button.
      </p>
    ),
  },
  {
    targetKey: "twentyfive",
    title: "Input Text",
    content:
      "Since most people have a lot of ideas, and I'm sure you do too, you can start developing your step tree using plain text.",
  },
  {
    targetKey: "twentysix",
    title: "Input Text 2",
    content:
      "For the purpose of this tutorial, we've decided to continue with the following input text.",
  },
  {
    targetKey: "twentyseven",
    title: "Create the Step Tree",
    content:
      "Once you're happy with your prompt, you can send the text to an AI model to generate the step tree. Just click the ✓ button.",
  },
  {
    targetKey: "twentyeight",
    title: "Loading",
    content: (
      <p>
        While the AI model is processing, you'll see a rotating check icon ✓.
      </p>
    ),
  },
  {
    targetKey: "twentynine",
    title: "Step Tree",
    content:
      "After loading, you'll see the step tree generated from your input text.",
  },
  {
    targetKey: "thirty",
    title: "Icon 1",
    content: (
      <p>
        Every step has the same structure. Let's go through them all.
        <br />
        The <Pen style={{ verticalAlign: "middle" }} /> icon allows you to edit
        the content of the step when clicked.
      </p>
    ),
  },
  {
    targetKey: "thirtyone",
    title: "Icon 2",
    content: (
      <p>
        The <TableRowsSplit style={{ verticalAlign: "middle" }} /> icon allows
        you to create an exact copy of the current step when clicked.
      </p>
    ),
  },
  {
    targetKey: "thirtytwo",
    title: "Icon 3",
    content: (
      <p>
        Whenever you're stuck on a step and can't find the correct answer, you
        can click the <Lightbulb style={{ verticalAlign: "middle" }} /> icon to
        get up to three hints: a general hint, a detailed hint, and the actual
        correct step. In this case, there are no hints available, so the{" "}
        <Lightbulb style={{ verticalAlign: "middle" }} /> icon is not filled.
      </p>
    ),
  },
  {
    targetKey: "thirtythree",
    title: "Icon 4",
    content: (
      <p>
        The <Trash style={{ verticalAlign: "middle" }} /> icon allows you to
        delete the current step when clicked.
      </p>
    ),
  },
  {
    targetKey: "thirtyfour",
    title: "Navigation Buttons",
    content:
      "These buttons help you navigate the step tree, reducing the need to scroll — especially when the tree is very long. In this case, they are all deactivated because there is no previous, next, or parent step for the current step.",
  },
  {
    targetKey: "thirtyfive",
    title: "Substeps",
    content:
      "If a step has substeps, you can view and scroll through them here. To expand and see their content, we'll click on them.",
  },
  {
    targetKey: "thirtysix",
    title: "Expanded Substep",
    content:
      "Now that we've clicked the substep, we can see it displayed beneath the parent step.",
  },
  {
    targetKey: "thirtyseven",
    title: "Check Button",
    content:
      "Once you feel the step tree is correct, click the check button. This will send your tree to an AI model, which will then evaluate its correctness.",
  },
  {
    targetKey: "thirtyeigth",
    title: "Loading",
    content:
      "This is the Loading animation while we wait for a response from the AI model.",
  },
  {
    targetKey: "thirtynine",
    title: "Checking Response",
    content:
      "For the purpose of this tutorial, we’ll display all possible states that the correctness check can return. Let’s go through them.",
  },
  {
    targetKey: "fourty",
    title: "Missing Step",
    content:
      "A missing step is represented with dashed borders. It indicates a logically necessary step that was missing in your original step tree. You’ll receive all three hints for each missing step.",
  },
  {
    targetKey: "fourtyone",
    title: "Hints",
    content: (
      <p>
        As you can see, the <Lightbulb style={{ verticalAlign: "middle" }} />{" "}
        icon is filled and contains three hints. Let's click on it!
      </p>
    ),
  },
  {
    targetKey: "fourtytwo",
    title: "Hint Appearance",
    content:
      "This is how the hints are displayed. For the purpose of the tutorial, clicking once shows both the general and detailed hints. In practice, each hint would require a separate click, with an additional one needed to reveal the correct answer.",
  },
  {
    targetKey: "fourtythree",
    title: "Incorrect Step",
    content:
      "Incorrect steps are shown with a red background. These are steps where your intent was correct, but the content needs further improvement or corrections. You'll receive three hints for each incorrect step.",
  },
  {
    targetKey: "fourtyfour",
    title: "Dividable Step",
    content:
      "Dividable steps are shown with a light blue background. These steps are correct, but could be broken down further. If you feel they can be improved, you can create additional substeps to split the original one. You’ll receive two hints, the 'correct content' hint is not provided for dividable steps.",
  },
  {
    targetKey: "fourtyfive",
    title: "Correct Step",
    content:
      "Correct steps are shown with a green background. They indicate that the step is accurate, so no hints are provided here.",
  },
  {
    targetKey: "fourtysix",
    title: "Shield-Check Button",
    content: (
      <p>
        You can use the <ShieldCheck style={{ verticalAlign: "middle" }} />{" "}
        button to send your currently selected code and step tree to an AI
        model. It will compare them to check whether the code is implemented as
        described in the step tree. This button is typically used at the end,
        once the step tree is considered correct.
      </p>
    ),
  },
  {
    targetKey: "fourtyseven",
    title: "Loading",
    content:
      "This is the Loading animation while we wait for a response from the AI model.",
  },
  {
    targetKey: "fourtyeigth",
    title: "Commented Code",
    content: (
      <>
        <p>
          The AI model returns your code with comments added to mark the steps.
          You might see lines like:
        </p>
        <p># Step 1</p>
        <p># Step 2 – NOT IMPLEMENTED CORRECTLY</p>
        <p># MISSING STEP</p>
      </>
    ),
  },
  {
    targetKey: "fourtynine",
    title: "Correct and Implemented Step",
    content: (
      <p>
        After receiving the model's response from clicking the{" "}
        <ShieldCheck style={{ verticalAlign: "middle" }} /> button, you'll see
        an additional dark green step. This indicates a step that is both
        correct and correctly implemented in your code.
      </p>
    ),
  },
  // … add as many steps as you like here
];

export default tutorialSteps;
