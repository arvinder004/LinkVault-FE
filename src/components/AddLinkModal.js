import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddLink from './AddLink';

const AddLinkModal = ({ isOpen, onClose, onAdd }) => {
  const modalRef = useRef();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 relative"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-200 hover:text-cyan-400 transition-colors duration-200"
              aria-label="Close modal"
            >
              <XMarkIcon className="h-6 w-6" />
            </motion.button>

            {/* Modal Header */}
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent mb-6">
              Add Your Link
            </h2>

            {/* AddLink Form */}
            <AddLink onAdd={onAdd} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLinkModal;