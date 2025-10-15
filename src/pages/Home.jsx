import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-only-gallery">
      <div className="home-content">
        {/* Animated Image Gallery */}
        <div className="hero-gallery">
          <figure className="gallery-card">
            <img
              src="/assets/home/ride1.jpeg"
              alt="Campus Ride"
            />
          </figure>

          <figure className="gallery-card">
            <img
              src="/assets/home/ride2.jpeg"
              alt="Affordable Ride"
            />
          </figure>

          <figure className="gallery-card">
            <img
              src="/assets/home/ride3.jpeg"
              alt="Safe Student Commute"
            />
          </figure>
        </div>

        {/* Welcome Message */}
        <h1 className="welcome-message">
          Welcome to the place for saving more on rides in Fort Wayne! <br />
          Exclusive to PFW students.
        </h1>

        {/* CTA Button */}
        <Link to="/signup" className="join-btn">
          Join for Free
        </Link>
      </div>
    </main>
  );
}
