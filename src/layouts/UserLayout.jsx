import React from "react";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";

export default function UserLayout({ children }) {
  return (
    <div className="user-layout">
      <UserNavbar />

      <div className="user-main">
        <div className="user-container">{children}</div>
      </div>

      <Footer />
    </div>
  );
}
