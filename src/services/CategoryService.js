import axios from 'axios';

const API_URL = 'http://localhost:8080';

const CategoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new category (admin only)
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }
};

export default CategoryService; 