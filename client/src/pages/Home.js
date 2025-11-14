import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaShoppingCart, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axios.get('/api/products?limit=8&sortBy=rating&sortOrder=desc');
        setFeaturedProducts(res.data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    addToCart({
      product: product._id,
      name: product.name,
      price: product.discount > 0 
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price,
      image: product.images[0],
      stock: product.stock
    }, 1);
    
    toast.success('Added to cart successfully!');
  };

  const categories = [
    { name: 'Electronics', icon: '📱', color: 'bg-blue-500' },
    { name: 'Clothing', icon: '👕', color: 'bg-green-500' },
    { name: 'Books', icon: '📚', color: 'bg-yellow-500' },
    { name: 'Home', icon: '🏠', color: 'bg-purple-500' },
    { name: 'Sports', icon: '⚽', color: 'bg-red-500' },
    { name: 'Beauty', icon: '💄', color: 'bg-pink-500' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">
            Welcome to MERN Shop
          </h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
              <FaArrowRight />
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title text-center">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn btn-primary">
              View All
              <FaArrowRight />
            </Link>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.discount > 0 && (
                    <div className="product-badge">
                      {product.discount}% OFF
                    </div>
                  )}
                  {product.stock > 0 && (
                    <div className="stock-badge">
                      In Stock
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">
                    {product.name}
                  </h3>
                  <p className="product-description">
                    {product.description}
                  </p>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < Math.floor(product.rating)
                              ? ''
                              : 'empty'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="review-count">
                      ({product.numReviews})
                    </span>
                  </div>
                  <div className="product-price">
                    {product.discount > 0 ? (
                      <>
                        <span className="current-price">
                          ₹{Math.round(product.price * (1 - product.discount / 100))}
                        </span>
                        <span className="original-price">
                          ₹{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">₹{product.price}</span>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="action-btn add-to-cart-btn"
                    >
                      <FaPlus />
                      {product.stock === 0 ? 'Out of Stock' : 'Add Cart'}
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="action-btn view-btn"
                    >
                      <FaShoppingCart />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                🚚
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Get your orders delivered quickly and safely to your doorstep.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                💰
              </div>
              <h3 className="feature-title">Best Prices</h3>
              <p className="feature-description">
                Competitive prices and great deals on all our products.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                🛡️
              </div>
              <h3 className="feature-title">Secure Payment</h3>
              <p className="feature-description">
                Safe and secure payment options with Razorpay integration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 