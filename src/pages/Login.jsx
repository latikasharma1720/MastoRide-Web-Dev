import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { setUser } from "../utils/session";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(location.state?.message || "");

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Enter a valid email.";
    }
    if (!password) {
      errs.password = "Enter your password.";
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const emailLower = email.trim().toLowerCase();

      if (emailLower === "admin@mastoride.app") {
        setUser({
          id: "a1",
          name: "Admin",
          email: "admin@mastoride.app",
          role: "admin",
        });
        navigate("/admin/profile", { replace: true });
      } else {
        setUser({
          id: "u1",
          name: emailLower.split("@")[0],
          email: emailLower,
          role: "user",
        });
        navigate("/user/dashboard", { replace: true });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="modern-login-page">
        {/* NEW layout wrapper: image on the left, form on the right */}
        <div className="modern-login-layout">
          {/* Left animated image */}
          <div className="login-image-container">
            <img
              src="/assets/images/Login Graphic.png"
              alt="Boy pointing at login form"
              className="login-illustration"
            />
          </div>

          {/* Right: existing login container */}
          <div className="modern-login-container">
            {/* Success Message */}
            {successMsg && (
              <div className="success-banner">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {successMsg}
              </div>
            )}

            {/* Login Card */}
            <div className="modern-login-card">
              {/* Header - UPDATED WITH SPLIT STYLE */}
              <div className="login-header">
                <h1 className="split-heading">
                  <span className="split-word-first">Member</span>
                  <span className="split-word-second">Login</span>
                </h1>
              </div>

              {/* Form */}
              <form className="modern-login-form" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="modern-field">
                  <label htmlFor="email">PFW Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@pfw.edu"
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>

                {/* Password Field */}
                <div className="modern-field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="login-options">
                  <label className="remember-checkbox">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Lost your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button type="submit" className="modern-login-btn">
                  Login
                </button>

                {/* Sign Up Link */}
                <div className="signup-prompt">
                  Not a member? <Link to="/signup">Register today</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /modern-login-layout */}
      </div>
    </>
  );
}