import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/public/Auth";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Pricing from "./pages/public/Pricing";
import Contact from "./pages/public/Contact";
import ForgotPassword from "./pages/public/ForgotPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest/Public entry */}
        <Route path="/" element={<Auth initialTab="signup" />} />
        <Route path="/signup" element={<Auth initialTab="signup" />} />
        <Route path="/login" element={<Auth initialTab="login" />} />

        {/* Info pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="center-only" style={{ padding: "2rem" }}>
              <h2 className="welcome">Page not found</h2>
              <p className="lead">The page you’re looking for doesn’t exist.</p>
              <a className="nav-btn" href="/">Go Home</a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
