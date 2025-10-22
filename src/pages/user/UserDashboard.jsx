// src/pages/user/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getUser } from "../../utils/session";
import { useToast } from "../../components/ui-kit";
import { getProfile, saveProfile, getSettings, saveSettings } from "../../utils/data";
import MapBlock from "../../components/MapBlock";

const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "book", label: "Book Ride", icon: "🚗" },
  { id: "payment", label: "Payment", icon: "💳" },
  { id: "rewards", label: "Rewards", icon: "🏅" },
  { id: "history", label: "History", icon: "🕘" },
];

const LS_KEYS = {
  ride: "ud_ride_draft",
  tab: "ud_active_tab",
  sidebar: "ud_sidebar_open",
};

const getDefaultAvailableBadges = () => [
  { id: Date.now() + 1, icon: "🚗", title: "10 Rides Completed", date: "Earned on Oct 20, 2025", type: "achievement" },
  { id: Date.now() + 2, icon: "🏅", title: "Gold Rider", description: "Exclusive 10% off next ride", type: "reward" },
  { id: Date.now() + 3, icon: "🎯", title: "Early Bird", description: "Book 5 rides before 8 AM", type: "achievement" },
  { id: Date.now() + 4, icon: "🌟", title: "Weekend Warrior", description: "Complete 10 weekend rides", type: "achievement" },
];

const VEHICLES = {
  economy: { label: "🚕 Economy", multiplier: 1 },
  premium: { label: "🚘 Premium", multiplier: 2 },
  xl: { label: "🚐 XL", multiplier: 1.5 },
};

const getRideHistory = () => [
  {
    id: 1,
    date: "09/22",
    fullDate: "September 22, 2025",
    pickup: "Campus Center",
    dropoff: "Jefferson Pointe Mall",
    destination: "Off-Campus Destination — Fort Wayne",
    price: "$12.50",
    paymentMethod: "Visa Card",
    status: "Completed",
  },
  {
    id: 2,
    date: "09/19",
    fullDate: "September 19, 2025",
    pickup: "Dorms",
    dropoff: "Fort Wayne International Airport",
    destination: "Off-Campus Destination — Fort Wayne",
    price: "$22.75",
    paymentMethod: "Visa Card",
    status: "Completed",
  },
  {
    id: 3,
    date: "09/15",
    fullDate: "September 15, 2025",
    pickup: "Library",
    dropoff: "Student Union",
    destination: "On-Campus",
    price: "$5.00",
    paymentMethod: "Apple Pay",
    status: "Completed",
  },
  {
    id: 4,
    date: "09/10",
    fullDate: "September 10, 2025",
    pickup: "Engineering Building",
    dropoff: "Glenbrook Square Mall",
    destination: "Off-Campus Destination — Fort Wayne",
    price: "$18.50",
    paymentMethod: "Visa Card",
    status: "Completed",
  },
];

