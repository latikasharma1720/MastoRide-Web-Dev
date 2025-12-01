export default function Contact() {
  return (
    <div className="page-wrapper">
      <h2 className="welcome">Contact us</h2>
      <p className="lead">Questions? Reach out to our support team.</p>
      <form className="stack" onSubmit={(e) => e.preventDefault()}>
        <label>
          Name
          <input type="text" required />
        </label>
        <label>
          Email
          <input type="email" required />
        </label>
        <label>
          Message
          <textarea rows="4" required />
        </label>
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}
