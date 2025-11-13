import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

function FilterSidebar({ isOpen, onClose, onFilterChange, filters = {} }) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    brand: false,
    discount: false
  });

  const [localFilters, setLocalFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0,
    brands: [],
    discount: 0,
    ...filters
  });

  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 
    'Sports', 'Beauty', 'Automotive', 'Toys'
  ];

  const brands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 
    'Sony', 'LG', 'Dell', 'HP'
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category];
    
    const newFilters = { ...localFilters, categories: updatedCategories };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brand) => {
    const updatedBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    const newFilters = { ...localFilters, brands: updatedBrands };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newFilters = { ...localFilters, priceRange: [0, value] };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating) => {
    const newFilters = { ...localFilters, rating };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      brands: [],
      discount: 0
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const FilterSection = ({ title, children, sectionKey }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <motion.div
          animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto lg:relative lg:w-full lg:shadow-none"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                  <button onClick={onClose} className="lg:hidden">
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <FilterSection title="Category" sectionKey="category">
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range Filter */}
              <FilterSection title="Price Range" sectionKey="price">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">$0</span>
                    <span className="text-sm text-gray-600">${localFilters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={localFilters.priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection title="Customer Rating" sectionKey="rating">
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      className={`flex items-center space-x-2 w-full text-left p-2 rounded ${
                        localFilters.rating === rating ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          i < rating ? (
                            <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                          )
                        ))}
                      </div>
                      <span className="text-sm text-gray-700">& above</span>
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Brand Filter */}
              <FilterSection title="Brand" sectionKey="brand">
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.brands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Discount Filter */}
              <FilterSection title="Discount" sectionKey="discount">
                <div className="space-y-2">
                  {[50, 40, 30, 20, 10].map(discount => (
                    <button
                      key={discount}
                      onClick={() => {
                        const newFilters = { ...localFilters, discount };
                        setLocalFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className={`block w-full text-left p-2 rounded text-sm ${
                        localFilters.discount === discount ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      {discount}% or more
                    </button>
                  ))}
                </div>
              </FilterSection>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default FilterSidebar;
