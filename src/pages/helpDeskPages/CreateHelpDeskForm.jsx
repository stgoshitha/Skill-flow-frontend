import React, { useState } from 'react';
import axios from 'axios';

const CreateHelpDeskForm = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  // Retrieve the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  // console.log('User:', user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    // Get userId directly from the user object in localStorage
    const userId = user?.id;
    console.log('User ID:', userId);

    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    if (!question.trim()) {
      setError('Question is required.');
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
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError('Bad request. Please check the input.');
      } else {
        setError('Failed to create help desk entry.');
      }
    }
  };

  return (
    <div className="helpdesk-form">
      <h2>Create Help Desk Question</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Enter your question..."
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div className="response">
          <h4>Help Desk Created</h4>
          <p><strong>ID:</strong> {response.id}</p>
          <p><strong>Question:</strong> {response.question}</p>
          <p><strong>User:</strong> {response.username}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateHelpDeskForm;
