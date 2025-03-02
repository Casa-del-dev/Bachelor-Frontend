import "./Problem.css";
import Problem_left from "./Problem_left.tsx";

const Problem = () => {
  return (
    <div className="container">
      {/*Left side*/}
      <Problem_left />
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
