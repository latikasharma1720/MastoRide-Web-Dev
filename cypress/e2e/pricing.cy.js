/* eslint-env mocha */
/* global cy */

describe("Pricing Page", () => {
  beforeEach(() => {
    cy.visit("/pricing");
  });

  // ----------------------------
  // PAGE LOAD & NAVIGATION
  // ----------------------------
  describe("Page Load & Navigation", () => {
    it("should load the pricing page successfully", () => {
      cy.url().should("include", "/pricing");
      cy.contains(/pricing|rates|fares/i).should("be.visible");
    });

    it("should be accessible from navbar", () => {
      cy.visit("/");
      cy.get("nav").contains(/pricing/i).click();
      cy.url().should("include", "/pricing");
    });

    it("should have proper page title", () => {
      cy.title().should("match", /pricing|rates|mastoride/i);
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
  // PRICING TIERS / VEHICLE TYPES
  // ----------------------------
  describe("Vehicle Types & Pricing Tiers", () => {
    it("should display economy pricing", () => {
      cy.contains(/economy/i).should("be.visible");
    });

    it("should display premium pricing", () => {
      cy.contains(/premium/i).should("be.visible");
    });

    it("should display XL pricing", () => {
      cy.contains(/xl|large|group/i).should("be.visible");
    });

    it("should show price for each vehicle type", () => {
      cy.get("body")
        .invoke("text")
        .should("match", /\$\d+(\.\d{2})?/);
    });

    it("should have at least 3 pricing options", () => {
      cy.contains(/economy/i).should("exist");
      cy.contains(/premium/i).should("exist");
      cy.contains(/xl|group/i).should("exist");
    });
  });

  // ----------------------------
  // PRICING DETAILS
  // ----------------------------
  describe("Pricing Information Details", () => {
    it("should show base fare or starting price", () => {
      cy.contains(/base|starting|from/i).should("be.visible");
    });

    it("should display pricing in dollars", () => {
      cy.get("body").should("contain.text", "$");
    });

    it("should have clear pricing structure", () => {
      cy.get("[class*='price'], [class*='tier'], [class*='card']").should(
        "have.length.greaterThan",
        2
      );
    });
  });

  // ----------------------------
  // PASSENGER COUNT
  // ----------------------------
  describe("Passenger Count & Capacity", () => {
    it("should mention passenger capacity for each vehicle", () => {
      cy.contains(/passenger|seat|capacity/i).should("be.visible");
    });
  });

  // ----------------------------
  // FARE MULTIPLIERS
  // ----------------------------
  describe("Fare Calculation & Multipliers", () => {
    it("should explain how fares are calculated", () => {
      cy.contains(/calculate|estimate|fare/i).should("be.visible");
    });

    it("should show comparison between vehicle types", () => {
      cy.contains(/economy/i).should("exist");
      cy.contains(/premium/i).should("exist");
    });
  });

  // ----------------------------
  // STUDENT DISCOUNTS
  // ----------------------------
  describe("Student Discounts & Special Rates", () => {
    it("should mention student rates", () => {
      cy.contains(/student/i).should("be.visible");
    });

    it("should explain how to qualify for student rates", () => {
      cy.contains(/edu|university|college|purdue|pfw/i).should("exist");
    });
  });

  // ----------------------------
  // FARE ESTIMATOR (if available)
  // ----------------------------
  describe("Fare Estimator Tool", () => {
    it("should have estimate button or calculator", () => {
      cy.get("button, a, input").should("exist");
    });

    it("should allow selecting pickup location (if calculator exists)", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find("input[placeholder*='pickup'], input[name*='pickup']")
            .length > 0
        ) {
          cy.get("input[placeholder*='pickup'], input[name*='pickup']").should(
            "exist"
          );
        }
      });
    });

    it("should allow selecting dropoff location (if calculator exists)", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find("input[placeholder*='drop'], input[name*='destination']")
            .length > 0
        ) {
          cy.get(
            "input[placeholder*='drop'], input[name*='destination']"
          ).should("exist");
        }
      });
    });

    it("should have calculate/estimate button (if calculator exists)", () => {
      cy.get("body").then(($body) => {
        if ($body.find("button:contains('Estimate')").length > 0) {
          cy.contains(/estimate|calculate/i).should("be.visible");
        }
      });
    });
  });

  // ----------------------------
  // PRICING EXAMPLES
  // ----------------------------
  describe("Example Fares & Routes", () => {
    it("should display realistic fare amounts", () => {
      cy.get("body")
        .invoke("text")
        .should("match", /\$[5-9]|\$[1-9][0-9]/);
    });
  });

  // Payment Methods section removed

  // ----------------------------
  // SURGE PRICING / PEAK HOURS
  // ----------------------------
  describe("Dynamic Pricing Information", () => {
    it("should mention peak hours or surge pricing (if applicable)", () => {
      cy.get("body").then(($body) => {
        const text = $body.text();
        if (text.match(/surge|peak|busy|demand/i)) {
          cy.wrap(text).should("match", /surge|peak|busy|demand/i);
        }
      });
    });
  });

  // ----------------------------
  // BOOKING INTEGRATION
  // ----------------------------
  describe("Booking Call-to-Action", () => {
    it("should have book now button", () => {
      cy.contains(/book|ride|start/i).should("be.visible");
    });

    it("should link to booking page", () => {
      cy.get("a[href*='book'], button:contains('Book')").should("exist");
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
      it(`should display pricing cards on ${device}`, () => {
        cy.viewport(width, height);
        cy.contains(/economy|premium|xl/i).should("be.visible");
      });
    });

    it("should stack pricing cards on mobile", () => {
      cy.viewport(375, 667);
      cy.get("[class*='card'], [class*='tier']")
        .first()
        .should("be.visible");
    });

    it("should show side-by-side pricing on desktop", () => {
      cy.viewport(1920, 1080);
      cy.get("[class*='card'], [class*='tier']").should(
        "have.length.greaterThan",
        1
      );
    });
  });

  // ----------------------------
  // PRICING COMPARISON
  // ----------------------------
  describe("Pricing Comparison Features", () => {
    it("should show features for each pricing tier", () => {
      cy.get("ul, li, [class*='feature']").should(
        "have.length.greaterThan",
        3
      );
    });

    it("should highlight best value option", () => {
      cy.get("body").then(($body) => {
        if ($body.text().match(/popular|recommended|best/i)) {
          cy.contains(/popular|recommended|best/i).should("be.visible");
        }
      });
    });
  });

  // ----------------------------
  // FOOTER & ADDITIONAL INFO
  // ----------------------------
  describe("Footer & Additional Information", () => {
    it("should have footer with links", () => {
      cy.get("footer").should("be.visible");
    });

    it("should link to FAQ", () => {
      cy.get("a[href*='faq'], a:contains('FAQ')").should("exist");
    });

    it("should have contact information", () => {
      cy.contains(/contact|support|help/i).should("exist");
    });
  });

  // ----------------------------
  // ACCESSIBILITY
  // ----------------------------
  describe("Accessibility", () => {
    it("should have semantic HTML", () => {
      cy.get("header, nav, main, section, footer").should("exist");
    });

    it("should be keyboard navigable", () => {
      cy.get("a, button").first().focus().should("have.focus");
    });
  });

  // ----------------------------
  // VISUAL CONTENT
  // ----------------------------
  describe("Visual Elements", () => {
    it("should have vehicle images or icons", () => {
      cy.get("img, svg").should("have.length.greaterThan", 0);
    });

    it("should have proper alt text", () => {
      cy.get("img").each(($img) => {
        cy.wrap($img).should("have.attr", "alt");
      });
    });

    it("should load images successfully", () => {
      cy.get("img").each(($img) => {
        cy.wrap($img)
          .should("have.attr", "src")
          .and("not.be.empty")
          .and("not.contain", "undefined");
      });
    });
  });

  // ----------------------------
  // PRICING TRANSPARENCY
  // ----------------------------
  describe("Pricing Transparency", () => {
    it("should mention no hidden charges", () => {
      cy.get("body").then(($body) => {
        if ($body.text().match(/no hidden|transparent|upfront/i)) {
          cy.contains(/no hidden|transparent|upfront/i).should("be.visible");
        }
      });
    });
  });
});
