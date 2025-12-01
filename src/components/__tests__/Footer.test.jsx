import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Footer from '../Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  test('renders footer element', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  test('renders Company section with correct links', () => {
    renderFooter();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('About us')).toBeInTheDocument();
    expect(screen.getByText('Our services')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  test('renders Services section', () => {
    renderFooter();
    expect(screen.getByText('Services')).toBeInTheDocument();
    const campusRidesLinks = screen.getAllByText('Campus Rides');
    expect(campusRidesLinks.length).toBeGreaterThan(0);
  });

  test('renders Support section with correct links', () => {
    renderFooter();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
  });

  test('renders Connect section', () => {
    renderFooter();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  test('renders social media icons with correct links', () => {
    renderFooter();
    
    // Check Instagram link
    const instagramLink = screen.getByLabelText('Instagram');
    expect(instagramLink).toHaveAttribute('href', 'https://instagram.com');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Check Gmail/Email link
    const emailLink = screen.getByLabelText('Gmail');
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@mastoride.com');
  });

  test('renders copyright information', () => {
    renderFooter();
    expect(screen.getByText(/© 2025 MastoRide • All Rights Reserved/)).toBeInTheDocument();
  });

  test('renders location information', () => {
    renderFooter();
    expect(screen.getByText('Fort Wayne, Indiana')).toBeInTheDocument();
  });

  test('all navigation links have correct href attributes', () => {
    renderFooter();
    
    const aboutLink = screen.getByText('About us').closest('a');
    expect(aboutLink).toHaveAttribute('href', '/about');

    const servicesLink = screen.getAllByText('Our services')[0].closest('a');
    expect(servicesLink).toHaveAttribute('href', '/services');

    const pricingLink = screen.getByText('Pricing').closest('a');
    expect(pricingLink).toHaveAttribute('href', '/pricing');

    const contactLink = screen.getByText('Contact us').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');

    const faqLink = screen.getByText('Help Center').closest('a');
    expect(faqLink).toHaveAttribute('href', '/faq');
  });

  test('social media icons are accessible', () => {
    renderFooter();
    
    const socialIcons = screen.getAllByRole('link').filter(link => {
      return link.getAttribute('aria-label') === 'Instagram' || 
             link.getAttribute('aria-label') === 'Gmail';
    });
    
    expect(socialIcons.length).toBeGreaterThan(0);
    
    socialIcons.forEach(icon => {
      expect(icon).toHaveAttribute('aria-label');
    });
  });

  test('footer contains SVG icons for location', () => {
    const { container } = renderFooter();
    const svgs = container.querySelectorAll('svg');
    
    // Should have SVGs for social icons + location icon
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  test('footer grid structure exists', () => {
    const { container } = renderFooter();
    const footerGrid = container.querySelector('.footer-grid');
    
    expect(footerGrid).toBeInTheDocument();
  });

  test('all footer columns are rendered', () => {
    const { container } = renderFooter();
    const footerColumns = container.querySelectorAll('.footer-column');
    
    // Should have 4 columns: Company, Services, Support, Connect
    expect(footerColumns.length).toBe(4);
  });

  test('footer links open in new tab when appropriate', () => {
    renderFooter();
    
    const instagramLink = screen.getByLabelText('Instagram');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
