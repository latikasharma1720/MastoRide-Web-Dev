import { Link, useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin, getAdmin } from "../utils/adminAuth";

export default function Navbar() {
  const nav = useNavigate();
  const admin = getAdmin();
  const isAdmin = isAdminLoggedIn();

  const signOutAdmin = () => {
    logoutAdmin();
    nav("/", { replace: true });
  };

  return (
    <header className="your-navbar-classes">
      {/* ...your brand + normal nav links... */}

      <div className="auth-actions">
        {!isAdmin ? (
          <>
            {/* your existing Log in / Sign up */}
            <Link className="btn warn" to="/admin/login">Log in as Admin</Link>
          </>
        ) : (
          <div className="admin-chip">
            <span className="badge">Admin</span>
            <span className="email">{admin?.email}</span>
            <Link className="btn ghost" to="/admin">Dashboard</Link>
            <button className="btn danger" onClick={signOutAdmin}>Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
