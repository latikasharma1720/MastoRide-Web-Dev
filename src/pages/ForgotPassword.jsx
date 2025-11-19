import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: hook your real reset endpoint here
    setMsg(`If an account exists for ${email}, a reset link was sent.`);
  };

  return (
    <>
      <Navbar />

      {/* === Pull-in Scene (image "pulls" the form from left) === */}
      <main className="signup-pull-scene">
        {/* Car / Illustration (LEADS) */}
        <div className="pull-vehicle">
          <img
            src="/assets/images/ForgotPassword.png"
            alt="Forgot Password illustration"
            className="pull-vehicle-img"
          />
        </div>

        {/* Form (FOLLOWS slightly after) */}
        <section className="pull-form">
          {/* Success Message */}
          {msg && (
            <div className="success-message-banner">
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
              {msg}
            </div>
          )}

          <h1>Reset Password</h1>
          <p className="pull-sub">
            Enter your PFW email to receive a reset link.
          </p>

          <form className="pull-form-inner" onSubmit={onSubmit} autoComplete="off">
            <div className="sg-field">
              <label htmlFor="email">PFW Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pfw.edu"
                required
              />
            </div>

            <button type="submit" className="signup-cta">
              Send reset link
            </button>
          </form>

          <p className="signup-login">
            Remember your password? <Link to="/login">Back to login</Link>
          </p>
        </section>
      </main>
    </>
  );
}