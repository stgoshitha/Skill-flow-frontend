import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLearningPlanById, deleteLearningPlan, getAllPosts } from '../services/learningPlanService';
import { useAuth } from '../context/AuthContext';

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

    const fetchData = async () => {
      try {
        setLoading(true);
        const [planData, postsData] = await Promise.all([
          getLearningPlanById(planId),
          getAllPosts()
        ]);
        
        setPlan(planData);
        setPosts(postsData);
      } catch (err) {
        console.error('Error fetching plan details:', err);
        setError('Failed to load learning plan details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Get the posts included in this learning plan
  const planPosts = plan?.postIds 
    ? posts.filter(post => plan.postIds.includes(post.id))
    : [];

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
                    {post.imageUrls && post.imageUrls.length > 0 && (
                      <img 
                        src={post.imageUrls[0]} 
                        alt={post.title} 
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
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
              <p className="text-gray-500 italic">No posts attached to this learning plan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanDetail; 