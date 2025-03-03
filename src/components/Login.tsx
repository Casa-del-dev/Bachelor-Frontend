import { useState } from "react";
import { HiEye, HiEyeOff, HiX } from "react-icons/hi";
import "./Login.css";

interface LoginProps {
  setIsLoginModalOpen: (open: boolean) => void; // Function to close modal
  setIsModalOpen: (open: boolean) => void;
}

export default function Login({
  setIsLoginModalOpen,
  setIsModalOpen,
}: LoginProps) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Logging in with:", formData);
      // Add API authentication logic here
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Close Button */}
        <HiX className="close-btn" onClick={() => setIsLoginModalOpen(false)} />

        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
