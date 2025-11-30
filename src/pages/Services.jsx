// src/pages/Services.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper">
      <div className="services-header">
        <h2 className="welcome">Our Services</h2>
        <p className="intro">
          Affordable, safe, and reliable rides — built exclusively for Purdue
          University students. 🚗
        </p>
      </div>

      <div className="service-grid">
        <div className="service-card fade-in-up">
          <h3>🚖 Campus to Home</h3>
          <p>
            Quick and convenient rides from campus to your home or nearby
            destinations, available 24/7.
          </p>
        </div>
        <div className="service-card fade-in-up">
          <h3>🎓 Event Rides</h3>
          <p>
            Group rides to university events, sports matches, or meetups with
            verified PFW student drivers.
          </p>
        </div>
        <div className="service-card fade-in-up">
          <h3>🛍️ Errand Runs</h3>
          <p>
            Need to run errands or grab groceries? Get short-distance rides at
            affordable rates.
          </p>
        </div>
        <div className="service-card fade-in-up">
          <h3>🚌 Out-of-Town Trips</h3>
          <p>
            Heading out of the city? Enjoy safe long-distance travel with
            pre-scheduled, shared rides.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="cta-button" 
          onClick={() => navigate('/user/book-ride')}
          style={{
            padding: '12px 32px',
            fontSize: '1.1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Book a Ride Now
        </button>
      </div>
    </div>
  );
}