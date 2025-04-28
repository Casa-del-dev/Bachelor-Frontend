import "./Profile.css";
import { useAuth } from "../AuthContext";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi"; // Import refresh icon

interface ProfileProps {
  openLogin: () => void;
  openSignup: () => void;
}

export default function Profile({ openLogin, openSignup }: ProfileProps) {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const { logout } = useAuth();

  const [dontAskValue, setDontAskValue] = useState<string | null>(
    localStorage.getItem("dontAskGenerateStepTree")
  );
  const [savedStepsValue, setSavedStepsValue] = useState<string | null>(
    localStorage.getItem("savedCorrectSteps")
  );

  const clearDontAsk = () => {
    localStorage.removeItem("dontAskGenerateStepTree");
    setDontAskValue(null);
  };

  const clearSavedSteps = () => {
    localStorage.removeItem("savedCorrectSteps");
    setSavedStepsValue(null);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {username ? (
          <>
            <div className="profile-content">
              <div className="profile-info">
                <div className="avatar">
                  <span>{username.charAt(0).toUpperCase()}</span>
                </div>
                <h2>{username}</h2>
                <p className="email">{email || "No email available"}</p>
              </div>

              <div className="localstorage-section">
                <div className="localstorage-item">
                  <p>
                    <strong>Generating Step Tree from Code</strong>
                  </p>
                  <div className="button-group-profile">
                    <button className="option-btn">
                      {dontAskValue ? "Skip" : "Don't Skip"}
                    </button>
                    <FiRefreshCw
                      className="refresh-btn"
                      onClick={clearDontAsk}
                    />
                  </div>
                </div>

                <div className="localstorage-item">
                  <p>
                    <strong>Give Correct Step</strong>
                  </p>
                  <div className="button-group-profile">
                    <button className="option-btn">
                      {savedStepsValue ? "Skip" : "Don't Skip"}
                    </button>
                    <FiRefreshCw
                      className="refresh-btn"
                      onClick={clearSavedSteps}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="logout-btn" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <h2>Welcome!</h2>
            <p className="login-hint">
              Log in or sign up to view your profile.
            </p>
            <button className="auth-btn login" onClick={openLogin}>
              Log In
            </button>
            <button className="auth-btn signup" onClick={openSignup}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
