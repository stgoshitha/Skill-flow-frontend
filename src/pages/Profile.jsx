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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : user ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 bg-white/20 flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">{user.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  {user.role && (
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-5">
              <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
                User Profile
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm flex items-center transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                )}
              </h2>

              {!editMode ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium">{user.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">About</p>
                    <p className="whitespace-pre-wrap">{user.about || 'No information provided.'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500 mb-1">Qualifications</p>
                    <p className="whitespace-pre-wrap">{user.qualifications || 'No qualifications listed.'}</p>
                  </div>
                  
                  {user && user.role === 'user' && (
                    <div className="pt-4 border-t border-gray-200">
                      <button 
                        onClick={Logout} 
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber" // Fixed here to match backend variable
                      value={formData.phoneNumber} // Fixed here
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-5 rounded-md transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-5 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-red-500 text-center">User not found or session expired.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;