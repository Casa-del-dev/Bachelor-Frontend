import { HiX } from "react-icons/hi";
import "./Login.css";

interface LoginProps {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
}

export default function Login({ setIsLoginModalOpen }: LoginProps) {
  return (
    <div className="login-container">
      <div className="login-card">
        <HiX className="close-btn" onClick={() => setIsLoginModalOpen(false)} />

        <h2 className="login-title">Login</h2>

        <div className="login-button-container">
          <button
            className="login-button"
            onClick={() => {
              window.location.href =
                "https://bachelor-api.erenhomburg.com/auth/v1/github/login";
            }}
            style={{ fontSize: "10px" }}
          >
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
