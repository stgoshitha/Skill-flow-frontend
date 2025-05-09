import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLearningPlanById, deleteLearningPlan, getAllPosts } from '../services/learningPlanService';
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
    console.error("LearningPlanDetail Error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md">
            <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
            <p className="mb-4">{this.state.error?.message || "An unknown error occurred"}</p>
            <Link 
              to="/learning-plans"
              className="text-blue-600 hover:underline"
            >
              Return to Learning Plans
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const LearningPlanDetail = () => {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    let mounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First fetch the learning plan
        const planData = await getLearningPlanById(planId);
        
        if (!mounted) return;
        console.log('Plan data received:', planData);
        
        // If plan has postIds, then fetch the posts
        const postsData = await getAllPosts();
        
        if (!mounted) return;
        console.log('Posts data received:', postsData);
        console.log('Plan postIds:', planData.postIds);
        
        // Check if we found any related posts
        if (planData.postIds && planData.postIds.length > 0 && postsData.length === 0) {
          console.warn('No posts found but plan has postIds. This could indicate an API issue.');
        }
        
        // Check the types of IDs to ensure they match
        if (planData.postIds && planData.postIds.length > 0 && postsData.length > 0) {
          console.log('First postId type:', typeof planData.postIds[0]);
          console.log('First post.id type:', typeof postsData[0].id);
          
          // Convert all postIds to numbers if they're strings
          if (typeof planData.postIds[0] === 'string') {
            planData.postIds = planData.postIds.map(id => Number(id));
            console.log('Converted postIds to numbers:', planData.postIds);
          }
        }
        
        setPlan(planData);
        // Ensure posts is always an array
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching plan details:', err);
        setError('Failed to load learning plan details. Please try again later.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      mounted = false;
    };
  }, [planId, isAuthenticated, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await deleteLearningPlan(planId);
        navigate('/learning-plans');
      } catch (err) {
        console.error('Error deleting learning plan:', err);
        setError('Failed to delete learning plan. Please try again later.');
      }
    }
  };

  // Get the posts included in this learning plan with improved debugging
  const planPosts = plan?.postIds && Array.isArray(posts)
    ? posts.filter(post => {
        if (!post || !post.id) {
          console.warn('Found a post without ID', post);
          return false;
        }
        
        // Convert both IDs to strings for comparison to handle different data types
        const postIdStr = String(post.id);
        
        // Check if any of the plan's postIds match this post's ID
        const included = plan.postIds.some(planPostId => {
          if (planPostId === null || planPostId === undefined) {
            return false;
          }
          const planPostIdStr = String(planPostId);
          const matches = postIdStr === planPostIdStr;
          console.log(`Comparing post ID ${postIdStr} with plan post ID ${planPostIdStr}: ${matches}`);
          return matches;
        });
        
        // Log debug info for posts that should be included
        if (included) {
          console.log(`Post included: ID=${post.id}, Title=${post.title || 'unnamed'}`);
          console.log(`Post data:`, post);
        }
        
        return included;
      })
    : [];
  
  // Add manual check to make sure IDs match correctly
  console.log(`Found ${planPosts.length} posts that match learning plan post IDs`);
  console.log('Plan postIds:', plan?.postIds);
  console.log('All available post IDs:', posts.map(p => p.id));
  console.log('Final planPosts:', planPosts);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Plan Not Found</h2>
          <p className="text-gray-600 mb-4">The learning plan you are looking for does not exist or has been deleted.</p>
          <Link to="/learning-plans" className="text-blue-600 hover:text-blue-800">
            ← Back to Learning Plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/learning-plans" className="text-blue-600 hover:text-blue-800">
          ← Back to Learning Plans
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{plan.title}</h1>
            <div className="flex space-x-3">
              <Link
                to={`/learning-plans/edit/${plan.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="flex items-center mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${plan.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-blue-800">{plan.progress}% Complete</span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{plan.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Timeline</h2>
            <p className="text-gray-600">{plan.timeLine}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Resources</h2>
            {plan.resources && plan.resources.length > 0 ? (
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {plan.resources.map((resource, index) => (
                  <li key={index}>
                    {resource.startsWith('http') ? (
                      <a 
                        href={resource} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {resource}
                      </a>
                    ) : (
                      resource
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No resources added yet.</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Related Posts</h2>
            {planPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {planPosts.map(post => (
                  <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.description}</p>
                    {(post.imageUrls && post.imageUrls.length > 0) ? (
                      <img 
                        src={post.imageUrls[0]} 
                        alt={post.title} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (post.imageUrl && Array.isArray(post.imageUrl) && post.imageUrl.length > 0) ? (
                      <img 
                        src={post.imageUrl[0]} 
                        alt={post.title} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (post.imageUrl && typeof post.imageUrl === 'string') ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : null}
                    <Link 
                      to={`/posts/${post.id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View Post
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-gray-500 italic mb-2">No posts attached to this learning plan.</p>
                
                {/* Debugging information */}
                {process.env.NODE_ENV !== 'production' && (
                  <div className="bg-gray-100 p-4 rounded-md mt-4 text-xs">
                    <h4 className="font-bold mb-2">Debug Information:</h4>
                    <p>Plan ID: {planId}</p>
                    <p>Post IDs: {plan.postIds ? JSON.stringify(plan.postIds) : 'none'}</p>
                    <p>Total available posts: {posts.length}</p>
                    <p>Post IDs in the system: {posts.length > 0 ? posts.map(p => p.id).join(', ') : 'none'}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with the error boundary
const LearningPlanDetailWithErrorBoundary = () => (
  <ErrorBoundary>
    <LearningPlanDetail />
  </ErrorBoundary>
);

export default LearningPlanDetailWithErrorBoundary; 