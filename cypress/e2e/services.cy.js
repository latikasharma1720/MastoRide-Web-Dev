/* eslint-env mocha */
/* global cy */

describe("Services Page", () => {
  beforeEach(() => {
    cy.visit("/services");
  });

  // ----------------------------
  // PAGE LOAD & NAVIGATION
  // ----------------------------
  describe("Page Load & Navigation", () => {
    it("should load the services page successfully", () => {
      cy.url().should("include", "/services");
      cy.contains(/services|what we offer/i).should("be.visible");
    });

    it("should be accessible from navbar", () => {
      cy.visit("/");
      cy.get("nav").contains(/services/i).click();
      cy.url().should("include", "/services");
    });

    it("should have proper page title", () => {
      cy.title().should("match", /services|mastoride/i);
    });

    it("should load without console errors", () => {
      cy.on("window:console", (log) => {
        if (log.type === "error") {
          throw new Error(`Console error: ${log.message}`);
        }
      });
    });
  });

  // ----------------------------
  // SERVICES CONTENT
  // ----------------------------
  describe("Services List & Content", () => {
    it("should display ride-sharing service", () => {
      cy.contains(/ride.?sharing|shared rides/i).should("be.visible");
    });

    it("should display on-campus transportation", () => {
      cy.contains(/on.?campus|campus/i).should("be.visible");
    });

    it("should display service descriptions", () => {
      cy.get("p, div, section").should("have.length.greaterThan", 3);
    });

    it("should have service cards or sections", () => {
      cy.get("[class*='service'], [class*='card'], section").should(
        "have.length.greaterThan",
        2
      );
    });
  });

  // ----------------------------
  // VEHICLE TYPES
  // ----------------------------
  describe("Vehicle Types & Classes", () => {
    it("should mention economy service", () => {
      cy.get("body").should("contain.text", "Economy");
    });

    it("should mention premium service", () => {
      cy.get("body").should("contain.text", "Premium");
    });

    it("should mention XL or group service", () => {
      cy.contains(/xl|group|large/i).should("exist");
    });
  });

  // ----------------------------
  // SERVICE FEATURES
  // ----------------------------
  describe("Service Features & Benefits", () => {
    it("should mention safety features", () => {
      cy.contains(/safe|safety|secure/i).should("be.visible");
    });

    it("should mention affordability", () => {
      cy.contains(/affordable|cheap|budget|low cost/i).should("be.visible");
    });

    it("should mention convenience", () => {
      cy.contains(/convenient|easy|simple/i).should("be.visible");
    });

    it("should mention student-specific features", () => {
      cy.contains(/student/i).should("be.visible");
    });
  });

  // ----------------------------
  // CALL-TO-ACTION
  // ----------------------------
  describe("Call-to-Action Elements", () => {
    it("should have book now button or link", () => {
      cy.contains(/book|ride|start/i).should("be.visible");
    });
  });

  // ----------------------------
  // RESPONSIVE DESIGN
  // ----------------------------
  describe("Responsive Design", () => {
    const viewports = [
      { device: "mobile", width: 375, height: 667 },
      { device: "tablet", width: 768, height: 1024 },
      { device: "desktop", width: 1920, height: 1080 },
    ];

    viewports.forEach(({ device, width, height }) => {
      it(`should display correctly on ${device}`, () => {
        cy.viewport(width, height);
        cy.contains(/services/i).should("be.visible");
      });
    });

    it("should have mobile-friendly navigation", () => {
      cy.viewport(375, 667);
      cy.get("nav").should("be.visible");
    });

    it("should stack services vertically on mobile", () => {
      cy.viewport(375, 667);
      cy.get("[class*='service'], section").first().should("be.visible");
    });
  });

  // ----------------------------
  // PRICING & RATES
  // ----------------------------
  describe("Pricing & Rates", () => {
    it("should have link to full pricing details", () => {
      cy.get("a[href*='pricing'], a:contains('Pricing')").should("exist");
    });
  });

  // ----------------------------
  // IMAGES & MEDIA
  // ----------------------------
  describe("Visual Content", () => {
    it("should have service images or icons", () => {
      cy.get("img, svg").should("have.length.greaterThan", 0);
    });

    it("should have proper alt text for images", () => {
      cy.get("img").each(($img) => {
        cy.wrap($img).should("have.attr", "alt");
      });
    });

    it("should load images successfully", () => {
      cy.get("img").each(($img) => {
        cy.wrap($img).should("have.attr", "src").and("not.be.empty");
      });
    });
  });

  // ----------------------------
  // FOOTER & LINKS
  // ----------------------------
  describe("Footer & Additional Links", () => {
    it("should have footer", () => {
      cy.get("footer").should("be.visible");
    });

    it("should have contact information", () => {
      cy.contains(/contact|email|phone/i).should("exist");
    });

    it("should link to other pages", () => {
      cy.get("a").should("have.length.greaterThan", 5);
    });
  });

  // ----------------------------
  // ACCESSIBILITY
  // ----------------------------
  describe("Accessibility", () => {
    it("should have semantic HTML elements", () => {
      cy.get("header, nav, main, section, footer").should("exist");
    });

    it("should have aria labels for icons", () => {
      cy.get("[aria-label], [role]").should("exist");
    });

    it("should be keyboard navigable", () => {
      cy.get("a, button").first().focus().should("have.focus");
    });
  });

  // ----------------------------
  // SERVICE DETAILS
  // ----------------------------
  describe("Detailed Service Information", () => {
    it("should explain how ride-sharing works", () => {
      cy.contains(/share|multiple passengers|cost.?effective/i).should(
        "exist"
      );
    });

    it("should explain airport shuttle schedules", () => {
      cy.contains(/schedule|timing|departure/i).should("exist");
    });

    it("should explain on-campus coverage", () => {
      cy.contains(/campus|buildings|locations/i).should("exist");
    });
  });

  // ----------------------------
  // BUSINESS HOURS
  // ----------------------------
  describe("Service Availability", () => {
    it("should mention service hours", () => {
      cy.get("body").invoke("text").should("match", /24\/7|hours|available|operating/i);
    });

    it("should mention service area", () => {
      cy.contains(/area|zone|coverage|fort wayne|purdue/i).should("exist");
    });
  });
});
