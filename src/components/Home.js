import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8, ease: 'easeOut' }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)' },
    tap: { scale: 0.95 }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        {/* Main Heading */}
        <motion.h1
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent"
        >
          Welcome to
        </motion.h1>
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-pulse"
        >
          Link<span className="text-cyan-300">Vault</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed"
        >
          Store, organize, and share your favorite YouTube videos, tweets, articles, and links effortlessly. 
          Your personal vault, always accessible.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center space-x-2"
            onClick={() => navigate('/signup')}
          >
            <span>Get Started Free</span>
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="group border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
            onClick={() => navigate('/signin')}
          >
            <span>Sign In</span>
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>

      {/* Wave Divider (SVG for bottom curve) */}
      <div className="absolute bottom-0 left-0 w-full h-24">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 0L1440 80C1440 80 1440 120 1440 120H0V0Z" fill="rgba(255,255,255,0.1)" />
        </svg>
      </div>
    </section>
  );
};

export default Home;