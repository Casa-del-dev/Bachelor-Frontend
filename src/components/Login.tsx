import { useState } from "react";
import { HiEye, HiEyeOff, HiX } from "react-icons/hi";
import { login } from "../Api.ts"; // Import login API
import "./Login.css";

interface LoginProps {
  setIsLoginModalOpen: (open: boolean) => void;
  setIsModalOpen: (open: boolean) => void;
}

export default function Login({
  setIsLoginModalOpen,
  setIsModalOpen,
}: LoginProps) {
  const [formData, setFormData] = useState({
    username: "", // ✅ Changed from "name" to "username"
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage(null);

    let newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await login(formData.username, formData.password);
      localStorage.setItem("authToken", response.token); // ✅ Store JWT token
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        setIsLoginModalOpen(false); // ✅ Close modal after login
      }, 1500);
    } catch (err) {
      setErrors({ form: "Invalid username or password" });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <HiX className="close-btn" onClick={() => setIsLoginModalOpen(false)} />

        <h2 className="login-title">Login</h2>
        {message && <p className="success-text">{message}</p>}
        {errors.form && <p className="error-text">{errors.form}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username Field */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username" // ✅ Fixed field name
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="JohnDoe"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input-password"
                placeholder="••••••••"
              />
              {showPassword ? (
                <HiEyeOff
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <HiEye
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div className="login-button-container">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </form>

        {/* Sign-Up Redirect */}
        <p className="login-footer">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={() => {
              setIsLoginModalOpen(false);
              setIsModalOpen(true);
            }}
            className="login-link"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
