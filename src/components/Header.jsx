import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
  ];
  
  // Links that are visible only when authenticated
  const authLinks = [
    { name: 'My Plans', path: '/learning-plans' },
    { name: 'Posts', path: '/posts' },
    { name: 'Help Desk', path: '/helpdesk' },
  ];
  
  // Add auth links to nav if user is authenticated
  const displayLinks = [
    ...navLinks,
    ...(isAuthenticated ? authLinks : []),
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Skill-Flow
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {displayLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg text-gray-700 hover:text-blue-600 ${
                location.pathname === link.path ? 'font-semibold text-blue-600' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Link 
              to="/profile"
              className="flex items-center space-x-2 ml-4 text-gray-700 hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              <span className="text-lg">
                {currentUser?.username || 'Profile'}
              </span>
            </Link>
          ) : (
            <div className="flex items-center space-x-4 ml-4">
              <Link 
                to="/login"
                className={`text-lg text-gray-700 hover:text-blue-600 ${
                  location.pathname === '/login' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="text-lg px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2 bg-white">
          {displayLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-gray-700 py-1 ${
                location.pathname === link.path ? 'font-semibold text-blue-600' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Link 
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center space-x-2 text-gray-700 py-1"
            >
              <User className="w-5 h-5" />
              <span>{currentUser?.username || 'Profile'}</span>
            </Link>
          ) : (
            <>
              <Link 
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`block text-gray-700 py-1 ${
                  location.pathname === '/login' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 py-1 font-semibold text-blue-600"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
