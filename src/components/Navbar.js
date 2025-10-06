import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
        LinkVault
      </div>
      <div>
        {!token ? (
          <>
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded mr-2 hover:bg-blue-100"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </>
        ) : (
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;