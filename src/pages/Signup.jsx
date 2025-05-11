// Signup.jsx
import React, { useState } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jpg';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signupWithGoogle = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const signupWithGitHub = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Join Skill-Flow</h1>
          <p className="text-white text-lg mb-8 max-w-md leading-relaxed">
            Create an account and start organizing your learning journey today.
          </p>
        </div>
        
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-white text-2xl font-semibold mb-6">What you'll get</h3>
          <ul className="space-y-5">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Personalized learning plans</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Progress tracking and analytics</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Curated learning resources</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Connect with like-minded learners</p>
            </li>
          </ul>
        </div>
        
        <div className="text-white text-sm">
          © {new Date().getFullYear()} Skill-Flow. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-block mb-6">
              <img 
                src={logo} 
                alt="Skill-Flow Logo" 
                className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
            <p className="text-gray-600 mb-8">Join Skill-Flow and start your learning journey</p>
          </div>
          
          <div className="space-y-5">
            <button
              onClick={signupWithGoogle}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-lg transition duration-300 w-full shadow-sm"
            >
              <FaGoogle className="text-2xl text-red-500" />
              <span className="font-medium text-lg">Sign up with Google</span>
            </button>

            <button
              onClick={signupWithGitHub}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-black text-white px-6 py-4 rounded-lg transition duration-300 w-full shadow-sm"
            >
              <FaGithub className="text-2xl" />
              <span className="font-medium text-lg">Sign up with GitHub</span>
            </button>
            
            {isLoading && (
              <div className="flex justify-center mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-6">
              By signing up, you agree to our 
              <a href="#" className="text-blue-600 hover:underline mx-1">Terms of Service</a> 
              and 
              <a href="#" className="text-blue-600 hover:underline mx-1">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
