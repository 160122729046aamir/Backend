const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts, updateProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

// POST /api/products - Add new product (admin only)
router.post('/', protect, addProduct);

// GET /api/products - Get all products (public)
router.get('/', getAllProducts);

// PATCH /api/products/:id - Update a product (admin only)
router.patch('/:id', protect, updateProduct);

module.exports = router;
