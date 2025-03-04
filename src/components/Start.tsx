import "./Start.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StartLeft from "./Start-left";
import StartRight from "./Start-right";

const Start = () => {
  // Get the id from the URL if provided
  const { id } = useParams<{ id: string }>();
  const [_, setSelectedProblem] = useState<string>("");

  useEffect(() => {
    if (id) {
      setSelectedProblem(id);
    } else {
      const stored = localStorage.getItem("selectedProblem");
      if (stored) {
        setSelectedProblem(stored);
      }
    }
  }, [id]);

  return (
    <div className="container-main">
      <StartLeft />
      <div className="middle-main">
        <h1>ciao 2</h1>
      </div>
      <div className="right-main">
        <StartRight />
      </div>
      {/*<h1>Start</h1>
      <p>Selected problem: {selectedProblem}</p>*/}
    </div>
  );
};

export default Start;
