import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-500 text-gray-700 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Brand */}
        {/* <div className="text-lg font-semibold text-blue-600">
          Skill-Flow
        </div> */}

        {/* Navigation Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/learningplans" className="hover:underline">Learning Plans</Link>
          <Link to="/posts" className="hover:underline">Posts</Link>
          <Link to="/helpdesk" className="hover:underline">Help Desk</Link>
          <Link to="/about" className="hover:underline">About</Link>
        </div>

        {/* Copyright */}
        <div className="mt-4 md:mt-0 text-sm">
          © {year} Skill-Flow. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
