import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  getLearningPlanById, 
  createLearningPlan, 
  updateLearningPlan,
  getAllPosts
} from '../services/learningPlanService';
import { useAuth } from '../context/AuthContext';

// Error boundary component for catching rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("LearningPlanForm Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-300 rounded-md">
          <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <details className="bg-white p-4 rounded-md">
            <summary className="font-semibold cursor-pointer">Error details</summary>
            <p className="mt-2 text-red-500">{this.state.error && this.state.error.toString()}</p>
            <pre className="mt-2 bg-gray-100 p-2 rounded-md overflow-auto text-xs">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the LearningPlanForm with the error boundary
const LearningPlanFormWithErrorBoundary = () => (
  <ErrorBoundary>
    <LearningPlanForm />
  </ErrorBoundary>
);

const LearningPlanForm = () => {
  const { planId } = useParams();
  const isEditMode = !!planId;
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Check if we're on the test route
  const isTestRoute = location.pathname === '/test-create-plan';
  
  // Add debugging for user info
  useEffect(() => {
    console.log('Current user from context:', currentUser);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Current path:', location.pathname);
    console.log('Is test route:', isTestRoute);
  }, [currentUser, isAuthenticated, location.pathname, isTestRoute]);

  // Component state tracking for debugging
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('Component rendered:', renderCount + 1);
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resources: [''],
    timeLine: '',
    postIds: [],
    progress: 0
  });
  
  const [availablePosts, setAvailablePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Set component loaded state
  useEffect(() => {
    setComponentLoaded(true);
    console.log('Component loaded state set to true');
  }, []);

  useEffect(() => {
    try {
      console.log('Starting main effect hook execution');
      // Only redirect if not on test route and not authenticated
      if (!isAuthenticated && !isTestRoute) {
        console.log('Not authenticated and not on test route, redirecting to login');
        navigate('/login');
        return;
      }

      const fetchData = async () => {
        try {
          console.log('Fetching data started');
          setLoading(true);
          
          // Fetch all posts for the select options with error handling for the array
          console.log('Fetching posts');
          try {
            const posts = await getAllPosts();
            console.log('Posts fetched:', posts);
            // Make sure posts is always an array
            setAvailablePosts(Array.isArray(posts) ? posts : []);
          } catch (postsError) {
            console.error('Error fetching posts:', postsError);
            setAvailablePosts([]);
          }
          
          // If editing, fetch the existing plan data
          if (isEditMode) {
            console.log('Edit mode, fetching plan data');
            const plan = await getLearningPlanById(planId);
            console.log('Plan data fetched:', plan);
            
            setFormData({
              title: plan.title || '',
              description: plan.description || '',
              resources: plan.resources?.length > 0 ? plan.resources : [''],
              timeLine: plan.timeLine || '',
              postIds: plan.postIds || [],
              progress: plan.progress || 0
            });
          }
        } catch (err) {
          console.error('Error in fetchData:', err);
          setError('Failed to load data. Please try again later.');
        } finally {
          setLoading(false);
          console.log('Loading set to false');
        }
      };

      fetchData();
      console.log('Fetch data function called');
    } catch (error) {
      console.error('Uncaught error in effect hook:', error);
    }
  }, [planId, isEditMode, isAuthenticated, navigate, isTestRoute]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.timeLine.trim()) {
      newErrors.timeLine = 'Timeline is required';
    }
    
    // Filter out empty resources
    const validResources = formData.resources.filter(r => r.trim() !== '');
    if (validResources.length === 0) {
      newErrors.resources = 'At least one resource is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Filter out empty resources
      const cleanedFormData = {
        ...formData,
        resources: formData.resources.filter(r => r.trim() !== '')
      };
      
      console.log('Form data to submit:', cleanedFormData);
      
      if (isEditMode) {
        try {
          const result = await updateLearningPlan(planId, cleanedFormData);
          console.log('Learning plan updated successfully:', result);
          navigate('/learning-plans');
        } catch (err) {
          console.error('Error updating learning plan:', err);
          setError(`Failed to update learning plan: ${err.message || 'Unknown error'}`);
        }
      } else {
        // Get user ID with fallbacks
        let userId = null;
        
        if (currentUser) {
          // Try various properties where ID might be stored
          userId = currentUser.id || currentUser.userId;
          console.log('Using user ID from current user:', userId);
        }
        
        // For test route, use a fallback ID
        if (!userId && isTestRoute) {
          userId = 1;
          console.log('Using test user ID:', userId);
        }
        
        if (!userId) {
          setError('User ID not found. Please log in again.');
          setSubmitting(false);
          return;
        }
        
        try {
          console.log('Creating learning plan with user ID:', userId);
          const result = await createLearningPlan(userId, cleanedFormData);
          console.log('Learning plan created successfully:', result);
          navigate('/learning-plans');
        } catch (err) {
          console.error('Error creating learning plan:', err);
          setError(`Failed to create learning plan: ${err.response?.data || err.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData({ ...formData, resources: updatedResources });
    
    // Clear resources error when user types
    if (errors.resources) {
      setErrors({ ...errors, resources: '' });
    }
  };

  const addResourceField = () => {
    setFormData({ ...formData, resources: [...formData.resources, ''] });
  };

  const removeResourceField = (index) => {
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    setFormData({ ...formData, resources: updatedResources.length ? updatedResources : [''] });
  };

  const handlePostSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData({ ...formData, postIds: selectedOptions });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/learning-plans" className="text-blue-600 hover:text-blue-800">
          ← Back to Learning Plans
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="timeLine" className="block text-sm font-medium text-gray-700">
                Timeline*
              </label>
              <input
                type="text"
                id="timeLine"
                name="timeLine"
                value={formData.timeLine}
                onChange={handleChange}
                placeholder="e.g., 4 weeks, 2 months"
                className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 border ${
                  errors.timeLine ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.timeLine && (
                <p className="mt-1 text-sm text-red-600">{errors.timeLine}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resources*
              </label>
              {errors.resources && (
                <p className="mb-2 text-sm text-red-600">{errors.resources}</p>
              )}
              
              {formData.resources.map((resource, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => handleResourceChange(index, e.target.value)}
                    placeholder="Enter a resource link or description"
                    className="flex-grow rounded-md shadow-sm py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceField(index)}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                    disabled={formData.resources.length === 1}
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
                + Add Another Resource
              </button>
            </div>

            <div>
              <label htmlFor="postIds" className="block text-sm font-medium text-gray-700">
                Related Posts
              </label>
              <select
                id="postIds"
                name="postIds"
                multiple
                value={formData.postIds.map(String)}
                onChange={handlePostSelection}
                className="mt-1 block w-full rounded-md shadow-sm py-2 px-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.isArray(availablePosts) && availablePosts.length > 0 ? (
                  availablePosts.map(post => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))
                ) : (
                  <option disabled value="">No posts available</option>
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Hold Ctrl (or Cmd) to select multiple posts
              </p>
            </div>

            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Link
                to="/learning-plans"
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {submitting
                  ? isEditMode ? 'Saving...' : 'Creating...'
                  : isEditMode ? 'Save Changes' : 'Create Plan'
                }
              </button>
              
              {/* Debug information */}
              <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-70 text-white rounded text-xs max-w-xs overflow-auto" style={{maxHeight: '300px'}}>
                <h3 className="font-bold mb-2">Debug Info:</h3>
                <p>User ID: {currentUser?.id}</p>
                <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
                <p>Current Path: {location.pathname}</p>
                <p>Test Route: {isTestRoute ? 'Yes' : 'No'}</p>
                <pre>{JSON.stringify(currentUser, null, 2)}</pre>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanForm;
export { LearningPlanFormWithErrorBoundary };