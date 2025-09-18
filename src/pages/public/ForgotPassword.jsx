import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ForgotPassword(){
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="center-only">
        <h2 className="welcome">Forgot Password</h2>
        <p className="lead">Enter your PFW email and we’ll send a reset link.</p>

        <form className="auth-form" onSubmit={(e)=>{ e.preventDefault(); alert("Reset link sent!"); }}>
          <div className="field">
            <label htmlFor="fp-email">PFW Email</label>
            <input id="fp-email" name="email" type="email" placeholder="name@pfw.edu" required />
          </div>
          <button className="btn btn-white btn-full" type="submit">Send Reset Link</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
