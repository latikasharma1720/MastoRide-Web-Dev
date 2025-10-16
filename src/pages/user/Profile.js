import React from "react";

export default function Profile() {
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 234 567 890",
  };

  return (
    <div className="page-container">
      <h2>Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
    </div>
  );
}
