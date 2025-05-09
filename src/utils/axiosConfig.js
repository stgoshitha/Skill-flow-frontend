import axios from 'axios';

// Set the base URL for all axios requests
// When using Vite proxy, we use relative URLs instead of absolute URLs
axios.defaults.baseURL = '';

// Add request interceptor for default headers
axios.interceptors.request.use(
  config => {
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios; 