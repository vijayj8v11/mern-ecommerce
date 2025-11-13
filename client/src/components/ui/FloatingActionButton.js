import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  HeartIcon, 
  ShoppingCartIcon, 
  ChatBubbleLeftIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actions = [
    {
      icon: HeartIcon,
      label: 'Wishlist',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => console.log('Wishlist clicked')
    },
    {
      icon: ShoppingCartIcon,
      label: 'Cart',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => console.log('Cart clicked')
    },
    {
      icon: ChatBubbleLeftIcon,
      label: 'Chat',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => console.log('Chat clicked')
    },
    {
      icon: ArrowUpIcon,
      label: 'Top',
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: scrollToTop
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex flex-col space-y-3 mb-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.onClick}
                className={`p-3 rounded-full text-white shadow-lg transition-all duration-200 ${action.color}`}
                title={action.label}
              >
                <action.icon className="w-5 h-5" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMenu}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <PlusIcon className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}

export default FloatingActionButton;
