import axios from "axios";

export const handleRunCode = async (
  code: string,
  setCodeOutput: (output: string) => void,
  isAuthenticated: boolean,
  setOutput: (output: string) => void,
  action: "run" | "compile" | "test"
): Promise<void> => {
  setCodeOutput(`Executing ${action}...`);
  setOutput("");

  if (!isAuthenticated) {
    setCodeOutput("Need to login");
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/execute/", {
      code,
      action,
    });

    setCodeOutput(response.data.output);
    setOutput(response.data.output);
  } catch (error) {
    console.error("Error:", error);

    if (axios.isAxiosError(error)) {
      setCodeOutput(
        `Error: ${error.response?.data?.message || "Unknown error from server"}`
      );
    } else {
      setCodeOutput("Error: Could not connect to backend.");
    }
  }
};
