import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page-wrapper" style={{maxWidth: 420}}>
      <h2 className="welcome">Log in</h2>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <label>
          PFW email
          <input type="email" placeholder="name@pfw.edu" required />
        </label>
        <label>
          Password
          <input type="password" required />
        </label>
        <button className="btn" type="submit">Log in</button>
      </form>
      <div style={{marginTop: 10}}>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
      <div style={{marginTop: 6}}>
        New here? <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
}
