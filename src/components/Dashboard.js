import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLinks, addLink, deleteLink, generateShare } from '../services/api';
import AddLink from './AddLink';
import AddLinkModal from './AddLinkModal';
import LinksList from './LinksList';
import Loading from './Loading';
import { ClipboardIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize showAddLinkModal to prevent re-creation
  const showAddLinkModal = useCallback(() => {
    if (links.length === 0 && !isLoading) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [links, isLoading]);

  useEffect(() => {
    fetchLinks();
  }, []);

  // Update modal visibility when links or isLoading change
  useEffect(() => {
    showAddLinkModal();
  }, [links, isLoading, showAddLinkModal]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchLinks = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await getLinks();
      setLinks(data || []);
      console.log('Links fetched:', data);
    } catch (err) {
      console.error('Fetch Links Error Details:', {
        message: err.message,
        code: err.code,
        response: err.response?.status,
        config: err.config?.url
      });
      setMessage({
        text: err.code === 'ERR_NETWORK'
          ? 'Network issue—check if backend is running.'
          : 'Failed to fetch links. Please refresh.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async (newLink) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await addLink(newLink);
      setLinks([data, ...links]);
      setMessage({ text: 'Link added successfully!', type: 'success' });
      setIsModalOpen(false); // Close modal after adding link
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to add link.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link._id !== id));
      setMessage({ text: 'Link deleted successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete link.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateShare = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await generateShare();
      setShareLink(data.shareLink);
      setMessage({ text: 'Share link generated!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to generate share link.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setMessage({ text: 'Share link copied to clipboard!', type: 'success' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        {isLoading && <Loading message="Processing..." />}
      </AnimatePresence>

      {/* Add Link Modal */}
      <AddLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddLink} />

      {/* Dashboard Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 space-y-8"
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent"
        >
          Your LinkVault Dashboard
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
        <motion.div variants={itemVariants}>
          <LinksList links={links} onDelete={handleDelete} />
        </motion.div>

        {/* Add Link Form (shown only when links exist) */}
        {links.length > 0 && (
          <motion.div variants={itemVariants}>
            <AddLink onAdd={handleAddLink} />
          </motion.div>
        )}

        {/* Share Link Section */}
        <motion.div variants={itemVariants} className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateShare}
            className={`w-full bg-gradient-to-r from-cyan-400 to-emerald-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-emerald-600'}`}
            disabled={isLoading}
          >
            Generate Share Link
          </motion.button>
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/20"
            >
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 truncate flex-1"
              >
                {shareLink}
              </a>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyShareLink}
                className="ml-2 p-2 bg-cyan-400/20 rounded-full hover:bg-cyan-400/30 transition-all duration-200"
                aria-label="Copy share link"
              >
                <ClipboardIcon className="h-5 w-5 text-cyan-400" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Dashboard;