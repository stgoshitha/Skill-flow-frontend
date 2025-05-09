import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    about: '',
    qualifications: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      setLoading(true);
      
      // Send the data as JSON - it will be converted to snake_case in the service
      console.log('Registering user with data:', formData);
      
      // Register user with the JSON data
      const newUser = await registerUser(formData);
      
      console.log('Registration successful, received:', newUser);
      
      // Log the user in
      login(newUser);
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setApiError('Failed to create account. ' + (typeof error === 'string' ? error : 'Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>
        
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{apiError}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username*
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.username ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter your username (3-50 characters)"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email*
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number*
              </label>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.phoneNumber ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter 10 digit phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows="3"
                  value={formData.about}
                  onChange={handleChange}
                  className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.about ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  placeholder="Tell us about yourself (max 255 characters)"
                />
                {errors.about && (
                  <p className="mt-1 text-sm text-red-600">{errors.about}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="qualifications" className="block text-sm font-medium leading-6 text-gray-900">
                Qualifications
              </label>
              <div className="mt-2">
                <textarea
                  id="qualifications"
                  name="qualifications"
                  rows="3"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className={`block w-full rounded-md py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.qualifications ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6`}
                  placeholder="Your qualifications or expertise (max 255 characters)"
                />
                {errors.qualifications && (
                  <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 