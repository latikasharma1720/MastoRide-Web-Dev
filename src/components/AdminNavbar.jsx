import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../utils/session";

const LOGO_SRC = "/assets/images/ourlogos.jpeg";

export default function AdminNavbar() {
  const nav = useNavigate();
  const admin = getUser();

  const signOut = () => {
    clearUser();
    nav("/", { replace: true });
  };

  return (
    <header className="mr-navbar">
      <div className="mr-nav-inner">
        {/* Brand */}
        <Link to="/admin/manage" className="MastoRide logo" aria-label="Admin Home">
          <img src={LOGO_SRC} alt="MastoRide logo" className="mr-logo" />
        </Link>

        {/* Admin Menu */}
        <nav className="mr-links">
          <Link to="/admin/manage" className="mr-link">Dashboard</Link>
          <Link to="/admin/bookings" className="mr-link">Bookings</Link>
        </nav>

        {/* Right section */}
        <div className="mr-actions">
          <div className="mr-admin-chip">
            <span className="mr-email">{admin?.email || "admin@mastoride.com"}</span>
            <button onClick={signOut} className="mr-btn mr-btn-danger">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  );
}
