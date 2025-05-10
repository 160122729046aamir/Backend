const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  service: {
    type: String,
    required: [true, 'Service is required']
  },
  rating: {
    type: Number,
    required: [true, 'Review must have a rating'],
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: [true, 'Review must have content'],
    trim: true,
    maxlength: 500
  },
  role: {
    type: String,
    default: 'Customer'
  },
  image: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;