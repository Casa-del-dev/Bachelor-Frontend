import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v2/";

export const apiCallCheck = async (problemDetails: any, steps: any) => {
  try {
    const requestBody = {
      Problem: problemDetails,
      Tree: steps ?? {},
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
