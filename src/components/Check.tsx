import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v1/";

export const apiCall = async (
  prompt: string,
  problemDetails: any,
  steps: any
) => {
  try {
    const requestBody = {
      Prompt: prompt,
      Problem: problemDetails,
      Tree: steps ?? {},
    };

    console.log("Sending API Request:", requestBody); // Debugging log

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

export default apiCall;
