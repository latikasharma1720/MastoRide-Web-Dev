import React from "react";

export default function Pricing() {
  const plans = [
    {
      name: "Basic Plan",
      price: "$5",
      period: "/ ride",
      features: [
        "Campus to nearby destinations",
        "Available 8 AM – 10 PM",
        "Verified student drivers",
        "Chat support",
      ],
      button: "Choose Basic",
      premium: false,
    },
    {
      name: "Premium Plan",
      price: "$20",
      period: "/ month",
      features: [
        "Unlimited short rides",
        "Priority booking",
        "Exclusive weekend offers",
        "24/7 support",
      ],
      button: "Go Premium",
      premium: true,
    },
  ];

  return (
    <div className="pricing-section">
      <h2>Our Pricing Plans</h2>
      <p className="intro">Simple, transparent pricing made just for students.</p>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card ${plan.premium ? "premium" : ""}`}
          >
            <h2>{plan.name}</h2>
            <p className="price">
              {plan.price} <span>{plan.period}</span>
            </p>
            <ul>
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button>{plan.button}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
