import React, { useState } from 'react';
import axios from 'axios';

const CreateHelpDeskForm = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log('User:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setLoading(true);

    // Get userId directly from the user object in localStorage
    const userId = user?.id;
    console.log('User ID:', userId);

    if (!userId) {
      setError('User ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    if (!question.trim()) {
      setError('Question is required.');
      setLoading(false);
      return;
    }

    try {
      // Send the POST request with question and userId
      const res = await axios.post(
        `http://localhost:8080/helps`,
        { question },
        {
          params: { userId }
        }
      );

      setResponse(res.data);
      setQuestion('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Bad request. Please check the input.');
      } else {
        setError('Failed to create help desk entry.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Create Help Desk Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="Enter your question here..."
              className="w-full border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[150px]"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : "Submit Question"}
          </button>
        </form>

        {response && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="text-lg font-medium text-green-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Question Submitted Successfully
            </h4>
            <div className="space-y-2 text-sm text-green-700">
              <p><span className="font-medium">ID:</span> {response.id}</p>
              <p><span className="font-medium">Question:</span> {response.question}</p>
              <p><span className="font-medium">User:</span> {response.username}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateHelpDeskForm;
