import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resources: [''],
    timeLine: '',
    progress: 0,
    postIds: []
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch user data and existing plan if in edit mode
  useEffect(() => {
    const fetchUserData = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await axios.get("http://localhost:8080/users/by-session", {
          params: { sessionId },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.error("Session fetch failed:", err);
        navigate('/login');
      }
    };

    const fetchPlan = async () => {
      if (isEditMode) {
        try {
          const response = await axios.get(`http://localhost:8080/learning-plan/${id}`, {
            withCredentials: true
          });
          setFormData({
            title: response.data.title,
            description: response.data.description,
            resources: response.data.resources || [''],
            timeLine: response.data.timeLine,
            progress: response.data.progress,
            postIds: response.data.postIds || []
          });
          setLoading(false);
        } catch (err) {
          console.error('Error fetching learning plan:', err);
          setError('Failed to load learning plan for editing.');
          setLoading(false);
        }
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts', {
          withCredentials: true
        });
        setAvailablePosts(response.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchUserData();
    fetchPlan();
    fetchPosts();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };

  const addResourceField = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const removeResourceField = (index) => {
    const updatedResources = [...formData.resources];
    updatedResources.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      resources: updatedResources.length ? updatedResources : ['']
    }));
  };

  const handlePostSelection = (e) => {
    const postId = parseInt(e.target.value);
    setFormData(prev => {
      // Toggle selection: add if not present, remove if present
      if (prev.postIds.includes(postId)) {
        return {
          ...prev,
          postIds: prev.postIds.filter(id => id !== postId)
        };
      } else {
        return {
          ...prev,
          postIds: [...prev.postIds, postId]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a learning plan.');
      return;
    }
    
    // Filter out empty resources
    const filteredResources = formData.resources.filter(resource => resource.trim() !== '');
    
    const learningPlanData = {
      ...formData,
      resources: filteredResources.length ? filteredResources : ['']
    };
    
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/learning-plan/${id}`, learningPlanData, {
          withCredentials: true
        });
      } else {
        await axios.post(`http://localhost:8080/learning-plan?userId=${user.id}`, learningPlanData, {
          withCredentials: true
        });
      }
      navigate('/learning-plans');
    } catch (err) {
      console.error('Error saving learning plan:', err);
      setError('Failed to save learning plan. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a title for your learning plan"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what you want to learn and why"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="timeLine" className="block text-gray-700 font-medium mb-2">
                Timeline *
              </label>
              <input
                type="text"
                id="timeLine"
                name="timeLine"
                value={formData.timeLine}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., '2 weeks' or 'June 1-15, 2023'"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="progress" className="block text-gray-700 font-medium mb-2">
                Progress ({formData.progress}%)
              </label>
              <input
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Resources
              </label>
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a resource URL or description"
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceField(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResourceField}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Resource
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Related Posts
              </label>
              {availablePosts.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {availablePosts.map(post => (
                    <div key={post.id} className="mb-2 flex items-start">
                      <input
                        type="checkbox"
                        id={`post-${post.id}`}
                        value={post.id}
                        checked={formData.postIds.includes(post.id)}
                        onChange={handlePostSelection}
                        className="mt-1 mr-2"
                      />
                      <label htmlFor={`post-${post.id}`} className="text-sm">
                        <span className="font-medium">{post.title}</span>
                        {post.description && (
                          <p className="text-gray-600 text-xs">{post.description.substring(0, 60)}...</p>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No posts available to link</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/learning-plans')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditMode ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlanForm; 