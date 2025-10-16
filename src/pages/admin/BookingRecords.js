import React from "react";

export default function BookingRecords() {
  // Dummy booking data
  const records = [
    { id: 1, user: "John Doe", amount: 25, type: "Credit Card" },
    { id: 2, user: "Jane Smith", amount: 18, type: "Cash" },
    { id: 3, user: "Arjun K", amount: 22, type: "UPI" },
  ];

  const totalBookings = records.length;
  const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="mr-section container">
      <h2 className="mr-page-title">Booking & Payment Records</h2>

      <div className="mr-card">
        <p><strong>Total Bookings:</strong> {totalBookings}</p>
        <p><strong>Total Revenue:</strong> ${totalRevenue}</p>
      </div>

      <table className="mr-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.user}</td>
              <td>${r.amount}</td>
              <td>{r.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
