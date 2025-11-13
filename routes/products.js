const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @route   GET /api/products
// @desc    Get all products with filtering, search, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    
    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Track product view
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { 'analytics.views': 1 }
    });
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', [
  auth,
  admin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').not().isEmpty(),
    body('brand', 'Brand is required').not().isEmpty(),
    body('stock', 'Stock must be a positive integer').isInt({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
      features,
      specifications,
      discount
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      images: images || [],
      stock,
      features: features || [],
      specifications: specifications || {},
      discount: discount || 0
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', [
  auth,
  admin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('price', 'Price must be a positive number').isFloat({ min: 0 }),
    body('category', 'Category is required').not().isEmpty(),
    body('brand', 'Brand is required').not().isEmpty(),
    body('stock', 'Stock must be a positive integer').isInt({ min: 0 })
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      images,
      stock,
      features,
      specifications,
      discount
    } = req.body;

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.brand = brand;
    if (images) product.images = images;
    product.stock = stock;
    if (features) product.features = features;
    if (specifications) product.specifications = specifications;
    if (discount !== undefined) product.discount = discount;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add a product review
// @access  Private
router.post('/:id/reviews', [
  auth,
  [
    body('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    body('comment', 'Comment is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: parseInt(req.body.rating),
      comment: req.body.comment
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    console.error('Error adding review:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/categories
// @desc    Get all unique categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/brands
// @desc    Get all unique brands
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({
      $or: [
        { rating: { $gte: 4.5 } },
        { 'analytics.views': { $gte: 100 } },
        { discount: { $gte: 20 } }
      ]
    })
    .sort({ rating: -1, 'analytics.views': -1 })
    .limit(8);
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/trending
// @desc    Get trending products
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const trendingProducts = await Product.find({})
      .sort({ 'analytics.views': -1, 'analytics.addedToCart': -1 })
      .limit(10);
    
    res.json(trendingProducts);
  } catch (error) {
    console.error('Error fetching trending products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/recommendations/:id
// @desc    Get product recommendations based on category and brand
// @access  Public
router.get('/recommendations/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const recommendations = await Product.find({
      _id: { $ne: req.params.id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    })
    .sort({ rating: -1 })
    .limit(6);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/analytics/:id
// @desc    Get product analytics (Admin only)
// @access  Private/Admin
router.get('/analytics/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name analytics rating numReviews');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/products/:id/track-cart
// @desc    Track when product is added to cart
// @access  Private
router.post('/:id/track-cart', auth, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      $inc: { 'analytics.addedToCart': 1 }
    });
    
    res.json({ message: 'Cart tracking updated' });
  } catch (error) {
    console.error('Error tracking cart addition:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
