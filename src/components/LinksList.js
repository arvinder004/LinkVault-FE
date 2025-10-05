import React from 'react';

const LinksList = ({ links, onDelete }) => {
  return (
    <ul className="space-y-4">
      {links.map((link) => (
        <li key={link._id} className="bg-white p-4 rounded-lg shadow-md">
          <h5 className="text-lg font-semibold">{link.title} ({link.type})</h5>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {link.url}
          </a>
          <p className="text-gray-600">{link.description}</p>
          {onDelete && (
            <button
              onClick={() => onDelete(link._id)}
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default LinksList;