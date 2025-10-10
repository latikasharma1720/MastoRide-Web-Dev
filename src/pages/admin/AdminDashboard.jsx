// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUser } from "../../utils/session";
import { useToast } from "../../components/ui-kit";
import { getProfile, saveProfile, getSettings, saveSettings } from "../../utils/data";

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

// Reusable Tab Button (consistent sizing)
function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 160,
        height: 44,
        appearance: "none",
        border: 0,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 14,
        borderRadius: 9999,
        background: active
          ? "linear-gradient(180deg, #F7D990 0%, #E7BE66 100%)"
          : "#ffffff",
        color: "#111",
        boxShadow: "0 8px 18px rgba(0,0,0,.12)",
        outline: "none",
        transition: "background .2s ease, box-shadow .2s ease",
      }}
    >
      {children}
    </button>
  );
}

export default function AdminDashboard() {
  const { pushToast } = useToast();
  const [user] = useState(() => getUser());
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("Administrator");

  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "admin@mastoride.edu",
    phone: "",
  });

  const [settings, setSettings] = useState({ email: true, sms: false });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const adminId = (user && user.id) || "admin-demo";
  const uName = user?.name;
  const uEmail = user?.email;
  const uPhone = user?.phone;

  useEffect(() => {
    const stored = getProfile(adminId);
    const nextProfile = {
      name: stored.name || uName || "Administrator",
      email: stored.email || uEmail || "admin@mastoride.edu",
      phone: stored.phone || uPhone || "",
    };
    setProfile(nextProfile);
    setDisplayName(nextProfile.name);

    const s = getSettings(adminId) || {};
    setSettings({
      email: s.email ?? true,
      sms: s.sms ?? false,
    });
  }, [adminId, uName, uEmail, uPhone]);

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  function onProfileChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  async function onSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (!/\S+@\S+\.\S+/.test(profile.email)) {
        pushToast("Please enter a valid email.", "error");
        return;
      }
      saveProfile(adminId, profile);
      setDisplayName(profile.name);
      pushToast("Admin profile saved!", "success");
    } catch {
      pushToast("Could not save admin profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  function onToggleSetting(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  async function onSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      saveSettings(adminId, settings);
      pushToast("Admin settings saved!", "success");
    } catch {
      pushToast("Could not save admin settings.", "error");
    } finally {
      setSavingSettings(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="simple-admin">
        {/* Welcome Section */}
        <section className="sa-hero">
          <h1>Welcome, {displayName} 👋</h1>
          <p>Monitor performance and manage operations efficiently</p>
        </section>

        {/* KPI Section */}
        <section className="sa-kpis">
          {KPI.map((k) => (
            <article key={k.id} className="sa-kpi">
              <div className="sa-kpi-icon">{k.icon}</div>
              <div className="sa-kpi-value">{k.value}</div>
              <div className="sa-kpi-label">{k.label}</div>
            </article>
          ))}
        </section>

        {/* Tabs */}
        <div className="sa-toolbar" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div className="sa-tabs" style={{ display: "flex", gap: 12 }}>
            <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
              Admin Profile
            </TabButton>
            <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
              Settings
            </TabButton>
            <TabButton active={activeTab === "feedback"} onClick={() => setActiveTab("feedback")}>
              Feedback
            </TabButton>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
  <section
    className="sa-panel"
    style={{
      maxWidth: 700,             
      margin: "0 auto",          
      background: "#fff",         
      borderRadius: 16,           
      boxShadow: "0 8px 24px rgba(0,0,0,.1)",  
      padding: 24,                
    }}
  >
          <header className="sa-head" style={{ marginBottom: 16 }}>
              <h2>Admin Profile</h2>
            </header>

            <form className="sa-form" onSubmit={onSaveProfile}>
              <label className="sa-field">
                <span>Full Name</span>
                <input
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={onProfileChange}
                />
              </label>

              <label className="sa-field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={onProfileChange}
                />
              </label>

              <label className="sa-field">
                <span>Phone</span>
                <input
                  name="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={onProfileChange}
                  placeholder="(260) 555-0123"
                />
              </label>

              <button
                className="btn wide"
                type="submit"
                disabled={savingProfile}
                style={{ marginTop: 8 }}
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </section>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <section
            className="sa-panel"
            style={{
              maxWidth: 450,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
              padding: 24,
            }}
          >
            <header className="sa-head" style={{ marginBottom: 16 }}>
              <h2>Settings</h2>
            </header>

            <form className="settings-form" onSubmit={onSaveSettings}>
              <div className="setting-item" style={{ marginBottom: 12 }}>
                <div>
                  <strong>Email Notifications</strong>
                  <p>Receive email alerts for important admin events</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={() => onToggleSetting("email")}
                  />
                  <span />
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <strong>SMS Alerts</strong>
                  <p>Get SMS for critical updates</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={settings.sms}
                    onChange={() => onToggleSetting("sms")}
                  />
                  <span />
                </label>
              </div>

              <button
                className="btn wide"
                type="submit"
                disabled={savingSettings}
                style={{ marginTop: 12 }}
              >
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            </form>
          </section>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <section
            className="sa-panel"
            style={{
              maxWidth: 360,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
              padding: 24,
            }}
          >
            <header className="sa-head" style={{ marginBottom: 16 }}>
              <h2>Feedback</h2>
            </header>
            <ul className="sa-list">
              {FEEDBACK.map((f) => (
                <li key={f.id} className="sa-list-item" style={{ marginBottom: 12 }}>
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
