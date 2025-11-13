import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

function WishlistButton({ productId, isInWishlist: initialState = false, onToggle }) {
  const [isInWishlist, setIsInWishlist] = useState(initialState);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async () => {
    setIsAnimating(true);
    
    try {
      const newState = !isInWishlist;
      setIsInWishlist(newState);
      
      if (onToggle) {
        await onToggle(productId, newState);
      }
      
      toast.success(
        newState ? 'Added to wishlist!' : 'Removed from wishlist!',
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    } catch (error) {
      setIsInWishlist(!isInWishlist); // Revert on error
      toast.error('Something went wrong!');
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`relative p-2 rounded-full transition-all duration-200 ${
        isInWishlist
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={isAnimating ? {
          scale: [1, 1.3, 1],
          rotate: [0, 15, -15, 0]
        } : {}}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {isInWishlist ? (
          <HeartIconSolid className="w-5 h-5" />
        ) : (
          <HeartIcon className="w-5 h-5" />
        )}
      </motion.div>
      
      {/* Floating hearts animation */}
      {isAnimating && isInWishlist && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              initial={{ 
                scale: 0, 
                x: '-50%', 
                y: '-50%', 
                opacity: 1 
              }}
              animate={{
                scale: [0, 1, 0],
                x: ['-50%', `${(i - 1) * 30 - 50}%`],
                y: ['-50%', '-150%'],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <HeartIconSolid className="w-3 h-3 text-pink-500" />
            </motion.div>
          ))}
        </>
      )}
    </motion.button>
  );
}

export default WishlistButton;
