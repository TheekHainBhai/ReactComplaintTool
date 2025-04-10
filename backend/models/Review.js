const mongoose = require('mongoose');

// Drop existing indexes before creating new schema
mongoose.connection.on('connected', async () => {
  try {
    await mongoose.connection.db.collection('reviews').dropIndexes();
    console.log('Dropped existing indexes on reviews collection');
  } catch (error) {
    console.log('No existing indexes to drop or collection does not exist');
  }
});

const reviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    trim: true
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  hygiene: {
    type: Number,
    required: [true, 'Hygiene rating is required'],
    min: [1, 'Hygiene rating must be between 1 and 5'],
    max: [5, 'Hygiene rating must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Hygiene rating must be a whole number'
    }
  },
  quality: {
    type: Number,
    required: [true, 'Quality rating is required'],
    min: [1, 'Quality rating must be between 1 and 5'],
    max: [5, 'Quality rating must be between 1 and 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Quality rating must be a whole number'
    }
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [1, 'Review cannot be empty']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create a compound index on productId
reviewSchema.index({ productId: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
