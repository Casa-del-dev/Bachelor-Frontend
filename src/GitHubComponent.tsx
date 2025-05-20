import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function GitHubCallback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) return console.error("No code provided");

      try {
        const res = await fetch(
          `https://bachelor-api.erenhomburg.com/auth/v1/github/callback?code=${code}`
        );
        if (!res.ok) throw new Error(await res.text());

        const { token, username, email } = await res.json();
        // store everything
        localStorage.setItem("authToken", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        login(token);

        navigate("/"); // back to main page
      } catch (err) {
        console.error("OAuth failed", err);
      }
    })();
  }, [login, navigate]);

  return <p>Logging in with GitHub…</p>;
}
