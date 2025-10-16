import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [showBackButton, setShowBackButton] = useState(false);
  const backButtonRef = useRef(null);
  const isScrollingRef = useRef(false);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    // Fauna-style smooth scroll animations
    const observerOptions = {
      threshold: 0.7,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          
          // Show/hide back button based on which section is visible
          if (entry.target.classList.contains('hero-section')) {
            setShowBackButton(false);
            // Also hide via direct DOM manipulation for instant effect
            if (backButtonRef.current) {
              backButtonRef.current.style.opacity = '0';
              backButtonRef.current.style.visibility = 'hidden';
              backButtonRef.current.style.pointerEvents = 'none';
            }
          } else if (entry.target.classList.contains('home-safety') || 
                     entry.target.classList.contains('home-affordable')) {
            setShowBackButton(true);
            // Show via direct DOM manipulation
            if (backButtonRef.current) {
              backButtonRef.current.style.opacity = '1';
              backButtonRef.current.style.visibility = 'visible';
              backButtonRef.current.style.pointerEvents = 'auto';
            }
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    // Observe all sections
    document.querySelectorAll(".fullpage-section").forEach((el) => {
      observer.observe(el);
    });

    // Prevent manual scrolling - LOCK SCROLL
    const mainContainer = document.querySelector('.home-fullpage');
    mainContainerRef.current = mainContainer;
    
    const preventWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (mainContainer) {
      mainContainer.addEventListener('wheel', preventWheel, { passive: false });
      mainContainer.addEventListener('touchmove', preventScroll, { passive: false });
      
      mainContainer.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
          e.preventDefault();
        }
      });
    }

    return () => {
      observer.disconnect();
      if (mainContainer) {
        mainContainer.removeEventListener('wheel', preventWheel);
        mainContainer.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  // Smooth scroll to hero section (go back) - INSTANT HIDE VIA DOM
  const scrollToHero = () => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    
    // INSTANT hide via direct DOM manipulation
    if (backButtonRef.current) {
      backButtonRef.current.style.opacity = '0';
      backButtonRef.current.style.visibility = 'hidden';
      backButtonRef.current.style.pointerEvents = 'none';
      backButtonRef.current.style.transition = 'none';
    }
    
    // Update React state
    setShowBackButton(false);
    
    // Start scroll
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  // Smooth scroll to safety section
  const scrollToSafety = () => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    
    const safetySection = document.querySelector('.home-safety');
    if (safetySection) {
      safetySection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Show button after scroll animation starts
    setTimeout(() => {
      setShowBackButton(true);
      if (backButtonRef.current) {
        backButtonRef.current.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        backButtonRef.current.style.opacity = '1';
        backButtonRef.current.style.visibility = 'visible';
        backButtonRef.current.style.pointerEvents = 'auto';
      }
    }, 300);
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  // Smooth scroll to affordable section
  const scrollToAffordable = () => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;
    
    const affordableSection = document.querySelector('.home-affordable');
    if (affordableSection) {
      affordableSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  return (
    <>
      {/* Back to top button - controlled by state AND ref */}
      <button 
        ref={backButtonRef}
        className={`back-to-top-btn ${showBackButton ? 'show' : ''}`}
        onClick={scrollToHero}
        aria-label="Back to top"
        style={{ 
          opacity: showBackButton ? 1 : 0,
          visibility: showBackButton ? 'visible' : 'hidden',
          pointerEvents: showBackButton ? 'auto' : 'none'
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <main className="home-fullpage">
        {/* -------- Hero Section (Full Page) -------- */}
        <section className="fullpage-section hero-section">
          <div className="hero-content-center">
            <div className="hero-gallery">
              <figure className="gallery-card animate-on-scroll" style={{ "--delay": "0.1s" }}>
                <img src="/assets/home/ride1.jpeg" alt="Friendly pickup" />
              </figure>
              <figure className="gallery-card animate-on-scroll" style={{ "--delay": "0.2s" }}>
                <img src="/assets/home/ride2.jpeg" alt="Student ride" />
              </figure>
              <figure className="gallery-card animate-on-scroll" style={{ "--delay": "0.3s" }}>
                <img src="/assets/home/ride3.jpeg" alt="Safe drop-off" />
              </figure>
            </div>

            <h1 className="welcome-message animate-on-scroll" style={{ "--delay": "0.4s" }}>
              Welcome - for saving more on rides in Fort Wayne!
              <br />
              Exclusive to PFW students.
            </h1>

            <Link to="/signup" className="join-btn animate-on-scroll" style={{ "--delay": "0.5s" }}>
              Join for Free
            </Link>
          </div>

          {/* Scroll button */}
          <button 
            className="scroll-indicator animate-on-scroll" 
            style={{ "--delay": "0.6s" }}
            onClick={scrollToSafety}
            aria-label="Scroll to next section"
          >
            <svg 
              width="32"
              height="32"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </section>

        {/* -------- Safety Section (Full Page) -------- */}
        <section className="fullpage-section home-safety" aria-labelledby="safetyTitle">
          <div className="section-content-center">
            <div className="content-grid">
              <div className="content-visual animate-on-scroll" style={{ "--delay": "0s" }}>
                <img
                  src="/assets/home/safety2.png"
                  alt="Student using safety features"
                  loading="lazy"
                />
              </div>

              <div className="content-text animate-on-scroll" style={{ "--delay": "0.2s" }}>
                <h2 id="safetyTitle">Safety, simplified</h2>
                <p>
                  Turn on and schedule your safety preferences—like sharing trip
                  status and arrival reminders—right from the MastoRide app.
                </p>
                <div className="content-actions">
                  <Link to="/about" className="btn-dark">Learn more</Link>
                  <Link to="/pricing" className="btn-outline">See prices</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Second scroll button */}
          <button 
            className="scroll-indicator animate-on-scroll" 
            style={{ "--delay": "0.4s" }}
            onClick={scrollToAffordable}
            aria-label="Scroll to affordable section"
          >
            <svg 
              width="32"
              height="32"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </section>

        {/* -------- Affordable Section (Full Page) -------- */}
        <section className="fullpage-section home-affordable" aria-labelledby="affordTitle">
          <div className="section-content-center">
            <div className="content-grid">
              <div className="content-visual animate-on-scroll" style={{ "--delay": "0s" }}>
                <video
                  className="afford-video"
                  src={`${process.env.PUBLIC_URL}/assets/home/affordable3.mp4`}
                  poster={`${process.env.PUBLIC_URL}/assets/home/safety2.png`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                >
                  <source src={`${process.env.PUBLIC_URL}/assets/home/affordable3.mp4`} type="video/mp4" />
                </video>
              </div>

              <div className="content-text animate-on-scroll" style={{ "--delay": "0.2s" }}>
                <h2 id="affordTitle">Affordable Rides, Anytime</h2>
                <p>
                  MastoRide connects you with verified drivers at budget-friendly
                  rates, offering discounts for daily commuters and group rides.
                  Ride more, spend less.
                </p>
                <div className="content-actions">
                  <Link to="/pricing" className="btn-dark">View Plans</Link>
                  <Link to="/pricing#compare" className="btn-outline">Compare Rates</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}