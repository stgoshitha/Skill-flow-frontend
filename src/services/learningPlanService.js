import axios from '../utils/axiosConfig';

// Utility to convert camelCase to snake_case if needed
const toSnakeCase = (obj) => {
  const snakeCaseObj = {};
  Object.keys(obj).forEach(key => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    snakeCaseObj[snakeKey] = obj[key];
  });
  return snakeCaseObj;
};

// Get all learning plans
export const getAllLearningPlans = async () => {
  try {
    console.log('Making API request to:', `${axios.defaults.baseURL}/learning-plan`);
    const response = await axios.get('/learning-plan');
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error.response?.data || error.message;
  }
};

// Get learning plan by ID
export const getLearningPlanById = async (planId) => {
  try {
    console.log('Making API request to:', `${axios.defaults.baseURL}/learning-plan/${planId}`);
    const response = await axios.get(`/learning-plan/${planId}`);
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching learning plan:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error.response?.data || error.message;
  }
};

// Create a new learning plan
export const createLearningPlan = async (userId, planData) => {
  try {
    // Handle different user object structures
    const actualUserId = typeof userId === 'object' ? userId.id || userId.userId : userId;
    
    console.log('Creating learning plan with userId:', userId);
    console.log('Actual user ID being used:', actualUserId);
    console.log('Plan data:', planData);
    console.log('Making API request to:', `${axios.defaults.baseURL}/learning-plan?userId=${actualUserId}`);
    
    const response = await axios.post(`/learning-plan?userId=${actualUserId}`, planData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API response for create:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating learning plan:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    throw error.response?.data || error.message;
  }
};

// Update a learning plan
export const updateLearningPlan = async (planId, planData) => {
  try {
    const response = await axios.put(`/learning-plan/${planId}`, planData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating learning plan:', error.response || error);
    throw error.response?.data || error.message;
  }
};

// Delete a learning plan
export const deleteLearningPlan = async (planId) => {
  try {
    await axios.delete(`/learning-plan/${planId}`);
    return true;
  } catch (error) {
    console.error('Error deleting learning plan:', error.response || error);
    throw error.response?.data || error.message;
  }
};

// Get all posts (needed for selecting posts to include in learning plans)
export const getAllPosts = async () => {
  try {
    const response = await axios.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error.response || error);
    throw error.response?.data || error.message;
  }
};