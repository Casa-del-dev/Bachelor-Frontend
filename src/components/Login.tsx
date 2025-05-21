import { HiX } from "react-icons/hi";
import "./Login.css";
import { FaGithub } from "react-icons/fa";

interface LoginProps {
  setIsLoginModalOpen: (open: boolean) => void;
}

export default function Login({ setIsLoginModalOpen }: LoginProps) {
  return (
    <div className="login-container">
      <div className="login-card">
        <HiX className="close-btn" onClick={() => setIsLoginModalOpen(false)} />

        <h2 className="login-title">Login</h2>

        <div className="login-button-container">
          <button
            className="github-login-button"
            onClick={() => {
              const origin = window.location.origin;
              const state = encodeURIComponent(window.location.href);
              const redirectUri = encodeURIComponent(
                `${origin}/github/callback`
              );
              window.location.href = `https://bachelor-api.erenhomburg.com/auth/v1/github/login?state=${state}&redirect_uri=${redirectUri}`;
            }}
          >
            <FaGithub className="github-icon" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
