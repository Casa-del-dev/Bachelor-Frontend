import "./Problem.css";
//import Button from "./BuildingBlocks/Button.tsx";

const Problem = () => {
  return (
    <div className="container">
      {/*Left side*/}
      <div className="left-side">
        <div className="left-side-title">Problems</div>
        <div className="custom-line-left-side"></div>
        <div className="left-side-content">
          <div className="general-button">Problem 1</div>
          <div className="general-button">Problem 2</div>
          <div className="general-button">Problem 3</div>
          <div className="general-button">Problem 4</div>
          <div className="general-button">Problem 5</div>
          <div className="general-button">Problem 6</div>
          <div className="general-button">Problem 7</div>
          <div className="general-button">Problem 8</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
          <div className="general-button">Problem 9</div>
        </div>
      </div>
      {/*Separator*/}
      <div className="container-separator-problem">
        <div className="custom-line"></div>
      </div>

      {/*Right side*/}
      <div className="right-side">
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
      </div>
    </div>
  );
};

export default Problem;
