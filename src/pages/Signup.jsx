// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../utils/session";
import { isPfwEmail, isStrongPassword } from "../utils/validation";
import Navbar from "../components/Navbar";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [errors, setErrors]             = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!isPfwEmail(email)) {
      errs.email = "Use your @pfw.edu email address.";
    }
    if (!isStrongPassword(password)) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      errs.confirm = "Passwords do not match.";
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setUser({
        id: "u" + Date.now(),
        name: email.split("@")[0],
        email: email.trim().toLowerCase(),
        role: "user",
      });

      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in to continue.",
        },
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* Same outer wrappers as Login */}
      <div className="modern-login-page">
        <div className="modern-login-container">
          <div className="modern-login-card">
            {/* Header (uses the same .login-header styles) */}
            <div className="login-header">
              <h1>Create your account</h1>
              <p>It’s quick and easy — exclusive to PFW students.</p>
            </div>

            {/* Form (same class names as Login) */}
            <form className="modern-login-form" onSubmit={handleSubmit}>
              {/* Email */}
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
                {!errors.email && (
                  <small className="hint">Use your @pfw.edu email address.</small>
                )}
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div className="modern-field">
                <label htmlFor="password">Create password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
                  className={errors.password ? "error" : ""}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="modern-field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={errors.confirm ? "error" : ""}
                />
                {errors.confirm && (
                  <span className="error-text">{errors.confirm}</span>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="modern-login-btn">
                Sign Up
              </button>

              {/* Fine print + switch link (styled like Login’s text) */}
              <p className="fineprint" style={{ textAlign: "center", marginTop: 12 }}>
                By clicking Sign Up, you agree to our Terms and acknowledge our Privacy Policy.
              </p>

              <div className="signup-prompt" style={{ textAlign: "center" }}>
                Already have an account? <Link to="/login">Log in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
