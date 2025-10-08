import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getUser } from "../../utils/session";
import { getMyHistory } from "../../utils/mockApi";

export default function History() {
  const user = getUser();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  useEffect(() => { getMyHistory(user.id).then(setRows); }, [user.id]);

  const data = useMemo(() => {
    let out = [...rows];
    if (q.trim()) {
      const s = q.toLowerCase();
      out = out.filter(r => [r.from, r.to].some(v => String(v).toLowerCase().includes(s)));
    }
    if (min !== "") out = out.filter(r => Number(r.price) >= Number(min));
    if (max !== "") out = out.filter(r => Number(r.price) <= Number(max));
    return out;
  }, [rows, q, min, max]);

  const total = data.reduce((a, b) => a + Number(b.price || 0), 0);

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="container-narrow" style={{ padding: "2rem 1rem" }}>
        <h1 className="page-title">History</h1>

        <form className="filters" onSubmit={e => e.preventDefault()}>
          <input placeholder="Search destination/origin" value={q} onChange={e=>setQ(e.target.value)} />
          <input type="number" min="0" placeholder="Min $" value={min} onChange={e=>setMin(e.target.value)} />
          <input type="number" min="0" placeholder="Max $" value={max} onChange={e=>setMax(e.target.value)} />
          <button type="button" className="btn" onClick={()=>{ setQ(""); setMin(""); setMax(""); }}>Reset</button>
        </form>

        <div className="cards" style={{ marginBottom: 12 }}>
          <div className="card">Trips: {data.length}</div>
          <div className="card">Total Spent: ${total.toFixed(2)}</div>
        </div>

        {data.length ? (
          <table className="table">
            <thead><tr><th>Date</th><th>From</th><th>To (Destination)</th><th>Time</th><th>Price ($)</th></tr></thead>
            <tbody>
              {data.map(h => (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>{h.from}</td>
                  <td>{h.to}</td>
                  <td>{h.time}</td>
                  <td>{Number(h.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No trips found.</p>}
      </main>
      <Footer />
    </div>
  );
}
