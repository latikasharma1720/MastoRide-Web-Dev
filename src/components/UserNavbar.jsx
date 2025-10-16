import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../utils/session";

const LOGO_SRC = "/assets/images/ourlogos.jpeg";

export default function UserNavbar() {
  const nav = useNavigate();
  const user = getUser();

  const signOut = () => {
    clearUser();
    nav("/", { replace: true });
  };

  return (
    <header className="mr-navbar">
      <div className="mr-nav-inner">
        {/* Brand */}
        <Link to="/user/dashboard" className="MastoRide logo" aria-label="Home">
          <img src={LOGO_SRC} alt="MastoRide logo" className="mr-logo" />
        </Link>

        {/* User Menu */}
        <nav className="mr-links">
          <Link to="/user/profile" className="mr-link">Profile</Link>
          <Link to="/user/book-ride" className="mr-link">Book a Ride</Link>
          <Link to="/user/previous-rides" className="mr-link">History</Link>
        </nav>

        {/* Sign Out */}
        <div className="mr-actions">
          <div className="mr-admin-chip">
            <span className="mr-email">{user?.email}</span>
            <button onClick={signOut} className="mr-btn mr-btn-danger">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
