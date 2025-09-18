import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { isPfwEmail, isStrongPassword } from "../../utils/validation";
import QRDownload from "../../components/QRDownload"; // ✅ add this

export default function Auth({ initialTab = "signup" }) {
  const signupRadio = useRef(null);
  const loginRadio = useRef(null);

  useEffect(() => {
    if (initialTab === "login") loginRadio.current.checked = true;
    else signupRadio.current.checked = true;
  }, [initialTab]);

  // Signup form state
  const [suEmail, setSuEmail] = useState("");
  const [suPw, setSuPw] = useState("");
  const [suConfirm, setSuConfirm] = useState("");
  const [suErrors, setSuErrors] = useState({});

  // Login form state
  const [liEmail, setLiEmail] = useState("");
  const [liPw, setLiPw] = useState("");
  const [liErrors, setLiErrors] = useState({});

  const handleSignup = (e) => {
    e.preventDefault();
    const errs = {};
    if (!isPfwEmail(suEmail)) errs.email = "Use your @pfw.edu email address.";
    if (!isStrongPassword(suPw)) errs.password = "Password must be at least 8 characters.";
    if (suPw !== suConfirm) errs.confirm = "Passwords do not match.";
    setSuErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("Sign up form valid ✅ (hook backend later)");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = {};
    if (!/\S+@\S+\.\S+/.test(liEmail)) errs.email = "Enter a valid email.";
    if (!liPw) errs.password = "Enter your password.";
    setLiErrors(errs);
    if (Object.keys(errs).length === 0) {
      alert("Login form valid ✅ (hook backend later)");
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="center-only">
        <h1 className="welcome">Welcome to MastoRide</h1>
        <p className="lead">
          Affordable, safe rides from campus to anywhere off-campus. Exclusively for verified
          PFW students with a valid <code>.edu</code> email.
        </p>

        <section className="card-wrap">
          {/* radio tabs */}
          <input
            ref={signupRadio}
            type="radio"
            name="auth-tab"
            id="tab-signup"
            className="tab-radio"
            defaultChecked
          />
          <input
            ref={loginRadio}
            type="radio"
            name="auth-tab"
            id="tab-login"
            className="tab-radio"
          />

          <div className="auth-card-large">
            <div className="tablist" role="tablist" aria-label="Authentication">
              <label className="tab" htmlFor="tab-signup" role="tab" aria-controls="panel-signup">
                Create account
              </label>
              <label className="tab" htmlFor="tab-login" role="tab" aria-controls="panel-login">
                Log in
              </label>
            </div>

            {/* Sign Up panel */}
            <section id="panel-signup" className="panel" role="tabpanel" aria-labelledby="tab-signup">
              <header className="panel-header">
                <h2>Create a new account</h2>
                <p className="panel-subtitle">It’s quick and easy.</p>
              </header>

              <form className="auth-form" onSubmit={handleSignup} noValidate>
                <div className="field">
                  <label htmlFor="su-email">PFW email</label>
                  <input
                    id="su-email"
                    type="email"
                    placeholder="name@pfw.edu"
                    autoComplete="email"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    aria-invalid={!!suErrors.email}
                    aria-describedby="su-email-err su-email-hint"
                  />
                  {!suErrors.email && (
                    <div id="su-email-hint" className="hint">Use your @pfw.edu email address.</div>
                  )}
                  {suErrors.email && (
                    <div id="su-email-err" className="error" role="alert">{suErrors.email}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="su-password">Create password</label>
                  <input
                    id="su-password"
                    type="password"
                    placeholder="8+ characters"
                    minLength={8}
                    autoComplete="new-password"
                    value={suPw}
                    onChange={(e) => setSuPw(e.target.value)}
                    aria-invalid={!!suErrors.password}
                    aria-describedby="su-pw-err"
                  />
                  {suErrors.password && (
                    <div id="su-pw-err" className="error" role="alert">{suErrors.password}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="su-confirm">Confirm password</label>
                  <input
                    id="su-confirm"
                    type="password"
                    placeholder="Re-enter password"
                    minLength={8}
                    autoComplete="new-password"
                    value={suConfirm}
                    onChange={(e) => setSuConfirm(e.target.value)}
                    aria-invalid={!!suErrors.confirm}
                    aria-describedby="su-confirm-err"
                  />
                  {suErrors.confirm && (
                    <div id="su-confirm-err" className="error" role="alert">{suErrors.confirm}</div>
                  )}
                </div>

                <button className="btn btn-white btn-full" type="submit">Sign Up</button>
                <p className="tiny-note">
                  By clicking Sign Up, you agree to our Terms and acknowledge our Privacy Policy.
                </p>
              </form>
            </section>

            {/* Login panel */}
            <section id="panel-login" className="panel" role="tabpanel" aria-labelledby="tab-login">
              <header className="panel-header">
                <h2>Login</h2>
                <p className="panel-subtitle">Welcome back — sign in to continue.</p>
              </header>

              <form className="auth-form" onSubmit={handleLogin} noValidate>
                <div className="field">
                  <label htmlFor="li-email">Email</label>
                  <input
                    id="li-email"
                    type="email"
                    placeholder="name@pfw.edu"
                    autoComplete="username"
                    value={liEmail}
                    onChange={(e) => setLiEmail(e.target.value)}
                    aria-invalid={!!liErrors.email}
                    aria-describedby="li-email-err"
                  />
                  {liErrors.email && (
                    <div id="li-email-err" className="error" role="alert">{liErrors.email}</div>
                  )}
                </div>

                <div className="field">
                  <label htmlFor="li-password">Password</label>
                  <input
                    id="li-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={liPw}
                    onChange={(e) => setLiPw(e.target.value)}
                    aria-invalid={!!liErrors.password}
                    aria-describedby="li-pw-err"
                  />
                  {liErrors.password && (
                    <div id="li-pw-err" className="error" role="alert">{liErrors.password}</div>
                  )}
                </div>

                <button className="btn btn-white btn-full" type="submit">Log in</button>
                <Link className="link-forgot" to="/forgot-password">Forgot password?</Link>
              </form>
            </section>
          </div>
        </section>

        {/* ✅ QR Download section */}
        <QRDownload />
      </main>

      <Footer />
    </div>
  );
}
