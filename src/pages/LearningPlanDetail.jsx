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
  const [activeTab, setActiveTab] = useState('overview');

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

  // Ensure progress is a number between 0-100
  const progress = typeof plan.progress === 'number' ? plan.progress : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/learning-plans')}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Learning Plans
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h1 className="text-3xl font-bold mb-4 md:mb-0">{plan.title}</h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Section - Redesigned */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">Progress</h2>
              <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                {progress}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden shadow-inner">
              <div 
                className="bg-blue-600 h-5 rounded-full transition-all duration-500 ease-in-out flex items-center justify-end pr-2"
                style={{ 
                  width: `${Math.max(progress, 2)}%`,
                  background: 'linear-gradient(to right, #2563eb, #3b82f6)'
                }}
              >
                {progress >= 10 && (
                  <span className="text-xs font-medium text-white">{progress}%</span>
                )}
              </div>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Timeline: <strong>{plan.timeLine}</strong></span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span><strong>{posts.length}</strong> posts linked</span>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Overview
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${
                  activeTab === 'resources'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                Resources
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 font-medium text-sm flex items-center ${
                  activeTab === 'posts'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
                Related Posts
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="prose max-w-none">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{plan.description}</p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Timeline</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {plan.timeLine}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Related Content</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        {posts.length} posts linked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Resources</h2>
                {plan.resources && plan.resources.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {plan.resources.map((resource, index) => (
                      <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                        {resource.startsWith('http') ? (
                          <a 
                            href={resource} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start"
                          >
                            <div className="bg-blue-100 rounded-full p-3 mr-4">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-blue-600">{resource}</h3>
                              <p className="text-sm text-gray-500 mt-1">External resource</p>
                            </div>
                          </a>
                        ) : (
                          <div className="flex items-start">
                            <div className="bg-blue-100 rounded-full p-3 mr-4">
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-800">{resource}</h3>
                              <p className="text-sm text-gray-500 mt-1">Reference material</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No resources available</h3>
                    <p className="mt-1 text-gray-500">This learning plan doesn't have any resources yet.</p>
                    <div className="mt-6">
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Add Resources
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'posts' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map(post => (
                      <div key={post.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-3"></div>
                        <div className="p-5">
                          <h3 className="font-bold text-xl text-gray-800 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                          <div className="flex justify-between items-center">
                            <button 
                              onClick={() => navigate(`/posts/${post.id}`)}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Details
                              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                              </svg>
                            </button>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No related posts</h3>
                    <p className="mt-1 text-gray-500">This learning plan doesn't have any posts linked yet.</p>
                    <div className="mt-6">
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Link Posts
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlanDetail; 