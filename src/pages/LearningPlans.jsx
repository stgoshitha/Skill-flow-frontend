import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllLearningPlans, deleteLearningPlan } from '../services/learningPlanService';
import { useAuth } from '../context/AuthContext';

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchLearningPlans();
  }, [isAuthenticated, navigate]);

  const fetchLearningPlans = async () => {
    try {
      setLoading(true);
      console.log('Fetching learning plans...');
      const plans = await getAllLearningPlans();
      console.log('Learning plans response:', plans);
      setLearningPlans(plans);
      setError('');
    } catch (err) {
      console.error('Error fetching learning plans:', err);
      setError('Failed to load learning plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await deleteLearningPlan(planId);
        // Remove the deleted plan from state
        setLearningPlans(learningPlans.filter(plan => plan.id !== planId));
      } catch (err) {
        console.error('Error deleting learning plan:', err);
        setError('Failed to delete learning plan. Please try again later.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Learning Plans</h1>
        <Link
          to="/learning-plans/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create New Plan
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {learningPlans.length === 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 text-center">
          <p className="text-gray-500">You don't have any learning plans yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {plan.progress}% Complete
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Timeline:</h3>
                  <p className="text-gray-600">{plan.timeLine}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Resources:</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {plan.resources.map((resource, index) => (
                      <li key={index} className="line-clamp-1">{resource}</li>
                    )).slice(0, 2)}
                    {plan.resources.length > 2 && (
                      <li className="text-blue-500">+{plan.resources.length - 2} more</li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-between mt-4">
                  <Link
                    to={`/learning-plans/${plan.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/learning-plans/edit/${plan.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-1.5">
                <div 
                  className="bg-blue-600 h-1.5" 
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPlans; 