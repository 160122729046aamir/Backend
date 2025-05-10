const express = require('express');
const router = express.Router();
const { getReviews, submitReview } = require('../controllers/reviewController');

// Get all reviews
router.get('/', getReviews);

// Submit a new review
router.post('/', submitReview);

module.exports = router;