import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '', // Changed to match backend response
    about: '',
    qualifications: '',
  });

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
      setFormData({
        username: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        about: res.data.about,
        qualifications: res.data.qualifications,
      });
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/users/${user.id}`, formData, {
      withCredentials: true
    })
    .then(res => {
      setUser(res.data);
      setEditMode(false);
      window.location.reload();
    })
    .catch(err => console.error(err));
  };

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
            {!editMode ? (
              <>
              <img
                src={user.profileImageUrl || 'default-profile.png'}/>
                <p><strong>Name:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                <p><strong>About:</strong> {user.about}</p>
                <p><strong>Qualifications:</strong> {user.qualifications}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber" // Fixed here to match backend variable
                    value={formData.phoneNumber} // Fixed here
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">About</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Qualifications</label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p className="text-red-500">User not found or session expired.</p>
        )}

        {user && user.role === 'user' && (
          <button onClick={Logout} className="bg-red-500 text-white py-2 px-4 rounded mt-4">
            Logout
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
