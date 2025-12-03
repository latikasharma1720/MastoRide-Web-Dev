// API Configuration
// Central place for API base URL configuration

export const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

// Debug log to verify environment variable
console.log("🌐 API_BASE_URL configured as:", API_BASE_URL);
console.log("🔧 REACT_APP_BACKEND_URL env var:", process.env.REACT_APP_BACKEND_URL);

// Helper function for making API requests with consistent configuration
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_BASE_URL;
