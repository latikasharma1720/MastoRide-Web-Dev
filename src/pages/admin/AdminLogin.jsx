// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { setUser, getUser } from "../../utils/session";
import Navbar from "../../components/Navbar";

export default function AdminLogin() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // Already logged in as admin? -> go to dashboard
  if (currentUser && currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const emailLower = email.trim().toLowerCase();

    // Demo credentials — change later when you wire a real backend
    if (emailLower === "admin@mastoride.edu" && password === "Admin#123") {
      setUser({
        id: "admin1",
        name: "Administrator",
        email: emailLower,
        role: "admin",
      });
      navigate("/admin", { replace: true });
    } else {
      setErr("Invalid email or password.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Match the same wrapper used by Login/Signup */}
      <div className="modern-login-page">
        <div className="modern-login-container">
          {/* Card */}
          <div className="modern-login-card">
            {/* Header (same look/spacing as other forms) */}
            <div className="login-header">
              <h1>Admin Login</h1>
              <p>Access the administrator dashboard.</p>
            </div>

            {/* Inline error banner to match the success banner styling */}
            {err && (
              <div
                style={{
                  marginTop: 12,
                  padding: "12px 14px",
                  background: "#ffebee",
                  color: "#b00020",
                  border: "1px solid #ffcdd2",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {err}
              </div>
            )}

            {/* Form (same classnames as Login for consistent styling) */}
            <form className="modern-login-form" onSubmit={handleSubmit}>
              <div className="modern-field">
                <label htmlFor="admin-email">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mastoride.edu"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="modern-field">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="modern-login-btn">
                Log in
              </button>

              {/* Tiny footnote to mirror spacing of other pages (optional) */}
              <div className="signup-prompt" style={{ opacity: 0.8 }}>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
