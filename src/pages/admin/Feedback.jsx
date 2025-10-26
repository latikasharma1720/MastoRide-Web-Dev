import { useEffect, useState } from "react";
import { listTickets, closeTicket } from "../../utils/mockApi";

export default function Feedback() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await listTickets();
      setTickets(data);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await closeTicket(id);
      await loadTickets();
    } catch {
      setError("Unable to close the ticket right now.");
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <section className="feedback-section">
      <h2 className="feedback-title">🎟️ User Feedback / Support Tickets</h2>

      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <p className="loading">Loading tickets...</p>
      ) : tickets.length ? (
        <div className="table-container">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>When</th>
                <th>User ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets
                .slice()
                .reverse()
                .map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.ts).toLocaleString()}</td>
                    <td>{t.userId}</td>
                    <td>{t.message}</td>
                    <td
                      className={`status ${
                        t.status === "closed" ? "closed" : "open"
                      }`}
                    >
                      {t.status}
                    </td>
                    <td>
                      {t.status !== "closed" && (
                        <button
                          className="btn-close"
                          onClick={() => handleClose(t.id)}
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty">No feedback tickets yet 🎉</p>
      )}
    </section>
  );
}
