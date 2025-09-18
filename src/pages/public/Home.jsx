// src/pages/public/Home.jsx
import Layout from "../../components/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="section">
        <div className="card" style={{textAlign:"center"}}>
          <h1 style={{fontSize:"2rem",marginBottom:"8px"}}>Campus rides for PFW students</h1>
          <p style={{marginBottom:"16px"}}>Book safe, affordable rides to off-campus locations with your @pfw.edu email.</p>
          <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
            <a className="btn" href="/signup">Get Started</a>
            <a className="btn secondary" href="/services">See Services</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
