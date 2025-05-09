import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const PostsApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');

  const endpoints = [
    '/posts',
    '/api/posts',
    '/posts/all',
    '/post',
    '/api/post'
  ];

  const testEndpoint = async (endpoint) => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      return {
        endpoint,
        status: response.status,
        success: true,
        data: response.data,
        message: 'Success'
      };
    } catch (error) {
      return {
        endpoint,
        status: error.response?.status,
        success: false,
        message: error.message,
        error
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    setError('');
    const results = [];

    try {
      for (const endpoint of endpoints) {
        const result = await testEndpoint(endpoint);
        results.push(result);
      }
      setResponses(results);
    } catch (err) {
      setError(`Failed to run tests: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts API Test</h1>
        <div>
          <Link to="/" className="text-blue-600 hover:underline mr-4">
            Home
          </Link>
          <Link to="/learning-plans" className="text-blue-600 hover:underline">
            Learning Plans
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Testing...' : 'Test API Endpoints'}
        </button>
      </div>

      <div className="space-y-6">
        {responses.map((response, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 ${
              response.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
            }`}
          >
            <h2 className="font-bold text-lg mb-2">{response.endpoint}</h2>
            <p className="mb-2">
              <span className="font-semibold">Status:</span> {response.status || 'N/A'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Result:</span> {response.success ? 'Success' : 'Failed'}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Message:</span> {response.message}
            </p>
            
            {response.success && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Data:</h3>
                <div className="bg-white p-3 rounded-md border overflow-auto max-h-60">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
                
                {Array.isArray(response.data) ? (
                  <p className="mt-2 text-green-700">
                    Found {response.data.length} posts in array format
                  </p>
                ) : response.data && typeof response.data === 'object' && Array.isArray(response.data.content) ? (
                  <p className="mt-2 text-green-700">
                    Found {response.data.content.length} posts in pagination format
                  </p>
                ) : (
                  <p className="mt-2 text-yellow-700">
                    Response is not in expected format
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsApiTest; 