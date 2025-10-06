import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { getFolders } from '../services/api';
import { LinkIcon } from '@heroicons/react/24/outline';

const AddLink = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'YouTube',
    description: '',
    tags: [],
    folder: ''
  });
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const { data } = await getFolders();
        setFolders(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFolders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagsChange = (selectedOptions) => {
    setFormData({ ...formData, tags: selectedOptions ? selectedOptions.map(opt => opt.value) : [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onAdd(formData);
      setFormData({ title: '', url: '', type: 'YouTube', description: '', tags: [], folder: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert folders to options for select
  const folderOptions = folders.map(folder => ({
    value: folder._id,
    label: folder.parent ? `${folder.parent.name} > ${folder.name}` : folder.name
  }));

  // Tag options (allow custom tags)
  const tagOptions = formData.tags.map(tag => ({ value: tag, label: tag }));

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20 space-y-4"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Enter link title"
          required
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="url">
          URL
        </label>
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-5 w-5 text-cyan-400" />
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="https://example.com"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option value="YouTube">YouTube</option>
          <option value="Tweet">Tweet</option>
          <option value="Article">Article</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="tags">
          Tags
        </label>
        <Select
          isMulti
          id="tags"
          name="tags"
          value={tagOptions}
          onChange={handleTagsChange}
          options={tagOptions}
          isCreatable
          placeholder="Add tags..."
          className="text-black"
          styles={{
            control: (base) => ({
              ...base,
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.5rem'
            }),
            multiValue: (base) => ({
              ...base,
              background: 'rgba(6, 182, 212, 0.2)',
              color: '#fff'
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#fff'
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: '#fff',
              ':hover': { background: 'rgba(239, 68, 68, 0.5)' }
            }),
            input: (base) => ({
              ...base,
              color: '#fff'
            }),
            placeholder: (base) => ({
              ...base,
              color: 'rgba(156, 163, 175, 0.8)'
            })
          }}
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="folder">
          Folder
        </label>
        <Select
          id="folder"
          name="folder"
          value={folderOptions.find(opt => opt.value === formData.folder) || null}
          onChange={(option) => setFormData({ ...formData, folder: option ? option.value : '' })}
          options={[{ value: '', label: 'No Folder' }, ...folderOptions]}
          placeholder="Select a folder..."
          className="text-black"
          styles={{
            control: (base) => ({
              ...base,
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              padding: '0.5rem'
            }),
            singleValue: (base) => ({
              ...base,
              color: '#fff'
            }),
            option: (base, { isSelected }) => ({
              ...base,
              color: '#fff',
              background: isSelected ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              ':hover': { background: 'rgba(6, 182, 212, 0.2)' }
            }),
            placeholder: (base) => ({
              ...base,
              color: 'rgba(156, 163, 175, 0.8)'
            })
          }}
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Enter a description (optional)"
          rows="4"
        />
      </div>
      <motion.button
        whileHover={isLoading ? {} : { scale: 1.05, boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)' }}
        whileTap={isLoading ? {} : { scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-cyan-400 to-emerald-500 text-white py-3 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-emerald-600'}`}
      >
        {isLoading ? 'Adding...' : 'Add Link'}
      </motion.button>
    </motion.form>
  );
};

export default AddLink;