import axios from "axios";

export const handleRunCode = async (
  code: string,
  codeOutput: string,
  setCodeOutput: (output: string) => void,
  isAuthenticated: boolean,
  setOutput: (output: string) => void
): Promise<void> => {
  setCodeOutput("Running...");
  setOutput(codeOutput);
  if (!isAuthenticated) {
    setCodeOutput("Need to login");
    setOutput(codeOutput);
    return;
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/run-python/", {
      code: code,
    });
    console.log(response);
    setCodeOutput(response.data.output);
    setOutput(codeOutput);
  } catch (error) {
    console.error("Error:", error);

    if (axios.isAxiosError(error)) {
      setCodeOutput(
        `Error: ${error.response?.data?.message || "Unknown error from server"}`
      );
      setOutput("Results: " + codeOutput);
    } else {
      setCodeOutput("Error: Could not connect to backend.");
      setOutput(codeOutput);
    }
  }
};
