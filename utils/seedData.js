const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config({ path: './config.env' });

const sampleProducts = [
  {
    name: 'iPhone 14 Pro',
    description: 'Latest iPhone with advanced camera system and A16 Bionic chip',
    price: 99999,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'
    ],
    stock: 50,
    rating: 4.5,
    numReviews: 12,
    features: ['A16 Bionic chip', '48MP camera', 'Always-On display', 'Emergency SOS'],
    specifications: {
      'Screen Size': '6.1 inches',
      'Storage': '128GB',
      'Color': 'Space Black',
      'Battery': 'Up to 23 hours'
    }
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Premium Android smartphone with exceptional performance',
    price: 79999,
    category: 'Electronics',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'
    ],
    stock: 35,
    rating: 4.3,
    numReviews: 8,
    features: ['Snapdragon 8 Gen 2', '200MP camera', 'S Pen support', 'Wireless charging'],
    specifications: {
      'Screen Size': '6.8 inches',
      'Storage': '256GB',
      'Color': 'Phantom Black',
      'Battery': '5000mAh'
    }
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Air Max technology',
    price: 12999,
    category: 'Sports',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    stock: 100,
    rating: 4.7,
    numReviews: 25,
    features: ['Air Max technology', 'Breathable mesh', 'Rubber outsole', 'Cushioned midsole'],
    specifications: {
      'Material': 'Mesh and synthetic',
      'Sole': 'Rubber',
      'Closure': 'Lace-up',
      'Weight': '300g'
    }
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic novel by F. Scott Fitzgerald',
    price: 599,
    category: 'Books',
    brand: 'Scribner',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    ],
    stock: 200,
    rating: 4.8,
    numReviews: 45,
    features: ['Hardcover', 'Classic literature', 'Bestseller', 'Educational'],
    specifications: {
      'Pages': '240',
      'Language': 'English',
      'Publisher': 'Scribner',
      'ISBN': '978-0743273565'
    }
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic coffee maker for perfect brew every time',
    price: 3999,
    category: 'Home',
    brand: 'BrewMaster',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'
    ],
    stock: 75,
    rating: 4.2,
    numReviews: 18,
    features: ['Programmable timer', 'Auto-shutoff', '12-cup capacity', 'Permanent filter'],
    specifications: {
      'Capacity': '12 cups',
      'Power': '900W',
      'Material': 'Stainless steel',
      'Warranty': '2 years'
    }
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones',
    price: 15999,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    ],
    stock: 60,
    rating: 4.6,
    numReviews: 32,
    features: ['Active noise cancellation', '30-hour battery', 'Touch controls', 'Quick charge'],
    specifications: {
      'Driver Size': '40mm',
      'Frequency': '4Hz-40kHz',
      'Battery': '30 hours',
      'Weight': '250g'
    }
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for home workouts',
    price: 1499,
    category: 'Sports',
    brand: 'FitLife',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'
    ],
    stock: 150,
    rating: 4.4,
    numReviews: 28,
    features: ['Non-slip surface', 'Eco-friendly material', 'Lightweight', 'Easy to clean'],
    specifications: {
      'Size': '183x61cm',
      'Thickness': '6mm',
      'Material': 'TPE',
      'Weight': '1.2kg'
    }
  },
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine set for all skin types',
    price: 2499,
    category: 'Beauty',
    brand: 'GlowUp',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
    ],
    stock: 80,
    rating: 4.3,
    numReviews: 15,
    features: ['Cleanser', 'Toner', 'Moisturizer', 'Sunscreen'],
    specifications: {
      'Skin Type': 'All types',
      'Volume': '100ml each',
      'Ingredients': 'Natural',
      'Cruelty-free': 'Yes'
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create regular user
    const regularUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();
    console.log('Created regular user');

    // Create products
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
    }
    console.log('Created sample products');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 