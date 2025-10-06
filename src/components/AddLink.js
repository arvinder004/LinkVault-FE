import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkIcon, DocumentTextIcon, TagIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Loading from './Loading';

const AddLink = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Other');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

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
      await onAdd({ url, title, type, description });
      setMessage({ text: 'Link added successfully!', type: 'success' });
      setUrl('');
      setTitle('');
      setType('Other');
      setDescription('');
    } catch (err) {
      setMessage({ text: 'Failed to add link.', type: 'error' });
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
    <div className="relative">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && <Loading message="Adding your link..." />}
      </AnimatePresence>

      {/* Form Container */}
      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent mb-6">
          Add a New Link
        </h2>

        {/* URL Input */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={inputVariants} className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            placeholder="Enter URL (e.g., https://youtube.com/...)"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
            required
            aria-label="Link URL"
            disabled={isLoading}
          />
        </motion.div>

        {/* Title Input */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={inputVariants} className="relative">
          <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            placeholder="Enter title"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
            required
            aria-label="Link title"
            disabled={isLoading}
          />
        </motion.div>

        {/* Type Select */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={inputVariants} className="relative">
          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 appearance-none"
            aria-label="Link type"
            disabled={isLoading}
          >
            <option value="YouTube">YouTube</option>
            <option value="Tweet">Tweet</option>
            <option value="Article">Article</option>
            <option value="Other">Other</option>
          </select>
        </motion.div>

        {/* Description Textarea */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={inputVariants} className="relative">
          <PencilSquareIcon className="absolute left-3 top-4 h-5 w-5 text-cyan-400" />
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setMessage({ text: '', type: '' });
            }}
            placeholder="Add a description (optional)"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 min-h-[100px]"
            aria-label="Link description"
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
          Add Link
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddLink;