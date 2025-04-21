import "./Profile.css";
import { useAuth } from "../AuthContext";

interface ProfileProps {
  openLogin: () => void;
  openSignup: () => void;
}

export default function Profile({ openLogin, openSignup }: ProfileProps) {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const { logout } = useAuth();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {username ? (
          <>
            <div className="avatar">
              <span>{username.charAt(0).toUpperCase()}</span>
            </div>
            <h2>{username}</h2>
            <p className="email">{email || "No email available"}</p>
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
