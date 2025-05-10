import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';
import axios from 'axios';

const Home = () => {

  useEffect(() => {
    axios.get('http://localhost:8080/users/session-id', {
      withCredentials: true
    })
    .then(response => {
      const sessionId = response.data;
  
      // Check if sessionId is valid (non-null, non-empty string)
      if (sessionId && typeof sessionId === 'string' && sessionId.trim() !== '') {
        localStorage.setItem('sessionId', sessionId);
        console.log('Session ID saved:', sessionId);
      } else {
        console.warn('No valid session ID returned.');
        // Optionally clear any previous session ID
        localStorage.removeItem('sessionId');
      }
    })
    .catch(error => {
      console.error('Error fetching session ID:', error.message);
      // Optional: handle specific error types
      if (error.response) {
        if (error.response.status === 401) {
          console.warn('Unauthorized: User is not logged in.');
        } else if (error.response.status === 500) {
          console.warn('Server error while fetching session ID.');
        }
      }
    });
  }, []);

  return (
    <div>
      <Header/>
      <h2>Welcome to the OAuth Demo</h2>
      <div className="flex flex-col gap-4 bg-red-300 justify-center items-center p-4 rounded">
        {/* Any session ID or user info can be displayed here */}
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
