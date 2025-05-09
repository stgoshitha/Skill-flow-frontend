import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/userService';

const Profile = () => {
  const { currentUser, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    about: '',
    qualifications: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Set form data from current user
    setFormData({
      username: currentUser.username || '',
      email: currentUser.email || '',
      phoneNumber: currentUser.phoneNumber || '',
      about: currentUser.about || '',
      qualifications: currentUser.qualifications || ''
    });
  }, [currentUser, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation - required, 3-50 chars
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 50) {
      newErrors.username = 'Username must be between 3 and 50 characters';
    }
    
    // Email validation - required, valid format
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Phone number validation - required, exactly 10 digits
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }
    
    // About and qualifications - optional, length check
    if (formData.about && formData.about.length > 255) {
      newErrors.about = 'About section cannot exceed 255 characters';
    }
    
    if (formData.qualifications && formData.qualifications.length > 255) {
      newErrors.qualifications = 'Qualifications cannot exceed 255 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      setApiError('');
      setSuccess('');
      setLoading(true);
      
      console.log('Updating user profile with data:', formData);
      
      // Send JSON data directly instead of FormData
      const updatedUser = await updateUser(currentUser.id, formData);
      
      console.log('Update successful, received:', updatedUser);
      
      // Update context
      login(updatedUser);
      
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setApiError('Failed to update profile. ' + (typeof error === 'string' ? error : 'Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600">Manage your account information</p>
        </div>
        
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{apiError}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username*
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your username (3-50 characters)"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter 10 digit phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About
              </label>
              <textarea
                id="about"
                name="about"
                rows="3"
                value={formData.about}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${errors.about ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Tell us about yourself (max 255 characters)"
              />
              {errors.about && (
                <p className="mt-1 text-sm text-red-600">{errors.about}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                Qualifications
              </label>
              <textarea
                id="qualifications"
                name="qualifications"
                rows="3"
                value={formData.qualifications}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border ${errors.qualifications ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your qualifications or expertise (max 255 characters)"
              />
              {errors.qualifications && (
                <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 