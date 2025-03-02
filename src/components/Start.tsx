import "./Start.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Start = () => {
  // Get the id from the URL if provided
  const { id } = useParams<{ id: string }>();
  const [selectedProblem, setSelectedProblem] = useState<string>("");

  useEffect(() => {
    if (id) {
      // If an id is provided in the URL, update the state
      setSelectedProblem(id);
    } else {
      // Otherwise, check localStorage for a saved selection
      const stored = localStorage.getItem("selectedProblem");
      if (stored) {
        setSelectedProblem(stored);
      }
    }
  }, [id]);

  return (
    <div className="container">
      <h1>Start</h1>
      <p>Selected problem: {selectedProblem}</p>
      {/* Add your additional content for the Start component here */}
    </div>
  );
};

export default Start;
