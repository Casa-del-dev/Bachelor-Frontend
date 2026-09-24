import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v2/";

export const apiCallCheck = async (problemDetails: string, steps: unknown) => {
  try {
    const Problem = problemDetails?.trim();
    const Tree = typeof steps === "string" ? steps.trim() : steps;
    const hasTree =
      typeof Tree === "string"
        ? Tree.length > 0
        : Array.isArray(Tree)
          ? Tree.length > 0
          : Tree !== null &&
            typeof Tree === "object" &&
            Object.keys(Tree).length > 0;

    if (!Problem || !hasTree) {
      throw new Error(
        "The OpenAI check request requires non-empty Problem and Tree fields."
      );
    }

    const requestBody = {
      Problem,
      Tree,
    };

    console.log("Sending API Request:", requestBody); // Debugging log

    const response = await axios.post(API_ENDPOINT, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};

export default apiCallCheck;