export default function UserDashboard() {
  const { pushToast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem(LS_KEYS.tab) || "profile");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.sidebar);
    return raw == null ? true : raw === "true";
  });

  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState({ name: "", studentId: "", email: "", phone: "" });

  const [settings, setSettings] = useState({
    rideAlerts: true,
    marketing: false,
    wheelchairAccess: false,
    darkMode: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const [ride, setRide] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEYS.ride);
      return JSON.parse(raw) || {
        pickup: "",
        dropoff: "",
        date: "",
        time: "",
        passengers: 1,
        vehicleType: "economy",
      };
    } catch {
      return { pickup: "", dropoff: "", date: "", time: "", passengers: 1, vehicleType: "economy" };
    }
  });

  const [fare, setFare] = useState(null);
  const [estimating, setEstimating] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const [availableBadges, setAvailableBadges] = useState([]);
  const [usedBadges, setUsedBadges] = useState([]);
  const [badgesInitialized, setBadgesInitialized] = useState(false);

  const [rideHistory, setRideHistory] = useState([]);

  // profile inner tabs
  const [profileSubTab, setProfileSubTab] = useState("account");

  useEffect(() => { localStorage.setItem(LS_KEYS.tab, activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem(LS_KEYS.sidebar, String(sidebarOpen)); }, [sidebarOpen]);
  useEffect(() => { localStorage.setItem(LS_KEYS.ride, JSON.stringify(ride)); }, [ride]);

  useEffect(() => {
    const u = getUser();
    setCurrentUser(u || null);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const uid = currentUser.email || currentUser.id || "demo-user";

    const stored = getProfile(uid);
    setProfile({
      name: stored.name || currentUser.name || "user1",
      studentId: stored.studentId || currentUser.studentId || "PFW123456",
      email: stored.email || currentUser.email || "user1@pfw.edu",
      phone: stored.phone || currentUser.phone || "",
    });

    const loadedSettings = getSettings(uid);
    setSettings({
      rideAlerts: loadedSettings.rideAlerts ?? true,
      marketing: loadedSettings.marketing ?? false,
      wheelchairAccess: loadedSettings.wheelchairAccess ?? false,
      darkMode: loadedSettings.darkMode ?? false,
    });

    setDisplayName(stored.name || currentUser.name || "user1");

    const availableKey = `badges_available_${uid}`;
    const usedKey = `badges_used_${uid}`;

    try {
      const a = localStorage.getItem(availableKey);
      const u = localStorage.getItem(usedKey);
      setAvailableBadges(a ? JSON.parse(a) : getDefaultAvailableBadges());
      setUsedBadges(u ? JSON.parse(u) : []);
    } catch {
      setAvailableBadges(getDefaultAvailableBadges());
      setUsedBadges([]);
    }
    setBadgesInitialized(true);

    setRideHistory(getRideHistory());
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !badgesInitialized) return;
    const uid = currentUser.email || currentUser.id || "demo-user";
    localStorage.setItem(`badges_available_${uid}`, JSON.stringify(availableBadges));
    localStorage.setItem(`badges_used_${uid}`, JSON.stringify(usedBadges));
  }, [availableBadges, usedBadges, currentUser, badgesInitialized]);

  if (!authChecked) return null;
  if (!currentUser || currentUser.role !== "user") return <Navigate to="/login" replace />;

  const uid = currentUser.email || currentUser.id || "demo-user";

  /* Handlers */
  function toggleEditMode() { setIsEditing((v) => !v); }

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
      saveProfile(uid, profile);
      setDisplayName(profile.name);
      pushToast("Profile saved!", "success");
      setIsEditing(false);
    } catch {
      pushToast("Could not save profile.", "error");
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
      saveSettings(uid, settings);
      pushToast("Settings saved!", "success");
    } catch {
      pushToast("Could not save settings.", "error");
    } finally {
      setSavingSettings(false);
    }
  }

  const handleEstimateFare = (e) => {
    e.preventDefault();
    setEstimating(true);
    const base = 3.5;
    const perMile = 1.75;
    const distance = Math.floor(Math.random() * 10) + 1;
    const mult = VEHICLES[ride.vehicleType].multiplier;
    const total = (base + distance * perMile) * ride.passengers * mult;
    setTimeout(() => { setFare(total.toFixed(2)); setEstimating(false); }, 300);
  };

  const handleBookRide = (e) => {
    e.preventDefault();
    const { pickup, dropoff, date, time, vehicleType } = ride;
    if (!pickup || !dropoff) {
      setConfirmMsg("⚠️ Please enter both pickup and drop-off locations before confirming your ride.");
      return;
    }
    const formattedDate = date
      ? new Date(date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
      : "(select date)";
    const formattedTime = time || "(select time)";
    setConfirmMsg(
      `🎉 Ride Confirmed!\n\n📍 **From:** ${pickup}\n🏁 **To:** ${dropoff}\n📅 **Date:** ${formattedDate}\n⏰ **Time:** ${formattedTime}\n🚗 **Vehicle Type:** ${VEHICLES[vehicleType].label}\n\n💬 Your driver will be assigned shortly.`
    );
  };

  const handleUseBadge = (badgeId) => {
    const badgeToUse = availableBadges.find((b) => b.id === badgeId);
    if (!badgeToUse) return;

    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const usedBadge = { ...badgeToUse, date: `Used on ${currentDate}`, usedDate: new Date().toISOString() };
    setAvailableBadges((prev) => prev.filter((b) => b.id !== badgeId));
    setUsedBadges((prev) => [usedBadge, ...prev]);
    pushToast(`Badge "${badgeToUse.title}" has been used!`, "success");
  };

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
              {/* PROFILE (includes Account + Settings + Support) */}
              {activeTab === "profile" && (
                <div className="clean-profile-layout">
                  <div className="profile-main-card">
                    <div className="profile-hero">
                      <div className="profile-hero-left">
                        <div className="profile-avatar-large">
                          <span className="avatar-circle-large">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                          </span>
                        </div>
                        <div className="profile-hero-info">
                          <h2>{profile.name || "User"}</h2>
                          <p>{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="profile-tabs">
                      {["account", "settings", "support"].map((k) => (
                        <button
                          key={k}
                          className={`profile-tab-btn ${profileSubTab === k ? "active" : ""}`}
                          onClick={() => setProfileSubTab(k)}
                          type="button"
                        >
                          {k === "account" ? "Account" : k === "settings" ? "Settings" : "Support"}
                        </button>
                      ))}
                    </div>

                    {/* Account */}
                    {profileSubTab === "account" && (
                      <section className="profile-section">
                        <form className="clean-profile-form" onSubmit={onSaveProfile}>
                          <div className="form-grid-2col">
                            <label className="clean-field">
                              <span>Full Name</span>
                              <input
                                name="name"
                                type="text"
                                placeholder="Your Full Name"
                                value={profile.name}
                                onChange={onProfileChange}
                                disabled={!isEditing}
                              />
                            </label>
                            <label className="clean-field">
                              <span>Student ID</span>
                              <input
                                name="studentId"
                                type="text"
                                placeholder="Your ID"
                                value={profile.studentId}
                                onChange={onProfileChange}
                                disabled={!isEditing}
                              />
                            </label>
                          </div>

                          <div className="form-grid-2col">
                            <label className="clean-field">
                              <span>Email</span>
                              <input
                                name="email"
                                type="email"
                                placeholder="you@pfw.edu"
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
                                placeholder="(optional)"
                                value={profile.phone}
                                onChange={onProfileChange}
                                disabled={!isEditing}
                              />
                            </label>
                          </div>

                          <div className="profile-actions">
                            {!isEditing ? (
                              <button className="btn" type="button" onClick={toggleEditMode}>
                                Edit
                              </button>
                            ) : (
                              <>
                                <button className="btn" type="submit" disabled={savingProfile}>
                                  {savingProfile ? "Saving..." : "Save Changes"}
                                </button>
                                <button className="btn ghost" type="button" onClick={toggleEditMode}>
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </form>
                      </section>
                    )}

                    {/* Settings (inside Profile) */}
                    {profileSubTab === "settings" && (
                      <section className="profile-section">
                        <header className="ud-head">
                          <h2>Settings</h2>
                          <p>Customize notifications & preferences</p>
                        </header>
                        <form className="ud-form" onSubmit={onSaveSettings}>
                          <div className="setting-item">
                            <div><strong>Wheelchair Access</strong><p>Request wheelchair-accessible vehicles</p></div>
                            <label className="toggle">
                              <input type="checkbox" checked={settings.wheelchairAccess} onChange={() => onToggleSetting("wheelchairAccess")} />
                              <span />
                            </label>
                          </div>
                          <div className="setting-item">
                            <div><strong>Dark Mode</strong><p>Use dark theme across the app</p></div>
                            <label className="toggle">
                              <input type="checkbox" checked={settings.darkMode} onChange={() => onToggleSetting("darkMode")} />
                              <span />
                            </label>
                          </div>
                          <div className="setting-item">
                            <div><strong>Ride Alerts</strong><p>Receive notifications for ride updates</p></div>
                            <label className="toggle">
                              <input type="checkbox" checked={settings.rideAlerts} onChange={() => onToggleSetting("rideAlerts")} />
                              <span />
                            </label>
                          </div>
                          <div className="setting-item">
                            <div><strong>Marketing Emails</strong><p>Get news and promotions</p></div>
                            <label className="toggle">
                              <input type="checkbox" checked={settings.marketing} onChange={() => onToggleSetting("marketing")} />
                              <span />
                            </label>
                          </div>
                          <button className="btn wide" type="submit" disabled={savingSettings}>
                            {savingSettings ? "Saving..." : "Save Settings"}
                          </button>
                        </form>
                      </section>
                    )}

                    {/* Support (inside Profile) */}
                    {profileSubTab === "support" && (
                      <section className="profile-section">
                        <header className="ud-head"><h2>Support</h2><p>We're here to help</p></header>
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
                  </div>
                </div>
              )}

              {/* BOOK */}
              {activeTab === "book" && (
                <div className="book-layout">
                  <div className="book-form-col">
                    <section className="ud-hero">
                      <h1>Welcome back, {displayName || "user"}! 👋</h1>
                      <p>Plan your next ride and estimate your fare in seconds.</p>
                    </section>
                    <section className="ud-panel">
                      <header className="ud-head"><h2>Book a Ride 🚗</h2></header>
                      <form className="ud-form bookride" onSubmit={(e) => e.preventDefault()}>
                        <label className="ud-field">
                          <span>Pickup Location</span>
                          <input type="text" placeholder="e.g., Walb Student Union" value={ride.pickup} onChange={(e) => setRide({ ...ride, pickup: e.target.value })} />
                        </label>
                        <label className="ud-field">
                          <span>Drop-off Location</span>
                          <input type="text" placeholder="e.g., Coliseum Blvd" value={ride.dropoff} onChange={(e) => setRide({ ...ride, dropoff: e.target.value })} />
                        </label>
                        <div className="ud-row">
                          <label className="ud-field">
                            <span>Date</span>
                            <input type="date" value={ride.date} onChange={(e) => setRide({ ...ride, date: e.target.value })} />
                          </label>
                          <label className="ud-field">
                            <span>Time</span>
                            <input type="time" value={ride.time} onChange={(e) => setRide({ ...ride, time: e.target.value })} />
                          </label>
                        </div>
                        <div className="ud-row">
                          <label className="ud-field">
                            <span>Passengers</span>
                            <input type="number" min="1" max="6" value={ride.passengers} onChange={(e) => setRide({ ...ride, passengers: parseInt(e.target.value || "1", 10) })} />
                          </label>
                          <label className="ud-field">
                            <span>Vehicle Type</span>
                            <select value={ride.vehicleType} onChange={(e) => setRide({ ...ride, vehicleType: e.target.value })}>
                              {Object.entries(VEHICLES).map(([key, v]) => (
                                <option key={key} value={key}>{v.label}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="br-actions">
                          <button type="button" onClick={handleEstimateFare} className="estimate-btn" disabled={estimating}>
                            {estimating ? "Estimating…" : fare ? `💵 Estimated Fare: $${fare}` : "Estimate Fare"}
                          </button>
                        </div>
                        <button className="btn wide confirm-btn" onClick={handleBookRide} type="button">Confirm Booking</button>
                      </form>
                      {confirmMsg && <div className="confirm-msg">{confirmMsg}</div>}
                    </section>
                  </div>
                  <div className="book-map-col">
                    <MapBlock pickupText={ride.pickup} dropoffText={ride.dropoff} height={600} />
                  </div>
                </div>
              )}

              {/* PAYMENT */}
              {activeTab === "payment" && (
                <div className="payment-page-wrapper">
                  <div className="mastoride-cash-card">
                    <h3 className="cash-title">MastoRide Cash</h3>
                    <div className="cash-amount">${(0).toFixed(2)}</div>
                    <p className="cash-subtitle">Plan ahead, budget easier</p>
                    <div className="cash-actions">
                      <button className="btn-add-cash">Add cash</button>
                      <button className="btn-manage">Manage</button>
                    </div>
                  </div>

                  <div className="payment-section">
                    <h3 className="section-title">Payment defaults</h3>
                    <button className="payment-option">
                      <div className="option-icon"><span>👤</span></div>
                      <div className="option-content">
                        <div className="option-title">Personal</div>
                        <div className="option-subtitle">Visa Card</div>
                      </div>
                      <span className="option-arrow">›</span>
                    </button>
                  </div>

                  <div className="payment-section">
                    <h3 className="section-title">Payment methods</h3>
                    <div className="payment-method-item">
                      <div className="method-icon"><span className="visa-icon">VISA</span></div>
                      <div className="method-content"><div className="method-title">Visa Card</div></div>
                    </div>
                    <div className="payment-method-item">
                      <div className="method-icon"><span className="apple-icon"></span></div>
                      <div className="method-content"><div className="method-title">Apple Pay</div></div>
                    </div>
                    <button className="add-payment-btn"><span className="add-icon">+</span><span>Add payment method</span></button>
                  </div>
                </div>
              )}

              {/* REWARDS */}
              {activeTab === "rewards" && (
                <div className="rewards-page-wrapper">
                  <section className="rewards-hero">
                    <h1>Rewards & Badges</h1>
                    <p>Track your progress, earn rewards, and unlock exclusive perks 🚀</p>
                  </section>

                  <div className="rewards-points-card">
                    <div className="points-display">
                      <span className="trophy-icon">🏆</span>
                      <span className="points-number">250 Points</span>
                    </div>
                    <p className="points-subtitle">Keep riding to reach <strong>Gold Tier</strong></p>
                    <button className="redeem-points-btn">Redeem Points</button>
                  </div>

                  <section className="badges-section">
                    <h2 className="badges-heading"><span className="badge-emoji">🎯</span> Available Badges</h2>
                    {availableBadges.length > 0 ? (
                      <div className="badges-grid">
                        {availableBadges.map((badge) => (
                          <div key={badge.id} className="badge-card available">
                            <div className="badge-icon">{badge.icon}</div>
                            <h3 className="badge-title">{badge.title}</h3>
                            {badge.date && <p className="badge-date">{badge.date}</p>}
                            {badge.description && <p className="badge-description">{badge.description}</p>}
                            <button className="use-badge-btn" onClick={() => handleUseBadge(badge.id)}>Use Badge</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-badges"><p>🎉 No available badges right now. Keep riding to earn more!</p></div>
                    )}
                  </section>

                  <section className="badges-section">
                    <h2 className="badges-heading"><span className="badge-emoji">📜</span> Used Badges</h2>
                    {usedBadges.length > 0 ? (
                      <div className="badges-grid">
                        {usedBadges.map((badge) => (
                          <div key={badge.id} className="badge-card used">
                            <div className="badge-icon">{badge.icon}</div>
                            <h3 className="badge-title">{badge.title}</h3>
                            <p className="badge-date">{badge.date}</p>
                            {badge.description && <p className="badge-description">{badge.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-badges"><p>No used badges yet</p></div>
                    )}
                  </section>
                </div>
              )}

              {/* HISTORY — centered, desktop-wide cards */}
              {activeTab === "history" && (
                <section className="ud-panel history-panel">
                  <div className="history-stack">
                    {rideHistory.map((item, idx) => (
                      <div key={item.id} className="ride-history-card" style={{ "--stagger": `${idx * 60}ms` }}>
                        <div className="ride-card-header">
                          <div className="ride-date-badge">{item.date}</div>
                          <div className="ride-status-badge">{item.status}</div>
                        </div>

                        <div className="ride-card-body">
                          <div className="ride-route">
                            <div className="route-point">
                              <div className="route-icon pickup-icon">📍</div>
                              <div className="route-details">
                                <div className="route-label">Pickup</div>
                                <div className="route-location">{item.pickup}</div>
                              </div>
                            </div>

                            <div className="route-line" />

                            <div className="route-point">
                              <div className="route-icon dropoff-icon">🎯</div>
                              <div className="route-details">
                                <div className="route-label">Drop-off</div>
                                <div className="route-location">{item.dropoff}</div>
                              </div>
                            </div>
                          </div>

                          <div className="ride-card-info">
                            <div className="info-row">
                              <span className="info-icon">📅</span>
                              <span className="info-text">Date Booked: {item.fullDate}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-icon">💳</span>
                              <span className="info-text">Payment: {item.paymentMethod}</span>
                            </div>
                            <div className="info-row">
                              <span className="info-icon">📌</span>
                              <span className="info-text">{item.destination}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ride-card-footer">
                          <div className="ride-price">
                            <span className="price-label">Total Fare</span>
                            <span className="price-amount">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
