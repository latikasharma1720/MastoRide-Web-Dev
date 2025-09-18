import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/public/Auth";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import Contact from "./pages/public/Contact";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing shows your Sign up / Log in card with tabs */}
        <Route path="/" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}
