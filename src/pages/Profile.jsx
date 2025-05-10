import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      setLoading(false);
      return;
    }
  
    axios.get("http://localhost:8080/users/by-session", {
      params: { sessionId },
      withCredentials: true
    })
    .then(res => {
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const Logout = () => {
    window.location.href = "http://localhost:8080/logout";
  };

  return (
    <div>
      <Header />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
{loading ? (
  <p className="text-gray-500">Loading user details...</p>
) : user ? (
  <div className="space-y-2 text-gray-800">
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>
) : (
  <p className="text-red-500">User not found or session expired.</p>
)}

        {user && user.role === 'user' && (
          <button onClick={Logout}>Logout</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
