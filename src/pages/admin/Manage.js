import React from "react";

export default function Manage() {
  // Dummy data for now
  const stats = {
    users: 128,
    rides: 342,
  };

  return (
    <>
      <div className="admin-dashboard mr-section container">
        <h2 className="mr-page-title">Admin Dashboard</h2>

        <div className="mr-grid">
          <div className="mr-card stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.users}</p>
          </div>

          <div className="mr-card stat-card">
            <h3>Total Rides</h3>
            <p className="stat-value">{stats.rides}</p>
          </div>
        </div>
      </div>
    </>
  );
}
