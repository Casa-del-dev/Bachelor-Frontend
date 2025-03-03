import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import "./SignUp.css";

interface SignUpProps {
  setIsModalOpen: (open: boolean) => void; // Accept function to close modal
  setIsLoginModalOpen: (open: boolean) => void;
}

export default function SignUp({
  setIsModalOpen,
  setIsLoginModalOpen,
}: SignUpProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, _] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Close Button (Inside SignUp) */}

        <HiX className="close-btn" onClick={() => setIsModalOpen(false)} />

        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name Field */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="John Doe"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="john@example.com"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
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

          {/* Confirm Password Field */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
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
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="signup-button-container">
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </div>
        </form>

        {/* Login Redirect */}
        <p className="signup-footer">
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => {
              setIsModalOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="login-link"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
