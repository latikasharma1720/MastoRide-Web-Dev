import { Link } from "react-router-dom";

export default function Navbar(){
  return (
    <header className="site-header">
      <div className="brand">
        <Link className="brand-link" to="/" aria-label="MastoRide Home">
          {/* served from /public */}
          <img src="/images/ourlogos.jpeg" alt="MastoRide logo" className="brand-logo" />
        </Link>
      </div>

      <nav className="site-nav" aria-label="Primary">
        <ul>
          <li><Link className="nav-btn" to="/">Home</Link></li>
          <li><Link className="nav-btn" to="/about">About</Link></li>
          <li><Link className="nav-btn" to="/services">Services / Pricing</Link></li>
          <li><Link className="nav-btn" to="/contact">Contact us</Link></li>
        </ul>
      </nav>
    </header>
  );
}
