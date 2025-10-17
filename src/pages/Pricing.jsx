export default function Pricing() {
  return (
    <div className="page-wrapper">
      <section class="pricing fade-in">
        <h1>Our Pricing Plans</h1>
        <p class="intro">Simple, transparent pricing made just for students.</p>

        <div class="pricing-grid">
          <div class="pricing-card fade-in-up">
            <h2>Basic Plan</h2>
            <p class="price">$5 <span>/ ride</span></p>
            <ul>
              <li>Campus to nearby destinations</li>
              <li>Available 8 AM – 10 PM</li>
              <li>Verified student drivers</li>
              <li>Chat support</li>
            </ul>
            <button>Choose Basic</button>
          </div>

          <div class="pricing-card premium fade-in-up">
            <h2>Premium Plan</h2>
            <p class="price">$20 <span>/ month</span></p>
            <ul>
              <li>Unlimited short rides</li>
              <li>Priority booking</li>
              <li>Exclusive weekend offers</li>
              <li>24/7 support</li>
            </ul>
            <button>Go Premium</button>
          </div>
        </div>
      </section>
    </div>
  );
}
