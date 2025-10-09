// src/pages/user/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUser } from "../../utils/session";

// KPIs (demo data)
const KPI = [
  { id: "points",  label: "Reward Points", value: "250",   icon: "🎯" },
  { id: "rides",   label: "Total Rides",   value: "12",    icon: "🚗" },
  { id: "tier",    label: "Membership Tier", value: "Silver", icon: "⭐" },
  { id: "saved",   label: "Total Saved",   value: "$45.5", icon: "💰" },
];

export default function UserDashboard() {
  // ⚠️ All hooks are at the top — before any return/condition
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
  });

  // Load session once
  useEffect(() => {
    const u = getUser();
    setCurrentUser(u || null);
    setAuthChecked(true);
  }, []);

  // Keep profile in sync when currentUser arrives/changes
  useEffect(() => {
    if (!currentUser) return;
    setProfile({
      name: currentUser.name || "user1",
      studentId: currentUser.studentId || "PFW123456",
      email: currentUser.email || "user1@pfw.edu",
      phone: currentUser.phone || "",
    });
  }, [currentUser]);

  // Before session read finishes, render nothing
  if (!authChecked) return null;

  // Auth guard AFTER hooks are declared
  if (!currentUser || currentUser.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />

      <div className="simple-user">
        {/* HERO */}
        <section className="ud-hero">
          <h1>Welcome back, {profile.name || "user"}! 👋</h1>
          <p>Manage your account and view your ride history</p>
        </section>

        {/* KPIs */}
        <section className="ud-kpis">
          {KPI.map(k => (
            <article key={k.id} className="ud-kpi">
              <div className="ud-kpi-icon">{k.icon}</div>
              <div className="ud-kpi-value">{k.value}</div>
              <div className="ud-kpi-label">{k.label}</div>
            </article>
          ))}
        </section>

        {/* Tabs */}
        <div className="ud-toolbar">
          <div className="ud-tabs">
            {["profile","payment","rewards","history","support","settings"].map(id => (
              <button
                key={id}
                className={`ud-tab ${activeTab === id ? "is-active" : ""}`}
                onClick={() => setActiveTab(id)}
              >
                {id[0].toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Panels */}
        {activeTab === "profile" && (
          <section className="ud-panel ud-panel--max">
            <header className="ud-head">
              <h2>Account Details</h2>
              <p>Update your personal information</p>
            </header>

            <form
              className="ud-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Profile saved (demo)");
              }}
            >
              <label className="ud-field">
                <span>Full Name</span>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                />
              </label>

              <label className="ud-field">
                <span>Student ID</span>
                <input type="text" value={profile.studentId} readOnly />
                <small>Assigned by PFW</small>
              </label>

              <label className="ud-field">
                <span>Email Address</span>
                <input type="email" value={profile.email} readOnly />
              </label>

              <label className="ud-field">
                <span>Phone Number</span>
                <input
                  type="tel"
                  placeholder="(260) 555-0123"
                  value={profile.phone}
                  onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                />
              </label>

              <button className="btn wide" type="submit">Save Profile</button>
            </form>
          </section>
        )}

        {activeTab === "payment" && (
          <section className="ud-panel ud-panel--max">
            <header className="ud-head">
              <h2>Payment</h2>
              <p>Manage your saved methods and receipts</p>
            </header>

            <div className="ud-empty">
              <div className="ud-chip">💳</div>
              <p>No payment methods saved yet.</p>
              <button className="btn">Add Card</button>
            </div>
          </section>
        )}

       {activeTab === "rewards" && (
  <section className="ud-panel rewards-panel">
    <header>
      <h2>Rewards</h2>
      <p>Track points and redeem perks</p>
    </header>

    <div className="rewards-content">
      <div className="reward-points">🏅 250 Points</div>
      <div className="reward-message">Keep riding to reach Gold tier!</div>
      <button>Redeem</button>
    </div>
  </section>
)}
        {activeTab === "history" && (
  <section className="ud-panel ud-panel--max">
    <header className="ud-head">
      <h2>Ride History</h2>
      <p>Your recent campus and off-campus rides</p>
    </header>

    <ul className="ud-list">
      <li className="ud-list-item">
        <div className="ud-ride-info">
          <strong>09/22</strong> • Campus Center → <b>Jefferson Pointe Mall</b> <br />
          <span className="ud-destination">
            📍 Off-Campus Destination — Fort Wayne
          </span>
        </div>
        <div className="ud-ride-meta">
          <span className="ud-price">💵 $12.50</span>
          <span className="ud-pill">Completed</span>
        </div>
      </li>

      <li className="ud-list-item">
        <div className="ud-ride-info">
          <strong>09/19</strong> • Dorms → <b>Fort Wayne International Airport</b> <br />
          <span className="ud-destination">
            📍 Off-Campus Destination — Fort Wayne
          </span>
        </div>
        <div className="ud-ride-meta">
          <span className="ud-price">💵 $22.75</span>
          <span className="ud-pill">Completed</span>
        </div>
      </li>

      <li className="ud-list-item">
        <div className="ud-ride-info">
          <strong>09/16</strong> • Engineering Building → <b>Electric Works</b> <br />
          <span className="ud-destination">
            📍 Off-Campus Destination — Fort Wayne
          </span>
        </div>
        <div className="ud-ride-meta">
          <span className="ud-price">💵 $9.80</span>
          <span className="ud-pill">Completed</span>
        </div>
      </li>
    </ul>
  </section>
)}
        {activeTab === "support" && (
          <section className="ud-panel ud-panel--max">
            <header className="ud-head">
              <h2>Support</h2>
              <p>We’re here to help</p>
            </header>
            <div className="ud-empty">
              <div className="ud-chip">🛟</div>
              <p>Need assistance? Start a ticket or visit the Help Center.</p>
              <div className="ud-actions">
                <button className="btn">Open Ticket</button>
                <button className="btn ghost">Help Center</button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="ud-panel ud-panel--max">
            <header className="ud-head">
              <h2>Settings</h2>
              <p>Customize notifications & preferences</p>
            </header>

            <form className="ud-form" onSubmit={(e) => e.preventDefault()}>
              <div className="setting-item">
                <div>
                  <strong>Ride Alerts</strong>
                  <p>Receive notifications for ride updates</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <strong>Marketing Emails</strong>
                  <p>Get news and promotions</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span />
                </label>
              </div>

              <button className="btn wide" type="submit">Save Settings</button>
            </form>
          </section>
        )}
      </div>
    </>
  );
}
