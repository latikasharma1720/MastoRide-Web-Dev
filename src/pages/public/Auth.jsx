import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";   // ✅ use Link instead of <a>

export default function Auth(){
  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="center-only">
        <h1 className="welcome">Welcome to MastoRide</h1>
        <p className="lead">
          Affordable, safe rides from campus to anywhere off-campus. Exclusively for verified
          PFW students with a valid <code>.edu</code> email.
        </p>

        {/* Tabs (pure CSS via radios) */}
        <section className="card-wrap">
          <input type="radio" name="auth-tab" id="tab-signup" className="tab-radio" defaultChecked />
          <input type="radio" name="auth-tab" id="tab-login"  className="tab-radio" />

          <div className="auth-card-large">
            <div className="tablist" role="tablist" aria-label="Authentication">
              <label className="tab" htmlFor="tab-signup" role="tab" aria-controls="panel-signup">Create account</label>
              <label className="tab" htmlFor="tab-login"  role="tab" aria-controls="panel-login">Log in</label>
            </div>

            {/* Sign Up */}
            <section id="panel-signup" className="panel" role="tabpanel" aria-labelledby="tab-signup">
              <header className="panel-header">
                <h2>Create a new account</h2>
                <p>It’s quick and easy.</p>
              </header>

              <form className="auth-form" action="#" method="post" noValidate
                onSubmit={(e)=>{ e.preventDefault(); /* hook up later */ }}>
                <div className="field">
                  <label htmlFor="su-email">PFW email</label>
                  <input id="su-email" name="email" type="email" placeholder="name@pfw.edu" autoComplete="email" required />
                </div>

                <div className="field">
                  <label htmlFor="su-password">Create password</label>
                  <input id="su-password" name="password" type="password" placeholder="8+ characters" minLength={8} autoComplete="new-password" required />
                </div>

                <div className="field">
                  <label htmlFor="su-confirm">Confirm password</label>
                  <input id="su-confirm" name="confirm" type="password" placeholder="Re-enter password" minLength={8} autoComplete="new-password" required />
                </div>

                <button className="btn btn-white btn-full" type="submit">Sign Up</button>
                <p className="tiny-note">
                  By clicking Sign Up, you agree to our Terms and acknowledge our Privacy Policy.
                </p>
              </form>
            </section>

            {/* Login */}
            <section id="panel-login" className="panel" role="tabpanel" aria-labelledby="tab-login">
              <header className="panel-header">
                <h2>Login</h2>
                <p>Welcome back.</p>
              </header>

              <form className="auth-form" action="#" method="post" noValidate
                onSubmit={(e)=>{ e.preventDefault(); /* hook up later */ }}>
                <div className="field">
                  <label htmlFor="li-email">Email</label>
                  <input id="li-email" name="email" type="email" autoComplete="username" placeholder="name@pfw.edu" required />
                </div>

                <div className="field">
                  <label htmlFor="li-password">Password</label>
                  <input id="li-password" name="password" type="password" autoComplete="current-password" placeholder="Your password" required />
                </div>

                <button className="btn btn-white btn-full" type="submit">Log in</button>
                {/* ✅ Fixed: replaced <a href="#"> with Link */}
                <Link className="link-forgot" to="/forgot-password">Forgot password?</Link>
              </form>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
