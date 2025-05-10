import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/learning-plan/${id}`, {
          withCredentials: true
        });
        setPlan(response.data);
        
        // If there are postIds, fetch the actual posts
        if (response.data.postIds && response.data.postIds.length > 0) {
          // This would typically be a batch fetch, but for simplicity we'll use multiple requests
          const postPromises = response.data.postIds.map(postId => 
            axios.get(`http://localhost:8080/posts/${postId}`, { withCredentials: true })
          );
          
          const postResults = await Promise.all(postPromises);
          setPosts(postResults.map(result => result.data));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learning plan:', err);
        setError('Failed to load learning plan. Please try again later.');
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-learning-plan/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`http://localhost:8080/learning-plan/${id}`, {
          withCredentials: true
        });
        navigate('/learning-plans');
      } catch (err) {
        console.error('Error deleting learning plan:', err);
        setError('Failed to delete learning plan. Please try again later.');
      }
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

  if (error || !plan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error || 'Learning plan not found'}
          </div>
          <button
            onClick={() => navigate('/learning-plans')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Back to Learning Plans
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold">{plan.title}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Progress</span>
                <span>{plan.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full"
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600">{plan.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Timeline</h2>
              <p className="text-gray-600">{plan.timeLine}</p>
            </div>
            
            {/* Resources */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Resources</h2>
              {plan.resources && plan.resources.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
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
                <p className="text-gray-500 italic">No resources specified</p>
              )}
            </div>
            
            {/* Related Posts */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Related Posts</h2>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map(post => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-medium text-lg text-gray-800 mb-1">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                      <button 
                        onClick={() => navigate(`/posts/${post.id}`)}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                      >
                        View Post
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No posts linked to this learning plan</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlanDetail; 