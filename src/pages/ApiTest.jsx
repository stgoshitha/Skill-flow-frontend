import { useState } from 'react';
import axios from '../utils/axiosConfig';

const ApiTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [baseUrl, setBaseUrl] = useState(axios.defaults.baseURL);
  const [endpoint, setEndpoint] = useState('/learning-plan');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      console.log(`Testing API: ${baseUrl}${endpoint}`);
      
      // Update axios baseURL temporarily for this test
      const originalBaseUrl = axios.defaults.baseURL;
      axios.defaults.baseURL = baseUrl;
      
      const response = await axios.get(endpoint);
      
      // Reset to original baseURL
      axios.defaults.baseURL = originalBaseUrl;
      
      console.log('API response:', response);
      setResult({
        status: response.status,
        data: response.data
      });
    } catch (error) {
      console.error('Error testing API:', error);
      setError({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">API Test Tool</h1>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Base URL:</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Endpoint:</label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-bold text-green-800">Success (Status: {result.status})</h2>
          <pre className="mt-2 bg-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="font-bold text-red-800">Error: {error.message}</h2>
          {error.status && <p className="text-red-600">Status: {error.status}</p>}
          {error.data && (
            <pre className="mt-2 bg-white p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(error.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest;