import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contact(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">Contact us</h2>
        <p className="lead">Questions or feedback? We’re here to help.</p>
      </main>
      <Footer />
    </div>
  );
}
