import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  StarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

function ProductComparison({ products, onClose, onRemoveProduct }) {
  if (!products || products.length === 0) return null;

  const features = [
    'Price',
    'Rating',
    'Brand',
    'Category',
    'Availability',
    'Warranty',
    'Return Policy',
    'Shipping'
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < Math.floor(rating) ? (
        <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
      ) : (
        <StarIcon key={i} className="w-4 h-4 text-gray-300" />
      )
    ));
  };

  const getFeatureValue = (product, feature) => {
    switch (feature) {
      case 'Price':
        return `$${product.price}`;
      case 'Rating':
        return (
          <div className="flex items-center space-x-1">
            <div className="flex">{renderStars(product.rating || 4)}</div>
            <span className="text-sm">({product.rating || 4})</span>
          </div>
        );
      case 'Brand':
        return product.brand || 'Generic';
      case 'Category':
        return product.category || 'General';
      case 'Availability':
        return product.stock > 0 ? (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            In Stock
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Out of Stock
          </div>
        );
      case 'Warranty':
        return product.warranty || '1 Year';
      case 'Return Policy':
        return product.returnPolicy || '30 Days';
      case 'Shipping':
        return product.freeShipping ? 'Free' : '$5.99';
      default:
        return 'N/A';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Product Comparison</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold text-gray-700 bg-gray-50">Features</th>
                  {products.map((product) => (
                    <th key={product._id} className="p-4 bg-gray-50 min-w-64">
                      <div className="relative">
                        <button
                          onClick={() => onRemoveProduct(product._id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        <img
                          src={product.images?.[0] || '/placeholder-image.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto mb-2"
                        />
                        <h3 className="font-semibold text-sm text-center text-gray-800 line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-medium text-gray-700 border-r">
                      {feature}
                    </td>
                    {products.map((product) => (
                      <td key={product._id} className="p-4 text-center">
                        {getFeatureValue(product, feature)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-center space-x-4">
              {products.map((product) => (
                <button
                  key={product._id}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => window.open(`/products/${product._id}`, '_blank')}
                >
                  View Details
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProductComparison;
