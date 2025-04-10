const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');
const upload = require('../middleware/uploadMiddleware');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// Create a new review
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received review data:', req.body);

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Invalid request body',
        received: req.body
      });
    }

    // Extract and validate fields
    const { productId, productName, hygiene, quality, review } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Check for missing fields
    const missingFields = [];
    if (!productId) missingFields.push('productId');
    if (!productName) missingFields.push('productName');
    if (!review) missingFields.push('review');
    if (!hygiene && hygiene !== 0) missingFields.push('hygiene');
    if (!quality && quality !== 0) missingFields.push('quality');

    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
        received: req.body
      });
    }

    // Parse and validate ratings
    const hygieneRating = parseInt(hygiene);
    const qualityRating = parseInt(quality);

    if (isNaN(hygieneRating) || hygieneRating < 1 || hygieneRating > 5 ||
        isNaN(qualityRating) || qualityRating < 1 || qualityRating > 5) {
      console.error('Invalid ratings:', { hygiene, quality });
      return res.status(400).json({
        success: false,
        message: 'Ratings must be between 1 and 5',
        received: { hygiene, quality },
        parsed: { hygieneRating, qualityRating }
      });
    }

    // Clean up the review data
    const reviewData = {
      productId: String(productId).trim(),
      productName: String(productName).trim(),
      hygiene: hygieneRating,
      quality: qualityRating,
      review: String(review).trim(),
      image: image
    };

    console.log('Creating review with data:', reviewData);

    // Check if collection exists and drop indexes if needed
    try {
      const collections = await mongoose.connection.db.listCollections({ name: 'reviews' }).toArray();
      if (collections.length > 0) {
        await mongoose.connection.db.collection('reviews').dropIndexes();
        console.log('Dropped old indexes');
      }
    } catch (indexError) {
      console.log('No existing indexes to drop:', indexError.message);
    }

    // Create and save the review
    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();

    console.log('Review saved successfully:', savedReview);
    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review: savedReview
    });

  } catch (error) {
    console.error('Error creating review:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A review for this product already exists',
        error: error.message
      });
    }

    // Handle other MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

module.exports = router;
