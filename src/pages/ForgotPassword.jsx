import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: hook your real reset endpoint here
    setMsg(`If an account exists for ${email}, a reset link was sent.`);
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 420 }}>
      <h2 className="welcome">Reset password</h2>

      {msg && <p className="lead" style={{ marginTop: 6 }}>{msg}</p>}

      <form className="stack" onSubmit={onSubmit}>
        <label>
          Enter your PFW email
          <input
            type="email"
            placeholder="name@pfw.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <button className="btn" type="submit">Send reset link</button>
      </form>
    </div>
  );
}
