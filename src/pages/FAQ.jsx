// src/pages/FAQ.jsx
import React from "react";


export default function FAQ() {
  const faqs = [
    {
      question: "Who can use MastoRide?",
      answer:
        "Only verified PFW students with a valid .edu email can join MastoRide to ensure safety and trust within the community.",
    },
    {
      question: "Is there a rewards program?",
      answer:
        "Yes! Frequent riders earn points for each ride, which can be redeemed for perks like discounts and premium ride features.",
    },
    {
      question: "How do I join MastoRide?",
      answer:
        "Just sign up using your PFW email, verify your account, and you’re ready to start carpooling or offering rides.",
    },
    {
      question: "Is MastoRide free to use?",
      answer:
        "Yes, MastoRide is completely free for students. Optional premium features may be added later to enhance your experience.",
    },
    {
      question: "Can I report a problem or user?",
      answer:
        "Absolutely. You can report any issue directly from the app’s Support page or contact our help team for quick resolution.",
    },
  ];

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Have questions about MastoRide? We’ve got answers below.</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <details key={index} className="faq-item">
            <summary className="faq-question">{faq.question}</summary>
            <p className="faq-answer">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="faq-footer">
        Still have questions?{" "}
        <a href="/contact" className="contact-link">
          Contact Support
        </a>
      </div>
    </div>
  );
}
