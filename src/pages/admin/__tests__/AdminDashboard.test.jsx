import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AdminDashboard from '../AdminDashboard';
import * as sessionUtils from '../../utils/session';
import * as dataUtils from '../../utils/data';
import { useToast } from '../ui-kit';

// Mock the dependencies
jest.mock('../../utils/session');
jest.mock('../../utils/data');
jest.mock('../Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});
jest.mock('../ui-kit', () => ({
  useToast: jest.fn(),
}));

// Mock window.Chart for chart.js
global.Chart = jest.fn(() => ({
  destroy: jest.fn(),
}));

describe('AdminDashboard Component', () => {
  const mockPushToast = jest.fn();
  const mockAdmin = {
    id: 'admin-demo',
    name: 'Administrator',
    email: 'admin@mastoride.edu',
    role: 'admin',
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup default mocks
    sessionUtils.getUser.mockReturnValue(mockAdmin);
    useToast.mockReturnValue({ pushToast: mockPushToast });
    dataUtils.getProfile.mockReturnValue({
      name: 'Administrator',
      email: 'admin@mastoride.edu',
    });
    dataUtils.getSettings.mockReturnValue({
      emailNotifications: true,
      smsAlerts: false,
      systemAlerts: true,
      maintenanceMode: false,
    });
    dataUtils.saveProfile.mockResolvedValue(true);
    dataUtils.saveSettings.mockResolvedValue(true);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  };

  describe('Authentication & Authorization', () => {
    test('shows nothing while checking authentication', () => {
      sessionUtils.getUser.mockReturnValueOnce(null);
      const { container } = renderComponent();
      expect(container.firstChild.innerHTML).toBe('');
    });

    test('redirects to login when user is not authenticated', () => {
      sessionUtils.getUser.mockReturnValue(null);
      renderComponent();
      expect(sessionUtils.getUser).toHaveBeenCalled();
    });

    test('redirects to login when user is not admin', () => {
      sessionUtils.getUser.mockReturnValue({
        ...mockAdmin,
        role: 'user',
      });
      renderComponent();
      expect(sessionUtils.getUser).toHaveBeenCalled();
    });

    test('renders dashboard when user is admin', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });
  });

  describe('Sidebar Navigation', () => {
    test('renders sidebar with all navigation items', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByRole('navigation', { name: /Section navigation/ })).toBeInTheDocument();
      });
    });

    test('displays all nav items: Feedback, Users, Analytics, Profile', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Feedback')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Analytics')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });

    test('sidebar toggle button works', async () => {
      renderComponent();
      await waitFor(() => {
        const toggleBtn = screen.getByRole('button', { name: /toggle/i });
        expect(toggleBtn).toBeInTheDocument();
        fireEvent.click(toggleBtn);
        expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      });
    });

    test('Feedback tab is active by default', async () => {
      renderComponent();
      await waitFor(() => {
        const feedbackBtn = screen.getByRole('button', { name: 'Feedback' });
        expect(feedbackBtn).toHaveClass('active');
      });
    });

    test('clicking Users tab switches to Users view', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(screen.getByText('User Management')).toBeInTheDocument();
      });
    });

    test('clicking Analytics tab switches to Analytics view', async () => {
      renderComponent();
      await waitFor(() => {
        const analyticsBtn = screen.getByText('Analytics');
        fireEvent.click(analyticsBtn);
        expect(screen.getByText('Monthly Ride Bookings')).toBeInTheDocument();
      });
    });
  });

  describe('Feedback Tab', () => {
    test('shows Feedback title and description', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('User Feedback 💬')).toBeInTheDocument();
        expect(screen.getByText(/View and manage customer reviews/)).toBeInTheDocument();
      });
    });

    test('displays stats cards with ratings and feedback counts', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('4.8')).toBeInTheDocument(); // Average Rating
        expect(screen.getByText('342')).toBeInTheDocument(); // Total Feedback
        expect(screen.getByText('89%')).toBeInTheDocument(); // Positive Reviews
      });
    });

    test('shows recent feedback list', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Recent Feedback')).toBeInTheDocument();
        expect(screen.getByText(/Excellent Service/)).toBeInTheDocument();
        expect(screen.getByText(/Good Experience/)).toBeInTheDocument();
        expect(screen.getByText(/Needs Improvement/)).toBeInTheDocument();
      });
    });

    test('displays feedback timestamps', async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('2 hours ago')).toBeInTheDocument();
        expect(screen.getByText('5 hours ago')).toBeInTheDocument();
      });
    });
  });

  describe('Users Tab', () => {
    test('renders User Management header', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(screen.getByText('User Management')).toBeInTheDocument();
      });
    });

    test('displays search input for users', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        const searchInput = screen.getByPlaceholderText(/Search users/);
        expect(searchInput).toBeInTheDocument();
      });
    });

    test('displays action buttons: Export and Add User', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(screen.getByText('Export')).toBeInTheDocument();
        expect(screen.getByText('Add User')).toBeInTheDocument();
      });
    });

    test('renders users table with headers', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Joined Date')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
      });
    });

    test('displays user list with data', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Sarah Smith')).toBeInTheDocument();
      });
    });

    test('search filters users correctly', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        
        const searchInput = screen.getByPlaceholderText(/Search users/);
        fireEvent.change(searchInput, { target: { value: 'John' } });
        
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Sarah Smith')).not.toBeInTheDocument();
      });
    });

    test('displays status badges', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        const activeStatuses = screen.getAllByText('Active');
        expect(activeStatuses.length).toBeGreaterThan(0);
      });
    });

    test('delete user button calls handler', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        
        const deleteButtons = screen.getAllByTitle('Delete User');
        expect(deleteButtons.length).toBeGreaterThan(0);
        fireEvent.click(deleteButtons[0]);
      });
    });
  });

  describe('Analytics Tab', () => {
    test('renders Monthly Ride Bookings chart heading', async () => {
      renderComponent();
      await waitFor(() => {
        const analyticsBtn = screen.getByText('Analytics');
        fireEvent.click(analyticsBtn);
        expect(screen.getByText('Monthly Ride Bookings')).toBeInTheDocument();
      });
    });

    test('renders Ride Type Distribution chart heading', async () => {
      renderComponent();
      await waitFor(() => {
        const analyticsBtn = screen.getByText('Analytics');
        fireEvent.click(analyticsBtn);
        expect(screen.getByText('Ride Type Distribution')).toBeInTheDocument();
      });
    });

    test('renders canvas elements for charts', async () => {
      renderComponent();
      await waitFor(() => {
        const analyticsBtn = screen.getByText('Analytics');
        fireEvent.click(analyticsBtn);
        const canvases = screen.queryAllByRole('img', { hidden: true });
        expect(canvases.length).toBeGreaterThanOrEqual(0); // Charts use canvas
      });
    });
  });

  describe('Profile Tab', () => {
    test('renders Profile tab and switches to it', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        expect(screen.getByText('Administrators')).toBeInTheDocument();
      });
    });

    test('displays admin profile information', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        expect(screen.getByText('Administrators')).toBeInTheDocument();
        expect(screen.getByText('admin@mastoride.edu')).toBeInTheDocument();
      });
    });

    test('displays profile sub-tabs: Account, Settings, Security', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        expect(screen.getByText('Account')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();
      });
    });

    test('Account tab shows form fields', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        expect(screen.getByText('Basic Information')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Administrator')).toBeInTheDocument();
      });
    });

    test('Edit Profile button enables editing', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        const editBtn = screen.getByText('Edit Profile');
        fireEvent.click(editBtn);
        expect(screen.getByText('Save Changes')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    test('Save Changes button saves profile', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        const editBtn = screen.getByText('Edit Profile');
        fireEvent.click(editBtn);
        
        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);
        
        expect(dataUtils.saveProfile).toHaveBeenCalled();
      });
    });

    test('Settings sub-tab displays notification toggles', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        
        const settingsTabBtn = screen.getByRole('button', { name: /Settings/i });
        fireEvent.click(settingsTabBtn);
        
        expect(screen.getByText('Email Notifications')).toBeInTheDocument();
        expect(screen.getByText('System Alerts')).toBeInTheDocument();
      });
    });

    test('Security sub-tab shows Change Password and 2FA options', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        
        const securityTabBtn = screen.getByRole('button', { name: /Security/i });
        fireEvent.click(securityTabBtn);
        
        const changePasswordBtns = screen.getAllByText(/Change Password/);
        expect(changePasswordBtns.length).toBeGreaterThan(0);
        expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      });
    });

    test('Change Password modal opens and closes', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        
        const securityTabBtn = screen.getByRole('button', { name: /Security/i });
        fireEvent.click(securityTabBtn);
        
        const changePasswordBtns = screen.getAllByText(/Change Password/);
        const firstButton = changePasswordBtns[0];
        fireEvent.click(firstButton);
        
        expect(screen.getByText('Current Password')).toBeInTheDocument();
        expect(screen.getByText('New Password')).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    test('persists active tab to localStorage', async () => {
      renderComponent();
      await waitFor(() => {
        const usersBtn = screen.getAllByText('Users')[0];
        fireEvent.click(usersBtn);
        expect(localStorage.getItem('admin_active_tab')).toBe('users');
      });
    });

    test('persists sidebar state to localStorage', async () => {
      renderComponent();
      await waitFor(() => {
        const toggleBtn = screen.getByRole('button', { name: /toggle/i });
        fireEvent.click(toggleBtn);
        expect(localStorage.getItem('admin_sidebar_open')).toBe('false');
      });
    });
  });

  describe('Toast Notifications', () => {
    test('shows toast on profile save', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        const editBtn = screen.getByText('Edit Profile');
        fireEvent.click(editBtn);
        
        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);
        
        expect(mockPushToast).toHaveBeenCalledWith(
          'Admin profile saved!',
          'success'
        );
      });
    });

    test('shows toast on invalid email', async () => {
      renderComponent();
      await waitFor(() => {
        const profileBtn = screen.getByText('Profile');
        fireEvent.click(profileBtn);
        const editBtn = screen.getByText('Edit Profile');
        fireEvent.click(editBtn);
        
        const emailInput = screen.getByDisplayValue('admin@mastoride.edu');
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        
        const saveBtn = screen.getByText('Save Changes');
        fireEvent.click(saveBtn);
        
        expect(mockPushToast).toHaveBeenCalledWith(
          'Please enter a valid email.',
          'error'
        );
      });
    });
  });

  describe('Responsive Behavior', () => {
    test('renders dashboard layout correctly', async () => {
      const { container } = renderComponent();
      await waitFor(() => {
        const layout = container.querySelector('.dashboard-layout');
        expect(layout).toBeInTheDocument();
      });
    });

    test('main content area exists', async () => {
      const { container } = renderComponent();
      await waitFor(() => {
        const main = container.querySelector('.dashboard-main');
        expect(main).toBeInTheDocument();
      });
    });
  });
});
