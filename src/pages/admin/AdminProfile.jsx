import React, { useEffect, useState } from "react";
import { getProfile as getAdminProfile, saveProfile as saveAdminProfile } from "../../utils/mockApi";

export default function AdminProfile() {
  const [admin, setAdmin] = useState({ name: "", email: "", phone: "", role: "Administrator" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try { setAdmin(await getAdminProfile()); }
      catch { setMsg("Failed to load admin profile."); }
    })();
  }, []);

  const onChange = (e) => setAdmin({ ...admin, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    try { await saveAdminProfile(admin); setMsg("Saved!"); }
    catch { setMsg("Save failed."); }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 640 }}>
      <h2>Admin Profile</h2>
      {msg && <p>{msg}</p>}
      <form className="stack" onSubmit={onSave}>
        <label>Full Name <input name="name" value={admin.name} onChange={onChange} /></label>
        <label>Email <input name="email" value={admin.email} readOnly /></label>
        <label>Phone <input name="phone" value={admin.phone} onChange={onChange} /></label>
        <label>Role <input name="role" value={admin.role} readOnly /></label>
        <button className="btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
}
