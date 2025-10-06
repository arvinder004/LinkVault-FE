import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSharedLinks } from '../services/api';
import LinksList from './LinksList';
import Loading from './Loading';

const SharedPage = () => {
  const { token } = useParams();
  const [links, setLinks] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchShared = async () => {
      setIsLoading(true);
      setMessage({ text: '', type: '' });
      try {
        const { data } = await getSharedLinks(token);
        setLinks(data);
        setMessage({ text: 'Shared links loaded successfully!', type: 'success' });
      } catch (err) {
        console.error(err);
        setMessage({ text: 'Invalid or expired share link.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchShared();
  }, [token]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section className="min-h-screen hero-gradient relative overflow-hidden py-12">
      {/* Floating Particles */}
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && <Loading message="Fetching shared links..." />}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 space-y-8"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent animate-pulse"
        >
          Shared Links
        </motion.h2>

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

        {/* Links List */}
        <motion.div variants={itemVariants} className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
          <LinksList links={links} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SharedPage;