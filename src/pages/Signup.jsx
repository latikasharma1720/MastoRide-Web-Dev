import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../utils/session";
import { isPfwEmail, isStrongPassword } from "../utils/validation";
import Navbar from "../components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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
      <div className="page-container">
        <div className="auth-stack">
          <div className="card">
            <div className="card-head">
              <h2>Create a new account</h2>
              <p className="sub">It's quick and easy.</p>
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
                {!errors.email && (
                  <p className="hint">Use your @pfw.edu email address.</p>
                )}
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
                <label className="label">Create password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ characters"
                  minLength={8}
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

              <div className="field">
                <label className="label">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  minLength={8}
                  required
                />
                {errors.confirm && (
                  <div
                    style={{
                      color: "#b00020",
                      fontSize: "13px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.confirm}
                  </div>
                )}
              </div>

              <button className="btn-wide" type="submit">
                Sign Up
              </button>

              <p className="fineprint">
                By clicking Sign Up, you agree to our Terms and acknowledge our
                Privacy Policy.
              </p>

              <p className="switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
