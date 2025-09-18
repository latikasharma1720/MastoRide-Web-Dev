import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Services(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">Services</h2>
        <p className="lead">City trips, airport runs, late-evening rides—student pricing applies.</p>
      </main>
      <Footer />
    </div>
  );
}
