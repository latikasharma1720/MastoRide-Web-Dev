import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Plain JS object (no TS types in .jsx files)
    const errs = {};
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email.";
    if (!password || password.length < 8) errs.password = "Minimum 8 characters.";
    if (password !== confirm) errs.confirm = "Passwords do not match.";

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      navigate("/login", {
        state: { message: "Account created! Please log in." },
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* === Pull-in Scene (image “pulls” the form from left) === */}
      <main className="signup-pull-scene">
        {/* Car / Illustration (LEADS) */}
        <div className="pull-vehicle">
          <img
            src="/assets/images/Signup Graphic.png"
            alt="Signup taxi bringing the form"
            className="pull-vehicle-img"
          />
        </div>

        {/* Form (FOLLOWS slightly after) */}
        <section className="pull-form">
          <h1>Create your account</h1>
          <p className="pull-sub">It’s quick and easy — exclusive to PFW students.</p>

          <form className="pull-form-inner" onSubmit={handleSubmit} autoComplete="off">
            <div className="sg-field">
              <label>PFW Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pfw.edu"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="sg-error">{errors.email}</span>}
            </div>

            <div className="sg-field">
              <label>Create password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="sg-error">{errors.password}</span>}
            </div>

            <div className="sg-field">
              <label>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                className={errors.confirm ? "error" : ""}
              />
              {errors.confirm && <span className="sg-error">{errors.confirm}</span>}
            </div>

            <button type="submit" className="signup-cta">Sign Up</button>
          </form>

          <p className="signup-login">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </main>
    </>
  );
}
