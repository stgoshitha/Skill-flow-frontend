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
    
    // Log all requests in development mode
    console.log(`Axios Request: ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    
    return config;
  },
  error => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => {
    console.log(`Axios Response from ${response.config.url}:`, response.status, response.data);
    return response;
  },
  error => {
    console.error('Axios response error:', error);
    console.error('Error details:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axios; 