import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';

const ApiConnectionTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Test endpoints to check
  const endpoints = [
    { name: 'Learning Plans', url: '/learning-plan' },
    { name: 'Learning Plan by ID', url: '/learning-plan/1' },
    { name: 'Posts', url: '/posts' },
    { name: 'Posts with API prefix', url: '/api/posts' },
    { name: 'Single Post', url: '/posts/1' },
    { name: 'Categories', url: '/categories' },
    { name: 'Users', url: '/users' }
  ];

  const runTests = async () => {
    setLoading(true);
    setError(null);
    const testResults = [];

    try {
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint.url}`);
          const response = await axios.get(endpoint.url);
          
          testResults.push({
            name: endpoint.name,
            url: endpoint.url,
            status: response.status,
            success: true,
            contentType: response.headers['content-type'],
            dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
            itemCount: Array.isArray(response.data) ? response.data.length : null,
            data: response.data
          });
        } catch (err) {
          console.error(`Error testing ${endpoint.url}:`, err);
          
          testResults.push({
            name: endpoint.name,
            url: endpoint.url,
            status: err.response?.status,
            success: false,
            error: err.message,
            errorData: err.response?.data
          });
        }
      }

      setResults(testResults);
    } catch (err) {
      setError('Failed to run tests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-bold">API Connection Test</h1>
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
          {loading ? 'Running Tests...' : 'Run API Tests'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Test Results</h2>
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-lg border p-4 ${
                result.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
              }`}
            >
              <h3 className="font-bold text-lg mb-2">{result.name}</h3>
              <p className="mb-1">
                <span className="font-semibold">URL:</span> {result.url}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Status:</span> {result.status || 'N/A'}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Result:</span>{' '}
                {result.success ? 'Success' : 'Failed'}
              </p>

              {result.success ? (
                <>
                  <p className="mb-1">
                    <span className="font-semibold">Content Type:</span> {result.contentType}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Data Type:</span> {result.dataType}
                  </p>
                  {result.itemCount !== null && (
                    <p className="mb-1">
                      <span className="font-semibold">Item Count:</span> {result.itemCount}
                    </p>
                  )}
                  <div className="mt-3">
                    <details>
                      <summary className="font-semibold cursor-pointer text-blue-600">
                        View Data
                      </summary>
                      <div className="mt-2 p-3 bg-white rounded-md border border-gray-200 overflow-auto max-h-60">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-1">
                    <span className="font-semibold">Error:</span> {result.error}
                  </p>
                  {result.errorData && (
                    <div className="mt-3">
                      <details>
                        <summary className="font-semibold cursor-pointer text-red-600">
                          View Error Details
                        </summary>
                        <div className="mt-2 p-3 bg-white rounded-md border border-gray-200 overflow-auto max-h-60">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(result.errorData, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTest; 