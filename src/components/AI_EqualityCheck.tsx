import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v6/";

export const apiCallCheckAbstraction = async (
  AbstractedSteps: any,
  ActualAbstractionSteps: any
) => {
  try {
    const requestBody = {
      solutionSteps: AbstractedSteps,
      actualSolutionSteps: ActualAbstractionSteps,
    };

    console.log("Sending API Request:", requestBody);

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

export default apiCallCheckAbstraction;
