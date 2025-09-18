import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">About</h2>
        <p className="lead">MastoRide is a student-first ride service for PFW—safe, affordable, and verified.</p>
      </main>
      <Footer />
    </div>
  );
}
