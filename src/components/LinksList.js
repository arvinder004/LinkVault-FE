import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, ChatBubbleLeftIcon, NewspaperIcon, LinkIcon, TrashIcon } from '@heroicons/react/24/outline';

const LinksList = ({ links, onDelete }) => {
  const getIconForType = (type) => {
    switch (type) {
      case 'YouTube':
        return <PlayIcon className="h-6 w-6 text-cyan-400" />;
      case 'Tweet':
        return <ChatBubbleLeftIcon className="h-6 w-6 text-cyan-400" />;
      case 'Article':
        return <NewspaperIcon className="h-6 w-6 text-cyan-400" />;
      default:
        return <LinkIcon className="h-6 w-6 text-cyan-400" />;
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
    })
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 5px 15px rgba(239, 68, 68, 0.4)' },
    tap: { scale: 0.95 }
  };

  return (
    <ul className="space-y-4">
      {links.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-200 text-lg"
        >
          No links yet. Add one above!
        </motion.p>
      ) : (
        links.map((link, index) => (
          <motion.li
            key={link._id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="backdrop-blur-md bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">{getIconForType(link.type)}</div>
              <div className="flex-1">
                <h5 className="text-lg font-semibold text-white">
                  {link.title} <span className="text-cyan-400 text-sm">({link.type})</span>
                </h5>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline decoration-2 decoration-cyan-400/50 hover:decoration-cyan-300 transition-all duration-200"
                  aria-label={`Visit ${link.title}`}
                >
                  {link.url}
                </a>
                {link.description && (
                  <p className="text-gray-300 mt-2">{link.description}</p>
                )}
                {link.tags && link.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {link.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-cyan-400/20 text-cyan-400 text-sm px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {link.folder && (
                  <p className="text-gray-400 text-sm mt-2">
                    Folder: {link.folder.parent ? `${link.folder.parent.name} > ` : ''}{link.folder.name}
                  </p>
                )}
              </div>
              {onDelete && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => onDelete(link._id)}
                  className="flex-shrink-0 bg-red-500/20 text-red-400 p-2 rounded-full hover:bg-red-500/30 transition-all duration-200"
                  aria-label={`Delete ${link.title}`}
                >
                  <TrashIcon className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </motion.li>
        ))
      )}
    </ul>
  );
};

export default LinksList;