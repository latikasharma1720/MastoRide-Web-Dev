// src/components/Layout.jsx
import Navbar from "./Navbar";

function Footer() {
  return (
    <footer>
      <div className="container" style={{padding:"20px 0", opacity:.85}}>
        © {new Date().getFullYear()} MastoRide — PFW student rides
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div style={{minHeight:"100dvh", display:"grid", gridTemplateRows:"auto 1fr auto"}}>
      <Navbar />
      <main className="container" style={{padding:"24px 0"}}>{children}</main>
      <Footer />
    </div>
  );
}
