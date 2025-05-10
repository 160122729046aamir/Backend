const Review = require('../models/Review');

// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

// Submit a new review
exports.submitReview = async (req, res) => {
    try {
        const { name, service, rating, content } = req.body;

        // Validate required fields
        if (!name || !service || !rating || !content) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create review without requiring user authentication
        const review = new Review({
            name,
            service,
            rating,
            content,
            role: 'Customer', // Default role
            verified: true, // Auto-verify for now
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}` // Generate avatar from name
        });

        await review.save();
        res.status(201).json({ success: true, message: 'Review submitted successfully', review });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
};