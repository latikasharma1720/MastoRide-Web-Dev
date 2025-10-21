// src/pages/Services.jsx
import React from "react";


export default function Services() {
  return (
    <div className="services-page">
      <div className="services-header">
        <h2>Our Services</h2>
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
    </div>
  );
}
