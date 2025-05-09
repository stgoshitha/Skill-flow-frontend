import axios from 'axios';

// Updated to match the actual backend controller endpoint
const API_URL = '/users';

// Utility to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  const snakeCaseObj = {};
  Object.keys(obj).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    snakeCaseObj[snakeKey] = obj[key];
  });
  return snakeCaseObj;
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    // Convert camelCase properties to snake_case for backend
    const snakeCaseData = toSnakeCase(userData);
    console.log('Sending data in snake_case format:', snakeCaseData);
    
    // The backend expects JSON content with snake_case properties
    const response = await axios.post(API_URL, snakeCaseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Register error details:', error.response || error);
    throw error.response?.data || error.message;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user error details:', error.response || error);
    throw error.response?.data || error.message;
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    // Convert camelCase properties to snake_case for backend
    const snakeCaseData = toSnakeCase(userData);
    console.log('Sending update data in snake_case format:', snakeCaseData);
    
    const response = await axios.put(`${API_URL}/${userId}`, snakeCaseData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update user error details:', error.response || error);
    throw error.response?.data || error.message;
  }
}; 