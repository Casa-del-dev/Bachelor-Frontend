import "./Problem.css";

const Problem = () => {
  return (
    <div className="container">
      {/*Left side*/}
      <div className="left-side">
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
        <div className="container-fluid">Problem</div>
      </div>
      {/*Separator*/}
      <div className="custom-line"></div>

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
