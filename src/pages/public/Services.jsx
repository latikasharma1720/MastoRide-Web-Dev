import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Services(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">Services / Pricing</h2>
        <p className="lead">City runs, airport trips, and late-evening rides with student pricing.</p>
      </main>
      <Footer />
    </div>
  );
}
