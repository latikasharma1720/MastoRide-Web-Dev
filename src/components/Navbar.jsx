import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const navClass = ({ isActive }) => `nav-btn${isActive ? " active" : ""}`;

  return (
    <header className="site-header">
      <div className="brand">
        <Link className="brand-link" to="/" aria-label="MastoRide Home">
          <img src="/images/ourlogos.jpeg" alt="MastoRide logo" className="brand-logo" />
        </Link>
      </div>

      <nav className="site-nav" aria-label="Primary">
        <ul>
          <li><NavLink className={navClass} to="/">Home</NavLink></li>
          <li><NavLink className={navClass} to="/about">About</NavLink></li>
          <li><NavLink className={navClass} to="/services">Services</NavLink></li>
          <li><NavLink className={navClass} to="/pricing">Pricing</NavLink></li>
          <li><NavLink className={navClass} to="/contact">Contact us</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}
