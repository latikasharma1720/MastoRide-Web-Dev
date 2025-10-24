// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUser } from "../../utils/session";
import { useToast } from "../../components/ui-kit";
import { getProfile, saveProfile, getSettings, saveSettings } from "../../utils/data";

const NAV_ITEMS = [
  { id: "feedback", label: "Feedback", icon: "💬" },
  { id: "users", label: "Users", icon: "👥" },
  { id: "rides", label: "Rides", icon: "🚗" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const LS_KEYS = {
  tab: "admin_active_tab",
  sidebar: "admin_sidebar_open",
};

const STATS = [
  { id: "users", label: "Total Users", value: "1,247", icon: "👥", trend: "+12%" },
  { id: "rides", label: "Total Rides", value: "3,856", icon: "🚗", trend: "+23%" },
  { id: "drivers", label: "Active Drivers", value: "42", icon: "👨‍✈️", trend: "+5%" },
  { id: "revenue", label: "Revenue", value: "$18,450", icon: "💰", trend: "+18%" },
];

const RECENT_USERS = [
  { id: 1, name: "John Doe", email: "john@pfw.edu", joined: "Oct 20, 2025", status: "Active" },
  { id: 2, name: "Sarah Smith", email: "sarah@pfw.edu", joined: "Oct 18, 2025", status: "Active" },
  { id: 3, name: "Mike Johnson", email: "mike@pfw.edu", joined: "Oct 15, 2025", status: "Inactive" },
  { id: 4, name: "Emily Davis", email: "emily@pfw.edu", joined: "Oct 12, 2025", status: "Active" },
];

const RECENT_RIDES = [
  { id: 1, user: "John Doe", pickup: "Campus Center", dropoff: "Jefferson Pointe", fare: "$12.50", date: "Oct 22", status: "Completed" },
  { id: 2, user: "Sarah Smith", pickup: "Dorms", dropoff: "Airport", fare: "$22.75", date: "Oct 21", status: "Completed" },
  { id: 3, user: "Mike Johnson", pickup: "Library", dropoff: "Union", fare: "$5.00", date: "Oct 20", status: "Completed" },
  { id: 4, user: "Emily Davis", pickup: "Engineering", dropoff: "Mall", fare: "$18.50", date: "Oct 19", status: "Cancelled" },
];

// Monthly ride data for line chart
const MONTHLY_RIDE_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  data: [245, 198, 312, 289, 401, 456, 523, 489, 612, 578, 445, 398],
};

// Ride type distribution for pie chart
const RIDE_TYPE_DATA = {
  labels: ['Economy', 'Premium', 'XL', 'Shared'],
  data: [45, 25, 15, 15],
  colors: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
};

// Line Chart (Chart.js via CDN)
function LineChart({ data, labels, title }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');

    const make = () => {
      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: title,
            data,
            borderColor: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#000000',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#333333',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: {
              display: true, position: 'top',
              labels: { font: { size: 14, weight: '600' }, color: '#333', padding: 15, usePointStyle: true }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleColor: '#fff', bodyColor: '#fff',
              borderColor: '#000000', borderWidth: 1, padding: 12, displayColors: false,
              callbacks: { label: (ctx) => `${ctx.parsed.y} rides` }
            }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: '#000000' }, ticks: { font: { size: 12 }, color: '#000000' } },
            x: { grid: { display: false }, ticks: { font: { size: 12 }, color: '#000000' } }
          }
        }
      });
    };

    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
      s.onload = make;
      document.head.appendChild(s);
    } else {
      make();
    }

    return () => chartInstance.current?.destroy();
  }, [data, labels, title]);

  return <canvas ref={chartRef} />;
}

