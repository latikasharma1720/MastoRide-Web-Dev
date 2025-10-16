import React from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <main className="admin-main container">{children}</main>
      <Footer />
    </div>
  );
}
