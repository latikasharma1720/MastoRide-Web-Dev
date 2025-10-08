import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUser } from "../../utils/session";
import { getProfile, saveProfile, getRewards, submitSupportTicket } from "../../utils/mockApi";

export default function Profile() {
  const user = getUser();
  const [tab, setTab] = useState("account");
  const [p, setP] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedOK, setSavedOK] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketOK, setTicketOK] = useState("");

  useEffect(() => {
    getProfile(user.id).then(setP);
  }, [user.id]);

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await saveProfile(user.id, p);
    setSaving(false);
    setSavedOK("Saved ✓");
    setTimeout(() => setSavedOK(""), 1500);
  }

  async function sendTicket(e) {
    e.preventDefault();
    if (!ticketBody.trim()) return;
    await submitSupportTicket(user.id, ticketBody.trim());
    setTicketBody("");
    setTicketOK("Ticket submitted. We'll email you an update.");
    setTimeout(() => setTicketOK(""), 1500);
  }

  if (!p) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <main className="container-narrow" style={{ padding: "2rem 1rem" }}>
          <div className="card skeleton" style={{ height: 180 }} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="container-narrow" style={{ padding: "2rem 1rem" }}>
        <h1 className="page-title">Profile</h1>

        {/* Tabs */}
        <div className="tabs">
          {["account", "payments", "rewards", "support", "settings"].map((t) => (
            <button
              key={t}
              className={`tab-btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Panel */}
        <section className="card">
          {tab === "account" && (
            <form className="form-grid" onSubmit={save}>
              <div className="grid-2">
                <div className="field">
                  <label>Full name</label>
                  <input
                    value={p.name}
                    onChange={(e) => setP((x) => ({ ...x, name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={p.email}
                    onChange={(e) => setP((x) => ({ ...x, email: e.target.value }))}
                    placeholder="name@pfw.edu"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Phone</label>
                  <input
                    value={p.phone || ""}
                    onChange={(e) => setP((x) => ({ ...x, phone: e.target.value }))}
                    placeholder="(260) 555-1234"
                  />
                </div>
                <div className="field">
                  <label>PFW ID (optional)</label>
                  <input
                    value={p.studentId || ""}
                    onChange={(e) => setP((x) => ({ ...x, studentId: e.target.value }))}
                    placeholder="A00xxxxxx"
                  />
                </div>
              </div>

              <div className="actions-right">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                {savedOK && <span className="ok-msg">{savedOK}</span>}
              </div>
            </form>
          )}

          {tab === "payments" && (
            <form className="form-grid" onSubmit={save}>
              <div className="grid-2">
                <div className="field">
                  <label>Name on card</label>
                  <input
                    value={p.payment?.cardName || ""}
                    onChange={(e) =>
                      setP((x) => ({ ...x, payment: { ...x.payment, cardName: e.target.value } }))
                    }
                    placeholder="Latika Sharma"
                  />
                </div>
                <div className="field">
                  <label>Card last 4</label>
                  <input
                    value={p.payment?.cardLast4 || ""}
                    onChange={(e) =>
                      setP((x) => ({ ...x, payment: { ...x.payment, cardLast4: e.target.value } }))
                    }
                    maxLength={4}
                    placeholder="1234"
                  />
                </div>
              </div>

              <div className="field">
                <label>Preferred method</label>
                <select
                  value={p.payment?.preferred || "cash"}
                  onChange={(e) =>
                    setP((x) => ({ ...x, payment: { ...x.payment, preferred: e.target.value } }))
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="actions-right">
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                {savedOK && <span className="ok-msg">{savedOK}</span>}
              </div>
            </form>
          )}

          {tab === "rewards" && <RewardsView userId={user.id} />}

          {tab === "support" && (
            <form className="form-grid" onSubmit={sendTicket}>
              <div className="field">
                <label>Send us a message</label>
                <textarea
                  rows={5}
                  value={ticketBody}
                  onChange={(e) => setTicketBody(e.target.value)}
                  placeholder="Describe your issue or feedback…"
                />
                <p className="hint">We usually respond within 1–2 business days.</p>
              </div>
              <div className="actions-right">
                <button className="btn" type="submit">Submit ticket</button>
                {ticketOK && <span className="ok-msg">{ticketOK}</span>}
              </div>
            </form>
          )}

          {tab === "settings" && (
            <div className="form-grid">
              <div className="switch">
                <input
                  id="notif"
                  type="checkbox"
                  checked={!!p.settings?.notifications}
                  onChange={(e) =>
                    setP((x) => ({
                      ...x,
                      settings: { ...x.settings, notifications: e.target.checked },
                    }))
                  }
                />
                <label htmlFor="notif">Email notifications</label>
              </div>

              <div className="switch">
                <input
                  id="share"
                  type="checkbox"
                  checked={!!p.settings?.shareHistory}
                  onChange={(e) =>
                    setP((x) => ({
                      ...x,
                      settings: { ...x.settings, shareHistory: e.target.checked },
                    }))
                  }
                />
                <label htmlFor="share">Allow drivers to see limited history</label>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function RewardsView({ userId }) {
  const [r, setR] = useState(null);
  useEffect(() => {
    getRewards(userId).then(setR);
  }, [userId]);
  if (!r) return <div className="card skeleton" style={{ height: 120 }} />;

  return (
    <div className="cards-3">
      <div className="card kpi">
        <div className="kpi-label">Points</div>
        <div className="kpi-value">{r.points}</div>
      </div>
      <div className="card kpi">
        <div className="kpi-label">Tier</div>
        <div className="kpi-value">{r.tier}</div>
      </div>
      <div className="card kpi">
        <div className="kpi-label">Next reward at</div>
        <div className="kpi-value">{r.nextAt} pts</div>
      </div>
    </div>
  );
}