// Pie Chart
function PieChart({ data, labels, colors, title }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');

    const make = () => {
      chartInstance.current = new window.Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#fff', borderWidth: 3, hoverOffset: 15 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true, position: 'bottom',
              labels: { font: { size: 14, weight: '600' }, color: '#333', padding: 15, usePointStyle: true }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleColor: '#fff', bodyColor: '#fff',
              borderColor: '#E7BE66', borderWidth: 1, padding: 12,
              callbacks: {
                label: (ctx) => {
                  const label = ctx.label || '';
                  const value = ctx.parsed || 0;
                  const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((value / total) * 100).toFixed(1);
                  return `${label}: ${pct}% (${value} rides)`;
                }
              }
            }
          }
        }
      });
    };

    if (!window.Chart) {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js';
      s.onload = make;
      document.head.appendChild(s);
    } else {
      make();
    }

    return () => chartInstance.current?.destroy();
  }, [data, labels, colors, title]);

  return <canvas ref={chartRef} />;
}

export default function AdminDashboard() {
  const { pushToast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(LS_KEYS.tab) || "feedback");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.sidebar);
    return raw == null ? true : raw === "true";
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState("account");

  const [profile, setProfile] = useState({
    name: "Administrator",
    email: "admin@mastoride.edu",
    phone: "",
    department: "Administration",
    role: "System Admin",
    employeeId: "",
    officeLocation: "",
    joinDate: "",
    title: "",
    supervisor: "",
    emergencyContact: "",
    emergencyPhone: "",
    address: "",
    bio: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    systemAlerts: true,
    maintenanceMode: false,
  });

  const [savingSettings, setSavingSettings] = useState(false);

  // Auth check
  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "admin") {
      setAuthChecked(true);
      return;
    }
    setCurrentUser(u);
    setAuthChecked(true);
  }, []);

  // Load profile/settings
  useEffect(() => {
    if (!currentUser) return;
    const adminId = currentUser.id || "admin-demo";
    const stored = getProfile(adminId) || {};
    const nextProfile = {
      name: stored.name || currentUser.name || "Administrator",
      email: stored.email || currentUser.email || "admin@mastoride.edu",
      phone: stored.phone || currentUser.phone || "",
      department: stored.department || "Administration",
      role: stored.role || "System Admin",
      employeeId: stored.employeeId || "",
      officeLocation: stored.officeLocation || "",
      joinDate: stored.joinDate || "",
      title: stored.title || "",
      supervisor: stored.supervisor || "",
      emergencyContact: stored.emergencyContact || "",
      emergencyPhone: stored.emergencyPhone || "",
      address: stored.address || "",
      bio: stored.bio || "",
    };
    setProfile(nextProfile);

    const s = getSettings(adminId) || {};
    setSettings({
      emailNotifications: s.emailNotifications ?? true,
      smsAlerts: s.smsAlerts ?? false,
      systemAlerts: s.systemAlerts ?? true,
      maintenanceMode: s.maintenanceMode ?? false,
    });
  }, [currentUser]);

  // Persist UI state
  useEffect(() => { localStorage.setItem(LS_KEYS.tab, activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem(LS_KEYS.sidebar, String(sidebarOpen)); }, [sidebarOpen]);

  if (!authChecked) return null;
  if (!currentUser || currentUser.role !== "admin") return <Navigate to="/admin/login" replace />;

  function onProfileChange(e) {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  }

  function onSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (!/\S+@\S+\.\S+/.test(profile.email)) {
        pushToast("Please enter a valid email.", "error");
        return;
      }
      const adminId = currentUser.id || "admin-demo";
      saveProfile(adminId, profile);
      pushToast("Admin profile saved!", "success");
      setIsEditing(false);
    } catch {
      pushToast("Could not save admin profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  function onToggleSetting(key) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function onSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const adminId = currentUser.id || "admin-demo";
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
      <div className="navbar-fix">
        <Navbar />
      </div>

      <div className={`ud ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="dashboard-layout">
          <aside className="sidebar-nav" aria-label="Section navigation">
            <button
              className="sidebar-toggle fancy"
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-expanded={sidebarOpen}
            >
              <span className="hamburger">
                <span className="line top" />
                <span className="line middle" />
                <span className="line bottom" />
              </span>
            </button>
            <nav className="sidebar-tabs">
              {NAV_ITEMS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  className={`sidebar-btn ${activeTab === id ? "active" : ""}`}
                  onClick={() => setActiveTab(id)}
                  data-tip={label}
                  aria-label={label}
                >
                  <span className="sb-icon" aria-hidden="true">{icon}</span>
                  <span className="sb-label">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-content-wrapper">
              {/* OVERVIEW */}
              {activeTab === "feedback" && (
                <div className="feedback-layout">
                  <section className="ud-hero">
                    <h1>User Feedback 💬</h1>
                    <p>View and manage customer reviews and feedback</p>
                  </section>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-details">
                        <div className="stat-value">4.8</div>
                        <div className="stat-label">Average Rating</div>
                        <div className="stat-trend">+0.3</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">💬</div>
                      <div className="stat-details">
                        <div className="stat-value">342</div>
                        <div className="stat-label">Total Feedback</div>
                        <div className="stat-trend">+28</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">✅</div>
                      <div className="stat-details">
                        <div className="stat-value">89%</div>
                        <div className="stat-label">Positive Reviews</div>
                        <div className="stat-trend">+5%</div>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⏱️</div>
                      <div className="stat-details">
                        <div className="stat-value">24</div>
                        <div className="stat-label">Pending Reviews</div>
                        <div className="stat-trend">-6</div>
                      </div>
                    </div>
                  </div>

                  <section className="ud-panel">
                    <header className="ud-head">
                      <h2>Recent Feedback</h2>
                      <p>Latest customer reviews</p>
                    </header>
                    <div className="activity-list">
                      <div className="activity-item">
                        <span className="activity-icon">⭐⭐⭐⭐⭐</span>
                        <div className="activity-content">
                          <strong>Excellent Service</strong>
                          <p>Great driver, smooth ride! - Sarah Johnson</p>
                        </div>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-icon">⭐⭐⭐⭐</span>
                        <div className="activity-content">
                          <strong>Good Experience</strong>
                          <p>Easy to use app, would like more payment options - Mike Chen</p>
                        </div>
                        <span className="activity-time">5 hours ago</span>
                      </div>
                      <div className="activity-item">
                        <span className="activity-icon">⭐⭐</span>
                        <div className="activity-content">
                          <strong>Needs Improvement</strong>
                          <p>Wait time was longer than expected - Emily Rodriguez</p>
                        </div>
                        <span className="activity-time">1 day ago</span>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <div className="users-layout">
                  <section className="ud-hero">
                    <h1>User Management 👥</h1>
                    <p>View and manage all registered users</p>
                  </section>

                  <section className="ud-panel">
                    <header className="ud-head">
                      <h2>Recent Users</h2>
                      <button className="btn ghost">Export CSV</button>
                    </header>
                    <div className="data-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RECENT_USERS.map((user) => (
                            <tr key={user.id}>
                              <td><strong>{user.name}</strong></td>
                              <td>{user.email}</td>
                              <td>{user.joined}</td>
                              <td>
                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td>
                                <button className="btn-icon" title="View Details">👁️</button>
                                <button className="btn-icon" title="Edit">✏️</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {/* RIDES */}
              {activeTab === "rides" && (
                <div className="rides-layout">
                  <section className="ud-hero">
                    <h1>Ride Management 🚗</h1>
                    <p>Track and manage all ride bookings</p>
                  </section>

                  <section className="ud-panel">
                    <header className="ud-head">
                      <h2>Recent Rides</h2>
                      <button className="btn ghost">Filter</button>
                    </header>
                    <div className="data-table">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Pickup</th>
                            <th>Dropoff</th>
                            <th>Fare</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RECENT_RIDES.map((ride) => (
                            <tr key={ride.id}>
                              <td><strong>{ride.user}</strong></td>
                              <td>{ride.pickup}</td>
                              <td>{ride.dropoff}</td>
                              <td><strong>{ride.fare}</strong></td>
                              <td>{ride.date}</td>
                              <td>
                                <span className={`status-badge ${ride.status.toLowerCase()}`}>
                                  {ride.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {/* ANALYTICS */}
              {activeTab === "analytics" && (
                <div className="analytics-layout">
                  <section className="ud-hero">
                  </section>

                  <div className="analytics-grid">
                    <section className="ud-panel chart-panel">
                      <header className="ud-head">
                        <h2>Monthly Ride Bookings</h2>
                      </header>
                      <div className="chart-container">
                        <LineChart
                          data={MONTHLY_RIDE_DATA.data}
                          labels={MONTHLY_RIDE_DATA.labels}
                          title="Monthly Rides"
                        />
                      </div>
                    </section>

                    <section className="ud-panel chart-panel">
                      <header className="ud-head">
                        <h2>Ride Type Distribution</h2>
                      </header>
                      <div className="chart-container pie">
                        <PieChart
                          data={RIDE_TYPE_DATA.data}
                          labels={RIDE_TYPE_DATA.labels}
                          colors={RIDE_TYPE_DATA.colors}
                          title="Ride Types"
                        />
                      </div>
                    </section>
                  </div>

                  {/* (User Feedback section previously removed) */}
                </div>
              )}

              {/* PROFILE */}
              {activeTab === "profile" && (
                <div className="clean-profile-layout">
                  <div className="profile-main-card profile-wide">
                    <div className="profile-hero">
                      <div className="profile-hero-left">
                        <div className="profile-avatar-large">
                          <span className="avatar-circle-large">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                          </span>
                        </div>
                        <div className="profile-hero-info">
                          <h2>{profile.name || "Administrator"}</h2>
                          <p>{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-tabs">
                      {["account", "settings", "security"].map((k) => (
                        <button
                          key={k}
                          className={`profile-tab-btn ${profileSubTab === k ? "active" : ""}`}
                          onClick={() => setProfileSubTab(k)}
                          type="button"
                        >
                          {k === "account" ? "Account" : k === "settings" ? "Settings" : "Security"}
                        </button>
                      ))}
                    </div>

                    {profileSubTab === "account" && (
                      <section className="profile-section">
                        <form className="clean-profile-form" onSubmit={onSaveProfile}>
                          <div className="profile-group">
                            <div className="group-title">Basic Information</div>
                            <div className="grid-two">
                              <label className="clean-field">
                                <span>Full Name</span>
                                <input
                                  name="name"
                                  type="text"
                                  placeholder="Administrator Name"
                                  value={profile.name}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                              <label className="clean-field">
                                <span>Employee ID</span>
                                <input
                                  name="employeeId"
                                  type="text"
                                  placeholder="EMP-001"
                                  value={profile.employeeId}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                            </div>

                            <div className="grid-two">
                              <label className="clean-field">
                                <span>Email</span>
                                <input
                                  name="email"
                                  type="email"
                                  placeholder="admin@mastoride.edu"
                                  value={profile.email}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                              <label className="clean-field">
                                <span>Phone</span>
                                <input
                                  name="phone"
                                  type="tel"
                                  placeholder="(260) 555-0123"
                                  value={profile.phone}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                            </div>

                            <label className="clean-field">
                              <span>Address</span>
                              <input
                                name="address"
                                type="text"
                                placeholder="123 Main Street, Fort Wayne, IN 46805"
                                value={profile.address}
                                onChange={onProfileChange}
                                disabled={!isEditing}
                              />
                            </label>
                          </div>

                          <div className="profile-group">
                            <div className="group-title">Professional Details</div>
                            <div className="grid-two">
                              <label className="clean-field">
                                <span>Job Title</span>
                                <input
                                  name="title"
                                  type="text"
                                  placeholder="Senior System Administrator"
                                  value={profile.title}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                              <label className="clean-field">
                                <span>Role</span>
                                <input
                                  name="role"
                                  type="text"
                                  placeholder="System Admin"
                                  value={profile.role}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                            </div>

                            <div className="grid-two">
                              <label className="clean-field">
                                <span>Department</span>
                                <input
                                  name="department"
                                  type="text"
                                  placeholder="Administration"
                                  value={profile.department}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                              <label className="clean-field">
                                <span>Office Location</span>
                                <input
                                  name="officeLocation"
                                  type="text"
                                  placeholder="Building A, Room 101"
                                  value={profile.officeLocation}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                            </div>

                            <div className="grid-two">
                              <label className="clean-field">
                                <span>Supervisor</span>
                                <input
                                  name="supervisor"
                                  type="text"
                                  placeholder="Director Name"
                                  value={profile.supervisor}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                              <label className="clean-field">
                                <span>Join Date</span>
                                <input
                                  name="joinDate"
                                  type="date"
                                  value={profile.joinDate}
                                  onChange={onProfileChange}
                                  disabled={!isEditing}
                                />
                              </label>
                            </div>
                          </div>

                          
                          <div className="profile-group">
                            <div className="group-title">About</div>
                            <label className="clean-field">
                              <span>Bio / Notes</span>
                              <textarea
                                name="bio"
                                rows="4"
                                placeholder="Brief description or notes..."
                                value={profile.bio}
                                onChange={onProfileChange}
                                disabled={!isEditing}
                                style={{
                                  width: '100%',
                                  padding: '12px 14px',
                                  border: '1px solid #dedede',
                                  borderRadius: '12px',
                                  fontSize: '14px',
                                  fontFamily: 'inherit',
                                  resize: 'vertical',
                                  outline: 'none'
                                }}
                              />
                            </label>
                          </div>

                          <div className="profile-actions">
                            {!isEditing ? (
                              <button className="btn" type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                              </button>
                            ) : (
                              <>
                                <button className="btn" type="submit" disabled={savingProfile}>
                                  {savingProfile ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                  className="btn ghost"
                                  type="button"
                                  onClick={() => setIsEditing(false)}
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </form>
                      </section>
                    )}

                    {profileSubTab === "settings" && (
                      <section className="profile-section">
                        <header className="ud-head">
                        </header>
                        <form className="ud-form" onSubmit={onSaveSettings}>
                          <div className="setting-item">
                            <div>
                              <strong>Email Notifications</strong>
                              <p>Receive email alerts for admin events</p>
                            </div>
                            <label className="toggle">
                              <input
                                type="checkbox"
                                checked={settings.emailNotifications}
                                onChange={() => onToggleSetting("emailNotifications")}
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
                                checked={settings.smsAlerts}
                                onChange={() => onToggleSetting("smsAlerts")}
                              />
                              <span />
                            </label>
                          </div>
                          <div className="setting-item">
                            <div>
                              <strong>System Alerts</strong>
                              <p>Receive alerts for system issues</p>
                            </div>
                            <label className="toggle">
                              <input
                                type="checkbox"
                                checked={settings.systemAlerts}
                                onChange={() => onToggleSetting("systemAlerts")}
                              />
                              <span />
                            </label>
                          </div>
                          <div className="setting-item">
                            <div>
                              <strong>Maintenance Mode</strong>
                              <p>Enable maintenance mode for the platform</p>
                            </div>
                            <label className="toggle">
                              <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={() => onToggleSetting("maintenanceMode")}
                              />
                              <span />
                            </label>
                          </div>
                          <button className="btn wide" type="submit" disabled={savingSettings}>
                            {savingSettings ? "Saving..." : "Save Settings"}
                          </button>
                        </form>
                      </section>
                    )}

                    {profileSubTab === "security" && (
                      <section className="profile-section">
                        <header className="ud-head">
                          <h2>Security</h2>
                          <p>Manage security and access control</p>
                        </header>
                        <div className="security-section">
                          <div className="security-item">
                            <div className="security-icon">🔐</div>
                            <div className="security-content">
                              <h3>Change Password</h3>
                              <p>Update your admin password</p>
                              <button className="btn ghost">Change Password</button>
                            </div>
                          </div>
                          <div className="security-item">
                            <div className="security-icon">🛡️</div>
                            <div className="security-content">
                              <h3>Two-Factor Authentication</h3>
                              <p>Add an extra layer of security</p>
                              <button className="btn ghost">Enable 2FA</button>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}