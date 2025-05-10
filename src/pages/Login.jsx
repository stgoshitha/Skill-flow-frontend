// Login.jsx
import React, { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const loginWithGitHub = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Skill-Flow</h1>
          <p className="text-white text-lg mb-8 max-w-md leading-relaxed">
            The smart platform to organize your learning journey and track your progress.
          </p>
        </div>
        
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-white text-2xl font-semibold mb-6">Why Skill-Flow?</h3>
          <ul className="space-y-5">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Track your learning progress in one place</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Connect with learning resources seamlessly</p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-7 w-7 rounded-full bg-white flex items-center justify-center mr-4 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <p className="text-white font-medium">Organize and share your knowledge journey</p>
            </li>
          </ul>
        </div>
        
        <div className="text-white text-sm">
          © {new Date().getFullYear()} Skill-Flow. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Login form */}
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Skill-Flow</h2>
            <p className="text-gray-600 mb-8">Sign in to continue your learning journey</p>
          </div>
          
          <div className="space-y-5">
            <button
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-lg transition duration-300 w-full shadow-sm"
            >
              <FaGoogle className="text-2xl text-red-500" />
              <span className="font-medium text-lg">Continue with Google</span>
            </button>

            <button
              onClick={loginWithGitHub}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-black text-white px-6 py-4 rounded-lg transition duration-300 w-full shadow-sm"
            >
              <FaGithub className="text-2xl" />
              <span className="font-medium text-lg">Continue with GitHub</span>
            </button>
            
            {isLoading && (
              <div className="flex justify-center mt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          <p className="mt-12 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
