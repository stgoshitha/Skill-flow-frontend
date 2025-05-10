import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learning-plan', {
          withCredentials: true
        });
        setLearningPlans(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learning plans:', err);
        setError('Failed to load learning plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  const handleCreateNew = () => {
    navigate('/create-learning-plan');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Learning Plans</h1>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <span className="mr-2">+</span> Create New Plan
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : learningPlans.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-4">No Learning Plans Found</h3>
            <p className="text-gray-600 mb-6">
              Start creating your first learning plan to organize your learning journey.
            </p>
            <button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPlans.map((plan) => (
              <Link
                to={`/learning-plan/${plan.id}`}
                key={plan.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{plan.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{plan.progress}%</span>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="mr-2">Timeline:</span>
                    <span>{plan.timeLine}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      {plan.postIds?.length || 0} posts linked
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlans; 