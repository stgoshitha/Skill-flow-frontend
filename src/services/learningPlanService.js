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
    
    // Normalize the plan data
    const planData = response.data;
    
    // Ensure postIds is an array of numbers
    if (planData && planData.postIds) {
      if (Array.isArray(planData.postIds)) {
        // Convert string IDs to numbers if needed
        planData.postIds = planData.postIds.map(id => 
          typeof id === 'string' ? Number(id) : id
        );
      } else if (typeof planData.postIds === 'string') {
        // Handle case where postIds might be a comma-separated string
        planData.postIds = planData.postIds.split(',')
          .map(id => id.trim())
          .filter(id => id)
          .map(id => Number(id));
      } else {
        // Fallback to empty array
        planData.postIds = [];
      }
    } else {
      planData.postIds = [];
    }
    
    console.log('Normalized plan data:', planData);
    return planData;
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
    // Ensure userId is a number
    const actualUserId = Number(userId);
    
    // Format the resources to ensure it's an array
    const resources = Array.isArray(planData.resources)
      ? planData.resources.filter(r => r && r.trim() !== '')
      : [planData.resources].filter(Boolean);
    
    // Format postIds to ensure it's an array of numbers
    const postIds = Array.isArray(planData.postIds)
      ? planData.postIds.map(id => Number(id))
      : [];
    
    // Prepare the request payload
    const payload = {
      title: planData.title,
      description: planData.description,
      resources: resources,
      timeLine: planData.timeLine,
      postIds: postIds,
      progress: planData.progress || 0
    };
    
    console.log('Creating learning plan for user:', actualUserId);
    console.log('Learning plan payload:', payload);
    
    // Simple formatted URL
    const url = `/learning-plan?userId=${actualUserId}`;
    console.log('API request URL:', url);
    
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Learning plan created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating learning plan:', error);
    throw error;
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
  // List of possible API endpoints to try
  const possibleEndpoints = [
    '/posts',
    '/api/posts',
    '/posts/all',
    '/post',
    '/api/post'
  ];
  
  let lastError = null;
  
  // Try each endpoint until one works
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Trying API endpoint: ${endpoint}`);
      const response = await axios.get(endpoint);
      console.log(`Success with endpoint ${endpoint}:`, response);
      
      // Ensure we have a valid data structure
      let posts = [];
      
      if (Array.isArray(response.data)) {
        posts = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If response.data is an object with a content property (like Spring Data pagination)
        if (Array.isArray(response.data.content)) {
          posts = response.data.content;
        } else {
          // Last resort, try to convert the object to an array if possible
          posts = Object.values(response.data);
        }
      }
      
      // Normalize posts to ensure consistent structure with numeric IDs
      // and fix imageUrl/imageUrls field inconsistency
      const normalizedPosts = posts.map(post => {
        // Ensure ID is a number
        const normalizedPost = {
          ...post,
          id: typeof post.id === 'string' ? Number(post.id) : post.id
        };
        
        // Fix image URLs field naming inconsistency
        // Backend uses imageUrl but frontend expects imageUrls
        if (post.imageUrl && !post.imageUrls) {
          normalizedPost.imageUrls = Array.isArray(post.imageUrl) 
            ? post.imageUrl 
            : [post.imageUrl];
        }
        
        return normalizedPost;
      });
      
      console.log('Normalized posts:', normalizedPosts);
      return normalizedPosts;
    } catch (error) {
      console.error(`Error with endpoint ${endpoint}:`, error.message);
      lastError = error;
      // Continue trying next endpoint
    }
  }

  // If we get here, all endpoints failed
  console.error('All post API endpoints failed. Last error:', lastError);
  console.error('Error details:', {
    message: lastError?.message,
    status: lastError?.response?.status,
    data: lastError?.response?.data,
    config: lastError?.config
  });
  
  // Return empty array as fallback
  return [];
};