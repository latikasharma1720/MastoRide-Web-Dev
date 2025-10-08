import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="page-wrapper" style={{maxWidth: 520}}>
      <h2 className="welcome">Create a new account</h2>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <label>
          PFW email
          <input type="email" placeholder="name@pfw.edu" required />
        </label>
        <label>
          Create password
          <input type="password" required minLength={8} />
        </label>
        <label>
          Confirm password
          <input type="password" required minLength={8} />
        </label>
        <button className="btn" type="submit">Sign up</button>
      </form>
      <div style={{marginTop: 8}}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
