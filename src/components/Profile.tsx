import "./Profile.css";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import ReviewCard from "./BuildingBlocks/ReviewCard";

interface ProfileProps {
  openLogin: () => void;
}

export default function Profile({ openLogin }: ProfileProps) {
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

  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Not authenticated");

    const loadReviewFromBackend = async () => {
      try {
        const res = await fetch(
          "https://bachelor-backend.erenhomburg.workers.dev/review/v1/load",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const { rating, message } = await res.json();

        setReviewMessage(message);
        setReviewRating(rating);
      } catch (err) {
        console.error("Error loading review (falling back to empty):", err);
        setReviewMessage("");
        setReviewRating(0);
      }
    };
    loadReviewFromBackend();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {username ? (
          <>
            <div className="profile-content" style={{ marginBlockEnd: "1em" }}>
              <div className="profile-info">
                <div className="avatar">
                  <span>{username.charAt(0).toUpperCase()}</span>
                </div>
                <h2>{username}</h2>
                <p className="email">
                  {email === "null" ? "No email available" : email}
                </p>
              </div>

              <div className="localstorage-section">
                <div className="localstorage-item">
                  <p>
                    <strong>Generating Step Tree from Code</strong>
                  </p>
                  <div className="button-group-profile">
                    <button
                      className="option-btn"
                      onClick={dontAskValue ? undefined : () => {}}
                    >
                      {dontAskValue ? "Skip" : "Don't Skip"}
                      {dontAskValue && (
                        <RotateCcw
                          className="refresh-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearDontAsk();
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                <div className="localstorage-item">
                  <p>
                    <strong>Give Correct Step</strong>
                  </p>
                  <div className="button-group-profile">
                    <button
                      className="option-btn"
                      onClick={savedStepsValue ? undefined : () => {}}
                    >
                      {savedStepsValue ? "Skip" : "Don't Skip"}
                      {savedStepsValue && (
                        <RotateCcw
                          className="refresh-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSavedSteps();
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="Review-container">
              <h3
                style={{ marginBlockStart: "0.5em", marginBlockEnd: "0.5em" }}
              >
                Review
              </h3>
              <ReviewCard
                username={username}
                rating={reviewRating}
                setReviewRating={setReviewRating}
                message={reviewMessage}
                setReviewMessage={setReviewMessage}
                onDelete={async () => {
                  setReviewMessage("");
                  setReviewRating(0);

                  try {
                    const token = localStorage.getItem("authToken");
                    if (!token) throw new Error("Not authenticated");
                    const res = await fetch(
                      "https://bachelor-backend.erenhomburg.workers.dev/review/v1/save",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          rating: 0,
                          message: "",
                        }),
                      }
                    );
                    if (!res.ok)
                      throw new Error(`Server returned ${res.status}`);
                  } catch (err) {
                    console.error("Error saving review:", err);
                  }
                }}
                onSave={async (newMessage: string, newRating: number) => {
                  setReviewMessage(newMessage);
                  setReviewRating(newRating);

                  try {
                    const token = localStorage.getItem("authToken");
                    if (!token) throw new Error("Not authenticated");
                    const res = await fetch(
                      "https://bachelor-backend.erenhomburg.workers.dev/review/v1/save",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          rating: newRating,
                          message: newMessage,
                        }),
                      }
                    );
                    if (!res.ok)
                      throw new Error(`Server returned ${res.status}`);
                  } catch (err) {
                    console.error("Error saving review:", err);
                  }
                }}
              />
            </div>

            <button className="logout-btn" onClick={logout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <h2>Welcome!</h2>
            <p className="login-hint">Log in to view your profile.</p>
            <button className="auth-btn login" onClick={openLogin}>
              Log In
            </button>
          </>
        )}
      </div>
    </div>
  );
}
