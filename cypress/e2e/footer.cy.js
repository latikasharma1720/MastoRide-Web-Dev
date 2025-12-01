/* eslint-env cypress */
/* global cy */
/* eslint-disable no-undef */

/// <reference types="cypress" />

describe('Footer Component E2E Tests', () => {
  beforeEach(() => {
    // Visit the homepage to access the footer
    cy.visit('/', {
      onBeforeLoad(win) {
        win.sessionStorage.setItem(
          'mastoride_user',
          JSON.stringify({
            id: 'user-demo',
            name: 'Test User',
            email: 'test@pfw.edu',
            role: 'user',
          })
        );
      },
    });
    // Scroll to the last footer (main footer) using last()
    cy.get('footer.modern-footer').last().scrollIntoView();
  });

  describe('Footer Rendering', () => {
    it('renders footer element on the page', () => {
      cy.get('footer.modern-footer').should('exist');
    });

    it('footer is visible in viewport', () => {
      cy.get('footer.modern-footer').should('be.visible');
    });

    it('footer has correct CSS class', () => {
      cy.get('footer.modern-footer').last()
        .should('have.class', 'modern-footer');
    });
  });

  describe('Footer Sections', () => {
    it('displays Company section with heading', () => {
      cy.get('.footer-column').contains('h3', 'Company').should('exist');
    });

    it('displays Services section with heading', () => {
      cy.get('.footer-column').contains('h3', 'Services').should('exist');
    });

    it('displays Support section with heading', () => {
      cy.get('.footer-column').contains('h3', 'Support').should('exist');
    });

    it('displays Connect section with heading', () => {
      cy.get('.footer-column').contains('h3', 'Connect').should('exist');
    });

    it('has 4 footer columns', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('.footer-column').should('have.length', 4);
      });
    });
  });

  describe('Company Section Links', () => {
    it('displays About us link', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'About us').should('exist');
        });
    });

    it('About us link navigates to /about', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'About us')
            .should('have.attr', 'href', '/about')
            .click();
        });
      cy.url().should('include', '/about');
    });

    it('displays Our services link', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'Our services').should('exist');
        });
    });

    it('Our services link navigates to /services', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'Our services')
            .should('have.attr', 'href', '/services')
            .click();
        });
      cy.url().should('include', '/services');
    });

    it('displays Pricing link', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'Pricing').should('exist');
        });
    });

    it('Pricing link navigates to /pricing', () => {
      cy.get('.footer-column')
        .contains('Company')
        .parent()
        .within(() => {
          cy.contains('a', 'Pricing')
            .should('have.attr', 'href', '/pricing')
            .click();
        });
      cy.url().should('include', '/pricing');
    });
  });

  describe('Services Section Links', () => {
    it('displays Campus Rides link', () => {
      cy.get('.footer-column')
        .contains('Services')
        .parent()
        .within(() => {
          cy.contains('a', 'Campus Rides').should('exist');
        });
    });

    it('Campus Rides link navigates to /services', () => {
      cy.get('.footer-column')
        .contains('Services')
        .parent()
        .within(() => {
          cy.contains('a', 'Campus Rides')
            .should('have.attr', 'href', '/services')
            .click();
        });
      cy.url().should('include', '/services');
    });
  });

  describe('Support Section Links', () => {
    it('displays Contact us link', () => {
      cy.get('.footer-column')
        .contains('Support')
        .parent()
        .within(() => {
          cy.contains('a', 'Contact us').should('exist');
        });
    });

    it('Contact us link navigates to /contact', () => {
      cy.get('.footer-column')
        .contains('Support')
        .parent()
        .within(() => {
          cy.contains('a', 'Contact us')
            .should('have.attr', 'href', '/contact')
            .click();
        });
      cy.url().should('include', '/contact');
    });

    it('displays Help Center (FAQ) link', () => {
      cy.get('.footer-column')
        .contains('Support')
        .parent()
        .within(() => {
          cy.contains('a', 'Help Center').should('exist');
        });
    });

    it('Help Center link navigates to /faq', () => {
      cy.get('.footer-column')
        .contains('Support')
        .parent()
        .within(() => {
          cy.contains('a', 'Help Center')
            .should('have.attr', 'href', '/faq')
            .click();
        });
      cy.url().should('include', '/faq');
    });
  });

  describe('Social Media Icons', () => {
    it('displays Instagram social icon link', () => {
      cy.get('a[aria-label="Instagram"]').should('exist');
    });

    it('Instagram link has correct href', () => {
      cy.get('a[aria-label="Instagram"]')
        .should('have.attr', 'href', 'https://instagram.com')
        .and('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
    });

    it('Instagram link opens in new tab', () => {
      cy.get('a[aria-label="Instagram"]')
        .should('have.attr', 'target', '_blank')
        .and('have.attr', 'rel', 'noopener noreferrer');
    });

    it('displays Gmail email link', () => {
      cy.get('a[aria-label="Gmail"]').should('exist');
    });

    it('Gmail link has correct email address', () => {
      cy.get('a[aria-label="Gmail"]')
        .should('have.attr', 'href', 'mailto:contact@mastoride.com');
    });

    it('social icons have SVG elements', () => {
      cy.get('a[aria-label="Instagram"] svg').should('exist');
      cy.get('a[aria-label="Gmail"] svg').should('exist');
    });

    it('social icons are accessible with aria-labels', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('.social-icons').first()
          .within(() => {
            cy.get('[aria-label]').each(($el) => {
              cy.wrap($el).should('have.attr', 'aria-label');
            });
          });
      });
    });
  });

  describe('Footer Information', () => {
    it('displays copyright text', () => {
      cy.get('.footer-copyright').should('contain', '© 2025 MastoRide');
    });

    it('displays All Rights Reserved text', () => {
      cy.get('.footer-copyright').should('contain', 'All Rights Reserved');
    });

    it('displays location Fort Wayne, Indiana', () => {
      cy.get('.footer-location').should('contain', 'Fort Wayne, Indiana');
    });

    it('displays location icon', () => {
      cy.get('.footer-location svg').should('exist');
    });

    it('location info is visible', () => {
      cy.get('.footer-location').should('be.visible');
    });
  });

  describe('Footer Layout & Styling', () => {
    it('footer content has proper structure', () => {
      cy.get('.footer-content').should('exist');
    });

    it('footer grid exists and is visible', () => {
      cy.get('.footer-grid').should('exist').and('be.visible');
    });

    it('footer has copyright section', () => {
      cy.get('.footer-copyright').should('exist');
    });

    it('footer links are styled correctly', () => {
      cy.get('.footer-links a').should('have.length.at.least', 6);
    });

    it('footer headings have consistent styling', () => {
      cy.get('.footer-heading').should('have.length.at.least', 4);
    });
  });

  describe('Footer Link Accessibility', () => {
    it('all internal footer links are clickable', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('.footer-links a').each(($link) => {
          cy.wrap($link).scrollIntoView().should('be.visible');
        });
      });
    });

    it('footer links have proper href attributes', () => {
      cy.get('.footer-links a').each(($link) => {
        const href = $link.attr('href');
        expect(href).to.match(/^(\/|mailto:)/);
      });
    });

    it('social media links have proper rel attributes', () => {
      cy.get('.social-icons a[target="_blank"]').each(($link) => {
        cy.wrap($link).should('have.attr', 'rel', 'noopener noreferrer');
      });
    });
  });

  describe('Footer Responsiveness', () => {
    it('footer is visible on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.get('footer.modern-footer').should('be.visible');
      cy.get('.footer-grid').should('be.visible');
    });

    it('footer columns are visible on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.footer-column').should('be.visible');
    });

    it('footer displays correctly on desktop', () => {
      cy.viewport('macbook-15');
      cy.get('footer.modern-footer').should('be.visible');
      cy.get('.footer-grid').should('be.visible');
    });
  });

  describe('Footer Navigation Flow', () => {
    it('can navigate from footer to multiple pages', () => {
      cy.get('footer.modern-footer').last().within(() => {
        // Start at home
        cy.url().should('include', '/');

        // Navigate to About
        cy.contains('a', 'About us')
          .click();
        cy.url().should('include', '/about');

        // Go back and navigate to Services
        cy.go('back');
        cy.url().should('include', '/');
        cy.contains('a', 'Our services')
          .click();
        cy.url().should('include', '/services');

        // Go back and navigate to Contact
        cy.go('back');
        cy.url().should('include', '/');
        cy.contains('a', 'Contact us')
          .click();
        cy.url().should('include', '/contact');
      });
    });
  });

  describe('Footer Content Completeness', () => {
    it('all footer sections have links', () => {
      cy.get('.footer-column').each(($section) => {
        if ($section.text().includes('Company') ||
            $section.text().includes('Services') ||
            $section.text().includes('Support')) {
          cy.wrap($section).within(() => {
            cy.get('a').should('have.length.at.least', 1);
          });
        }
      });
    });

    it('Connect section displays social icons', () => {
      cy.get('.footer-column')
        .contains('Connect')
        .parent()
        .within(() => {
          cy.get('.social-icons').should('exist');
          cy.get('.social-icon').should('have.length.at.least', 2);
        });
    });
  });

  describe('Footer Interactive Elements', () => {
    it('links are keyboard accessible', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('.footer-links a').first().focus();
        cy.focused().should('exist');
      });
    });

    it('can tab through footer links', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('a').first().focus();
        cy.focused().should('exist');
        
        // Verify multiple links can be focused (simulating tab navigation)
        cy.get('a').eq(1).focus();
        cy.focused().should('exist');
      });
    });

    it('social icons are accessible via keyboard', () => {
      cy.get('footer.modern-footer').last().within(() => {
        cy.get('a[aria-label="Instagram"]').last().focus();
        cy.focused().should('have.attr', 'aria-label', 'Instagram');
      });
    });
  });
});
