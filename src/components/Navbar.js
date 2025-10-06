import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = token ? (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-to-r from-cyan-400 to-emerald-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
      onClick={handleLogout}
    >
      Logout
    </motion.button>
  ) : (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-50 mr-3 shadow-md"
        onClick={() => navigate('/signup')}
      >
        Sign Up
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl"
        onClick={() => navigate('/signin')}
      >
        Sign In
      </motion.button>
    </>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            Link<span className="text-cyan-400 animate-pulse">Vault</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden pb-4 space-y-2"
            >
              {token ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-gradient-to-r from-cyan-400 to-emerald-500 text-white py-3 rounded-lg font-semibold"
                  onClick={handleLogout}
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold"
                    onClick={() => navigate('/signin')}
                  >
                    Sign In
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;