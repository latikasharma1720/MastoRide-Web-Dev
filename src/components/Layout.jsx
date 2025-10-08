import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // remove if you don’t have one

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
