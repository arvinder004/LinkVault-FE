import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedLinks } from '../services/api';
import LinksList from './LinksList';

const SharedPage = () => {
  const { token } = useParams();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const { data } = await getSharedLinks(token);
        setLinks(data);
      } catch (err) {
        console.error(err);
        alert('Invalid or expired share link.');
      }
    };
    fetchShared();
  }, [token]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center">Shared Links</h2>
      <LinksList links={links} />
    </div>
  );
};

export default SharedPage;