import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, clearUser } from "../utils/session";

const LOGO_SRC = "/assets/images/ourlogos.jpeg";

export default function Navbar() {
  const nav = useNavigate();
  const user = getUser();
  const isUserLoggedIn = user && user.role === "user";
  const isAdmin = user && user.role === "admin";

  const signOut = () => {
    clearUser();
    nav("/", { replace: true });
  };

  return (
    <header className="mr-navbar">
      <div className="mr-nav-inner">
        {/* Brand */}
        <Link to="/" className="MastoRide logo" aria-label="Home">
          <img src={LOGO_SRC} alt="MastoRide logo" className="mr-logo" />
        </Link>

        {/* Centered links */}
        <nav className="mr-links" aria-label="Primary">
          <NavLink to="/" end className="mr-link">Home</NavLink>
          <NavLink to="/about" className="mr-link">About</NavLink>
          <NavLink to="/services" className="mr-link">Services</NavLink>
          <NavLink to="/pricing" className="mr-link">Pricing</NavLink>
          <NavLink to="/contact" className="mr-link">Contact us</NavLink>
        </nav>

        {/* Right actions */}
        <div className="mr-actions">
          {!user && (
            <>
              <Link to="/login" className="mr-btn mr-btn-ghost">Log in</Link>
              <Link to="/signup" className="mr-btn">Sign up</Link>
              <Link to="/admin/login" className="mr-btn mr-btn-warn">Log in as Admin</Link>
            </>
          )}
          
          {isUserLoggedIn && (
            <div className="mr-admin-chip">
              <span className="mr-email">{user.email}</span>
              <button onClick={signOut} className="mr-btn mr-btn-danger">Sign out</button>
            </div>
          )}
          
          {isAdmin && (
            <div className="mr-admin-chip">
              <span className="mr-badge">Admin</span>
              <span className="mr-email">{user.email}</span>
              <button onClick={signOut} className="mr-btn mr-btn-danger">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}