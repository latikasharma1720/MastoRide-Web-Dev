import React, { useState } from "react";
import UserNavbar from "../../components/UserNavbar";

export default function Dashboard() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Ride booked from ${from} to ${to}!`);
  };

  return (
    <>
      <UserNavbar />
      <div className="user-page">
        <h2 className="mr-page-title">User Dashboard</h2>

        <div className="mr-book-ride">
          <h3>Book a Ride</h3>
          <form onSubmit={handleSubmit} className="mr-form">
            <div className="mr-form-group">
              <label htmlFor="from">From</label>
              <input
                id="from"
                type="text"
                placeholder="Enter pickup location"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>

            <div className="mr-form-group">
              <label htmlFor="to">To</label>
              <input
                id="to"
                type="text"
                placeholder="Enter drop-off location"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="mr-btn">
              Book Ride
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
