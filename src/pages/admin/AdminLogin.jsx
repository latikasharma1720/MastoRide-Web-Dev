import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginAdmin, isAdminLoggedIn } from "../../utils/adminAuth";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  if (isAdminLoggedIn()) return <Navigate to="/admin" replace />;

  const submit = (e) => {
    e.preventDefault();
    const res = loginAdmin(email.trim(), pass);
    if (res.ok) nav("/admin", { replace: true });
    else setErr(res.error || "Login failed");
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 420 }}>
      <h2>Admin Login</h2>
      {err && <p style={{ color: "#b00020" }}>{err}</p>}
      <form className="stack" onSubmit={submit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        </label>
        <button className="btn" type="submit">Log in</button>
      </form>
      <p style={{ marginTop: 8, opacity: .75 }}>
        Demo: admin@mastoride.edu / Admin#123
      </p>
    </div>
  );
}
