import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Contact(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">Contact us</h2>
        <p className="lead">Have questions? Reach out and we’ll help.</p>
      </main>
      <Footer />
    </div>
  );
}
