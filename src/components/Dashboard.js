import React, { useEffect, useState } from 'react';
import { getLinks, addLink, deleteLink, generateShare } from '../services/api';
import AddLink from './AddLink';
import LinksList from './LinksList';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data } = await getLinks();
      setLinks(data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch links.');
    }
  };

  const handleAddLink = async (newLink) => {
    try {
      const { data } = await addLink(newLink);
      setLinks([data, ...links]);
    } catch (err) {
      console.error(err);
      alert('Failed to add link.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      setLinks(links.filter((link) => link._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete link.');
    }
  };

  const handleGenerateShare = async () => {
    try {
      const { data } = await generateShare();
      setShareLink(data.shareLink);
    } catch (err) {
      console.error(err);
      alert('Failed to generate share link.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">Dashboard</h2>
      <AddLink onAdd={handleAddLink} />
      <LinksList links={links} onDelete={handleDelete} />
      <button
        onClick={handleGenerateShare}
        className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
      >
        Generate Share Link
      </button>
      {shareLink && (
        <p className="text-center">
          Shareable Link: <a href={shareLink} className="text-blue-500 underline">{shareLink}</a>
        </p>
      )}
    </div>
  );
};

export default Dashboard;