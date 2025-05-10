// Login.jsx
import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const loginWithGitHub = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-96 bg-white shadow-md rounded-lg p-8">
      <img
        src={logo}
        alt="System Logo"
        className="w-30 h-30 mb-7 rounded-full border-2 border-gray-300"
      />
      <button
        onClick={loginWithGoogle}
        className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md mb-4 transition duration-300 w-full"
      >
        <FaGoogle className="text-xl font-semibold" />
        Login with Google
      </button>

      <button
        onClick={loginWithGitHub}
        className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-md transition duration-300 w-full"
      >
        <FaGithub className="text-xl" />
        Signin with GitHub
      </button>

      <p className="mt-6 text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
      </div>
    </div>
  );
};

export default Login;
