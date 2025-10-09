import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUser } from "../../utils/session";

// --- demo data ---
const KPI = [
  { id: "users", label: "Total Users", value: "1,247", icon: "👥" },
  { id: "rides", label: "Total Rides", value: "3,856", icon: "🚗" },
  { id: "drivers", label: "Active Drivers", value: "42", icon: "👮‍♂️" },
  { id: "revenue", label: "Total Revenue", value: "$18,450.75", icon: "💰" },
];

const FEEDBACK = [
  { id: 1, user: "John Doe", rating: 5, text: "Excellent service!" },
  { id: 2, user: "Sarah Smith", rating: 4, text: "Good, but wait time was long." },
];

export default function AdminDashboard() {
  const [user] = useState(() => getUser());
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: user?.name || "Administrator",
    email: user?.email || "admin@mastoride.edu",
    phone: user?.phone || "",
  });

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <>
      <Navbar />

      <div className="simple-admin">
        {/* Welcome */}
        <section className="sa-hero">
          <h1>Welcome, Admin 👋</h1>
          <p>Monitor performance and manage operations efficiently</p>
        </section>

        {/* KPIs */}
        <section className="sa-kpis">
          {KPI.map((k) => (
            <article key={k.id} className="sa-kpi">
              <div className="sa-kpi-icon">{k.icon}</div>
              <div className="sa-kpi-value">{k.value}</div>
              <div className="sa-kpi-label">{k.label}</div>
            </article>
          ))}
        </section>

        {/* Right-Aligned Tabs */}
        <div className="sa-toolbar">
          <div className="sa-tabs sa-tabs--right">
            <button
              className={`sa-tab ${activeTab === "profile" ? "is-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Admin Profile
            </button>
            <button
              className={`sa-tab ${activeTab === "settings" ? "is-active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
            <button
              className={`sa-tab ${activeTab === "feedback" ? "is-active" : ""}`}
              onClick={() => setActiveTab("feedback")}
            >
              Feedback
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <section className="sa-panel sa-panel--max">
            <header className="sa-head">
              <h2>Admin Profile</h2>
            </header>
            <form
              className="sa-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Profile saved (demo).");
              }}
            >
              <label className="sa-field">
                <span>Full Name</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
              </label>

              <label className="sa-field">
                <span>Email</span>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                />
              </label>

              <label className="sa-field">
                <span>Phone</span>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="(260) 555-0123"
                />
              </label>

              <button className="btn wide" type="submit">
                Save Profile
              </button>
            </form>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="sa-panel sa-panel--max">
            <header className="sa-head">
              <h2>Settings</h2>
            </header>

            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="setting-item">
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive email alerts for important admin events</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <strong>SMS Alerts</strong>
                  <p>Get SMS for critical updates</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span />
                </label>
              </div>

              <button className="btn wide" type="submit">
                Save Settings
              </button>
            </form>
          </section>
        )}

        {activeTab === "feedback" && (
          <section className="sa-panel sa-panel--max">
            <header className="sa-head">
              <h2>Feedback</h2>
            </header>
            <ul className="sa-list">
              {FEEDBACK.map((f) => (
                <li key={f.id} className="sa-list-item">
                  <div className="sa-chip">{"⭐".repeat(f.rating)}</div>
                  <div className="sa-user">
                    <strong>{f.user}</strong>
                    <span>{f.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
