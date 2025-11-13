import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get('/api/wishlist', config);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        toast.error('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setActionLoading(prev => ({ ...prev, [productId]: true }));
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`/api/wishlist/remove/${productId}`, config);
      
      // Update local state
      setWishlist(prev => ({
        ...prev,
        products: prev.products.filter(item => item.product._id !== productId)
      }));

      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const addToCart = async (productId) => {
    try {
      setActionLoading(prev => ({ ...prev, [`cart_${productId}`]: true }));
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.post('/api/cart/add', { productId, quantity: 1 }, config);
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setActionLoading(prev => ({ ...prev, [`cart_${productId}`]: false }));
    }
  };

  const moveToCart = async (productIds) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Add to cart first
      for (const productId of productIds) {
        await axios.post('/api/cart/add', { productId, quantity: 1 }, config);
      }

      // Then remove from wishlist
      await axios.post('/api/wishlist/move-to-cart', { productIds }, config);
      
      // Update local state
      setWishlist(prev => ({
        ...prev,
        products: prev.products.filter(item => !productIds.includes(item.product._id))
      }));

      toast.success(`Moved ${productIds.length} item(s) to cart`);
    } catch (error) {
      console.error('Error moving to cart:', error);
      toast.error('Failed to move items to cart');
    }
  };

  const clearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete('/api/wishlist/clear', config);
      setWishlist({ products: [] });
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Wishlist link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FiHeart className="mr-3 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 mt-2">{products.length} item(s) saved</p>
          </div>
          
          {products.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
              <button
                onClick={shareWishlist}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiShare2 className="mr-2" />
                Share
              </button>
              <button
                onClick={() => moveToCart(products.map(item => item.product._id))}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiShoppingCart className="mr-2" />
                Move All to Cart
              </button>
              <button
                onClick={clearWishlist}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="mr-2" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Start adding products you love to your wishlist!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.product.images?.[0] || '/api/placeholder/300/300'}
                      alt={item.product.name}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => navigate(`/products/${item.product._id}`)}
                    />
                    {item.product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                        -{item.product.discount}%
                      </div>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item.product._id)}
                      disabled={actionLoading[item.product._id]}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      {actionLoading[item.product._id] ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiHeart className="text-red-500 fill-current" />
                      )}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 
                      className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
                      onClick={() => navigate(`/products/${item.product._id}`)}
                    >
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {item.product.discount > 0 ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">
                              ${(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${item.product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${item.product.price}
                          </span>
                        )}
                      </div>
                      
                      {item.product.rating > 0 && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {item.product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                      {item.product.stock > 0 ? (
                        <span className="text-green-600 text-sm font-medium">In Stock</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(item.product._id)}
                        disabled={item.product.stock === 0 || actionLoading[`cart_${item.product._id}`]}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        {actionLoading[`cart_${item.product._id}`] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FiShoppingCart className="mr-2" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 mt-2">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
