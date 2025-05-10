import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'My Plans', path: '/learningplans' },
    { name: 'Posts', path: '/posts' },
    { name: 'Help Desk', path: '/helpdesk' },
    { name: 'About', path: '/about' },
  ];


  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return;

    axios.get("http://localhost:8080/users/by-session", {
      params: { sessionId },
      withCredentials: true,
    })
    .then(res => {
      setUser(res.data);
      setIsLoggedIn(true);
    })
    .catch(err => {
      console.error("Session fetch failed:", err);
      setIsLoggedIn(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Skill-Flow
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
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

          {isLoggedIn && user ? (
            <Link to="/profile" className="flex items-center space-x-3">
             <div className="relative group ml-4 flex items-center space-x-3">
            <img
              src={user.profileImageUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700 font-medium">{user.username}</span>
          
            {/* Tooltip */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded px-4 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-full">
              <p>{user.username}</p>
            </div>
          </div>
              </Link>
          ) : (
            <Link
              to="/login"
              className={`text-lg text-gray-700 hover:text-blue-600 ${
                location.pathname === '/login' ? 'font-semibold text-blue-600' : ''
              }`}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
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
          {navLinks.map((link) => (
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

          {isLoggedIn && user ? (
            <div className="flex items-center space-x-3 mt-2">
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`block text-gray-700 py-1 ${
                location.pathname === '/login' ? 'font-semibold text-blue-600' : ''
              }`}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
