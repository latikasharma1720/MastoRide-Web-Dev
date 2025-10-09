import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { setUser } from "../utils/session";
import Navbar from "../components/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      <div className="page-container">
        <div className="auth-stack">
          {successMsg && (
            <div
              style={{
                padding: "16px 20px",
                background: "#e8f5e9",
                color: "#2e7d32",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                textAlign: "center",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
            <div className="card-head">
              <h2>Log in</h2>
              <p className="sub">Welcome back — sign in to continue.</p>
            </div>

            <form
              className="form-grid"
              onSubmit={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              <div className="field">
                <label className="label">PFW email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pfw.edu"
                  required
                />
                {errors.email && (
                  <div
                    style={{
                      color: "#b00020",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="field">
                <label className="label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
                {errors.password && (
                  <div
                    style={{
                      color: "#b00020",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.password}
                  </div>
                )}
              </div>

              <button className="btn-wide" type="submit">
                Log in
              </button>

              <div
                className="links-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                  marginTop: "12px",
                }}
              >
                <Link to="/forgot-password">Forgot password?</Link>
                <Link to="/signup">Create an account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
