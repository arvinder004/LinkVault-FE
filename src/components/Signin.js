import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { signin } from '../services/api';
import Loading from './Loading';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear message after 3 seconds or on input change
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await signin({ email, password });
      localStorage.setItem('token', data.token);
      setMessage({ text: 'Signed in successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Signin failed. Please check your credentials.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: 'easeOut' }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' },
    tap: { scale: 0.95 }
  };

  return (
    <section className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden py-12">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && <Loading message="Signing you in..." />}
      </AnimatePresence>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20"
      >
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent mb-8">
          Welcome Back to LinkVault
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={inputVariants} className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage({ text: '', type: '' });
              }}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              required
              aria-label="Email address"
              disabled={isLoading}
            />
          </motion.div>

          {/* Password Input */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={inputVariants} className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage({ text: '', type: '' });
              }}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
              required
              aria-label="Password"
              disabled={isLoading}
            />
          </motion.div>

          {/* Message */}
          <AnimatePresence>
            {message.text && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm text-center ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            variants={buttonVariants}
            whileHover={isLoading ? {} : 'hover'}
            whileTap={isLoading ? {} : 'tap'}
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
            disabled={isLoading}
          >
            Sign In
          </motion.button>
        </form>

        {/* Link to Signup */}
        <p className="text-center text-gray-200 mt-6">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-200"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </section>
  );
};

export default Signin;