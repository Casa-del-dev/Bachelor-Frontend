import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v1/";

export const apiCall = async (prompt: string, problemDetails: string) => {
  try {
    const Prompt = prompt?.trim();
    const Problem = problemDetails?.trim();

    if (!Prompt || !Problem) {
      throw new Error(
        "The OpenAI request requires non-empty Prompt and Problem fields."
      );
    }

    const requestBody = {
      Prompt,
      Problem,
    };

    console.log("Sending API Request:", requestBody); // Debugging log

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

export default apiCall;
