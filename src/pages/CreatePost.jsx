import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryService from '../services/CategoryService';

const CreatePost = () => {
  const { id } = useParams(); // Get post ID from URL if editing
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(isEditMode);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const categoriesData = await CategoryService.getAllCategories();
        console.log('Categories response:', categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };

    fetchCategories();
    
    // If in edit mode, fetch the post data
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/posts/${id}`);
          const post = response.data;
          setFormData({
            title: post.title || '',
            description: post.description || '',
            categoryId: post.categoryId || ''
          });
          setLoadingPost(false);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post data. Please try again later.');
          setLoadingPost(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Get user ID from localStorage
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setError('You must be logged in to create a post.');
      setLoading(false);
      return;
    }

    // Get user data
    try {
      const userResponse = await axios.get("http://localhost:8080/users/by-session", {
        params: { sessionId },
        withCredentials: true
      });
      
      const userId = userResponse.data.id;
      
      // Validate form data
      if (!formData.title || !formData.description) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      if (isEditMode) {
        // Update existing post
        await axios.put(
          `http://localhost:8080/posts/${id}`,
          {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId
          }
        );
      } else {
        // Create new post
        // Create FormData object for file upload
        const postData = new FormData();
        postData.append('title', formData.title);
        postData.append('description', formData.description);
        
        // Append each image file to the FormData
        if (imageFiles && imageFiles.length > 0) {
          imageFiles.forEach(file => {
            postData.append('imageFiles', file);
          });
        }

        console.log('Sending post data:', {
          title: formData.title,
          description: formData.description,
          categoryId: formData.categoryId,
          userId: userId,
          imageFiles: imageFiles ? imageFiles.map(f => f.name) : []
        });

        // Create new post
        await axios.post(
          'http://localhost:8080/posts',
          postData,
          {
            params: {
              userId: userId,
              categoryId: formData.categoryId
            },
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // Redirect to posts page on success
      navigate('/posts');
    } catch (err) {
      console.error('Error creating/updating post:', err);
      if (err.response && err.response.data) {
        console.log('Error response data:', err.response.data);
      }
      setError(err.response?.data?.message || 'Failed to process post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-red-500">
                      No categories available. Please try refreshing the page.
                    </p>
                    <button 
                      type="button" 
                      onClick={() => window.location.reload()}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Refresh Page
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {!isEditMode && (
                <div>
                  <label htmlFor="imageFiles" className="block text-sm font-medium text-gray-700 mb-1">
                    Images (Optional)
                  </label>
                  <input
                    type="file"
                    id="imageFiles"
                    name="imageFiles"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload images to enhance your post (max 5MB each)
                  </p>
                  {imageFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Selected files:</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {imageFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/posts')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost; 