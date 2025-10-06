import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLinks, addLink, deleteLink, generateShare } from '../services/api';
import AddLinkModal from './AddLinkModal';
import ShareLinkModal from './ShareLinkModal';
import LinksList from './LinksList';
import Loading from './Loading';
import { PlusIcon, ShareIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [shareLink, setShareLink] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);

  // Handle manual Add Link modal open
  const handleOpenAddLinkModal = () => {
    setIsAddLinkModalOpen(true);
  };

  // Handle Share Links button click
  const handleOpenShareLinkModal = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await generateShare();
      setShareLink(data.shareLink);
      setIsShareLinkModalOpen(true);
      setMessage({ text: 'Share link generated!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to generate share link.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

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
      setIsAddLinkModalOpen(false); // Close Add Link modal after adding link
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

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' },
    tap: { scale: 0.95 }
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
      <AddLinkModal isOpen={isAddLinkModalOpen} onClose={() => setIsAddLinkModalOpen(false)} onAdd={handleAddLink} />

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={isShareLinkModalOpen}
        onClose={() => setIsShareLinkModalOpen(false)}
        shareLink={shareLink}
        onCopy={handleCopyShareLink}
      />

      {/* Dashboard Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 space-y-8"
      >
        {/* Header with Share Button */}
        <div className="flex justify-between items-center">
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent"
          >
            Your LinkVault Dashboard
          </motion.h2>
          <motion.button
            variants={buttonVariants}
            whileHover={isLoading ? {} : 'hover'}
            whileTap={isLoading ? {} : 'tap'}
            onClick={handleOpenShareLinkModal}
            className={`flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-emerald-500 text-white py-2 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-emerald-600'}`}
            disabled={isLoading}
            aria-label="Share your links"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share Links</span>
          </motion.button>
        </div>

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

        {/* Add Link Button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.button
            variants={buttonVariants}
            whileHover={isLoading ? {} : 'hover'}
            whileTap={isLoading ? {} : 'tap'}
            onClick={handleOpenAddLinkModal}
            className={`flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
            disabled={isLoading}
            aria-label="Add a new link"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Link</span>
          </motion.button>
        </motion.div>

        {/* Links List */}
        <motion.div variants={itemVariants}>
          <LinksList links={links} onDelete={handleDelete} />
        </motion.div>

        {/* Add Link Form (shown only when links exist) */}
        {/* {links.length > 0 && (
          <motion.div variants={itemVariants}>
            <AddLink onAdd={handleAddLink} />
          </motion.div>
        )} */}
      </motion.div>
    </section>
  );
};

export default Dashboard;