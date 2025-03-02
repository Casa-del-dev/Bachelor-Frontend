import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToStart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the selected problem from local storage.
    const selected =
      localStorage.getItem("selectedProblem") || "defaultProblem";
    // Redirect to /start/{selected}
    navigate(`/start/${selected}`);
  }, [navigate]);

  return null;
};

export default RedirectToStart;
