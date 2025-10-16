import React from "react";

export default function PreviousRides() {
  const rides = [
    { id: 1, route: "NYC → Boston", date: "2024-09-20", amount: "$120" },
    { id: 2, route: "LA → SF", date: "2024-10-03", amount: "$150" },
  ];

  return (
    <div className="page-container">
      <h2>Previous Rides</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Route</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>{ride.id}</td>
              <td>{ride.route}</td>
              <td>{ride.date}</td>
              <td>{ride.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
