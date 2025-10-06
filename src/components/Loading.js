import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-cyan-400 border-r-purple-400 border-b-blue-400 border-l-transparent rounded-full"
        ></motion.div>
        {/* Message */}
        {message && (
          <p className="text-white text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {message}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Loading;