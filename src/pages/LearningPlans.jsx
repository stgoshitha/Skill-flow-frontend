import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Ensure safe search by checking if properties exist before accessing them
  const filteredPlans = learningPlans.filter(plan => {
    const title = plan.title || '';
    const description = plan.description || '';
    
    return title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log("Search term changed to:", e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">My Learning Journey</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Track your progress, organize your learning materials, and achieve your educational goals.
          </p>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">My Learning Plans</h2>
              <p className="text-gray-600 mt-1">Manage and track your learning progress</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search plans..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search learning plans"
                />
              </div>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create New Plan
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
          ) : learningPlans.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">Start Your Learning Journey</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first learning plan to organize your skills development and track your progress.
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Create Your First Plan
              </button>
            </div>
          ) : filteredPlans.length === 0 && searchTerm !== '' ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mt-4 mb-2">No matching plans found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search term or browse all plans.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => {
                  // Ensure progress is a valid number
                  let progress = 0;
                  if (typeof plan.progress === 'number') {
                    progress = plan.progress;
                  } else if (typeof plan.progress === 'string' && !isNaN(parseInt(plan.progress))) {
                    progress = parseInt(plan.progress);
                  }
                  
                  return (
                    <Link
                      to={`/learning-plan/${plan.id}`}
                      key={plan.id}
                      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 pr-2">
                            {plan.title}
                          </h2>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            progress > 75 ? 'bg-green-100 text-green-800' : 
                            progress > 25 ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {progress}% Complete
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 h-12">{plan.description}</p>
                        
                        <div className="mb-4 mt-6">
                          <div className="flex justify-between items-center mb-1 text-xs text-gray-600">
                            <span>Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full ${
                                progress > 75 ? 'bg-green-500' : 
                                progress > 50 ? 'bg-blue-500' : 
                                progress > 25 ? 'bg-blue-400' : 
                                'bg-blue-300'
                              }`}
                              style={{ 
                                width: `${progress}%`,
                                minWidth: '2px'
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span>{plan.timeLine}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>{plan.postIds?.length || 0} posts</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {filteredPlans.length > 0 && searchTerm && (
                <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  Found {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </div>
              )}
              
              {/* Show a hint at the bottom */}
              <div className="mt-8 text-center text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p>
                  <span className="font-medium">Tip:</span> Click on any learning plan to view details and track your progress.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlans; 