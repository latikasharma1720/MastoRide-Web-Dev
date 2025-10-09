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

  // If already logged in as admin, redirect to dashboard
  if (currentUser && currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");
    
    const emailLower = email.trim().toLowerCase();
    
    // Check if credentials are correct
    if (emailLower === "admin@mastoride.edu" && password === "Admin#123") {
      setUser({
        id: "admin1",
        name: "Administrator",
        email: emailLower,
        role: "admin",
      });
      navigate("/admin", { replace: true });
    } else {
      setErr("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="auth-stack">
          {/* Main Login Card */}
          <div className="card">
            <div className="card-head">
              <h2>Admin Login</h2>
              <p className="sub">Access administrator dashboard</p>
            </div>

            {err && (
              <div style={{ 
                padding: '12px', 
                background: '#ffebee', 
                color: '#b00020', 
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '16px'
              }}>
                {err}
              </div>
            )}

            <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="field">
                <label className="label">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mastoride.edu"
                  required
                />
              </div>

              <div className="field">
                <label className="label">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button className="btn-wide" type="submit">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}