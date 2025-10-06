import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { getLinks, addLink, deleteLink, getFolders, addFolder, updateFolder, deleteFolder } from '../services/api';
import AddLink from './AddLink';
import AddLinkModal from './AddLinkModal';
import ShareLinkModal from './ShareLinkModal';
import LinksList from './LinksList';
import Loading from './Loading';
import { ClipboardIcon, PlusIcon, ShareIcon, FolderIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ItemTypes = {
  FOLDER: 'folder'
};

const FolderItem = ({ folder, onSelect, onUpdate, onDelete, folders }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FOLDER,
    item: { id: folder._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FOLDER,
    drop: (item) => {
      if (item.id !== folder._id) {
        onUpdate(item.id, { parent: folder._id });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${isDragging ? 'opacity-50' : ''} ${isOver ? 'bg-white/10' : ''}`}
      onClick={() => onSelect(folder._id)}
    >
      <FolderIcon className="h-5 w-5 text-cyan-400" />
      <span className="text-white flex-1">
        {folder.parent ? `${folder.parent.name} > ` : ''}{folder.name}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          const newName = prompt('Enter new folder name:', folder.name);
          if (newName) onUpdate(folder._id, { name: newName });
        }}
        className="text-gray-200 hover:text-cyan-400"
        aria-label={`Edit folder ${folder.name}`}
      >
        <PencilIcon className="h-4 w-4" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Delete this folder and move its links?')) onDelete(folder._id);
        }}
        className="text-gray-200 hover:text-red-400"
        aria-label={`Delete folder ${folder.name}`}
      >
        <TrashIcon className="h-4 w-4" />
      </motion.button>
    </div>
  );
};

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);

  useEffect(() => {
    fetchLinks();
    fetchFolders();
  }, []);

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

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const { data } = await getFolders();
      setFolders(data || []);
      console.log('Folders fetched:', data);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to fetch folders.', type: 'error' });
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
      setIsAddLinkModalOpen(false);
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

  const handleAddFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;
    setIsLoading(true);
    try {
      const { data } = await addFolder({ name, parent: selectedFolder || null });
      setFolders([...folders, data]);
      setMessage({ text: 'Folder added successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to add folder.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFolder = async (id, updates) => {
    setIsLoading(true);
    try {
      const { data } = await updateFolder(id, updates);
      setFolders(folders.map(f => f._id === id ? data : f));
      setMessage({ text: 'Folder updated successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update folder.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = async (id) => {
    setIsLoading(true);
    try {
      await deleteFolder(id);
      setFolders(folders.filter(f => f._id !== id));
      if (selectedFolder === id) setSelectedFolder(null);
      setMessage({ text: 'Folder deleted successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to delete folder.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddLinkModal = () => {
    setIsAddLinkModalOpen(true);
  };

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

  // Filter links by selected folder
  const filteredLinks = selectedFolder
    ? links.filter(link => link.folder && link.folder._id === selectedFolder)
    : links;

  return (
    <section className="min-h-screen hero-gradient relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <AnimatePresence>
        {isLoading && <Loading message="Processing..." />}
      </AnimatePresence>

      <AddLinkModal isOpen={isAddLinkModalOpen} onClose={() => setIsAddLinkModalOpen(false)} onAdd={handleAddLink} />
      <ShareLinkModal
        isOpen={isShareLinkModalOpen}
        onClose={() => setIsShareLinkModalOpen(false)}
        shareLink={shareLink}
        onCopy={handleCopyShareLink}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 space-y-8"
      >
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

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
          {/* Folder Tree */}
          <div className="md:w-1/3 backdrop-blur-md bg-white/10 p-4 rounded-2xl shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Folders</h3>
              <motion.button
                whileHover={isLoading ? {} : { scale: 1.1 }}
                whileTap={isLoading ? {} : { scale: 0.9 }}
                onClick={handleAddFolder}
                className={`flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}`}
                disabled={isLoading}
                aria-label="Add new folder"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Folder</span>
              </motion.button>
            </div>
            <div className="space-y-2">
              <motion.div
                className={`p-2 rounded-lg cursor-pointer ${selectedFolder === null ? 'bg-white/10' : ''}`}
                onClick={() => setSelectedFolder(null)}
              >
                <FolderIcon className="h-5 w-5 text-cyan-400 inline mr-2" />
                <span className="text-white">All Links</span>
              </motion.div>
              {folders.map(folder => (
                <FolderItem
                  key={folder._id}
                  folder={folder}
                  onSelect={setSelectedFolder}
                  onUpdate={handleUpdateFolder}
                  onDelete={handleDeleteFolder}
                  folders={folders}
                />
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="md:w-2/3 space-y-6">
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
            <motion.div variants={itemVariants}>
              <LinksList links={filteredLinks} onDelete={handleDelete} />
            </motion.div>
            {filteredLinks.length > 0 && (
              <motion.div variants={itemVariants}>
                <AddLink onAdd={handleAddLink} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Dashboard;