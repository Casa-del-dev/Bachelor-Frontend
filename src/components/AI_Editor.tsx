import axios from "axios";

const API_ENDPOINT =
  "https://bachelor-backend.erenhomburg.workers.dev/openai/v3/";

export const apiCallEditor = async (problemDetails: any, code: string) => {
  try {
    const requestBody = {
      Problem: problemDetails,
      Code: code,
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

export default apiCallEditor;
