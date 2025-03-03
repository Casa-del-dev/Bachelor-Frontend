const API_BASE_URL = "https://bachelor-api.erenhomburg.com/auth/v1"; // Replace with actual backend URL

export const signUp = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("User already exists or another error occurred.");
  }

  return response.json();
};

export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials.");
  }

  const data = await response.json();
  localStorage.setItem("authToken", data.token); // ✅ Store token in localStorage
  return data;
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
