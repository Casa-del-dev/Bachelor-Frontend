const API_BASE_URL = "https://bachelor-api.erenhomburg.com/auth/v1";

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
    if (response.status === 409) throw new Error("User already exists");
    throw new Error("Signup failed");
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

  return response.json();
};
