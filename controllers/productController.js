const Product = require('../models/Product');

// Add a new product (admin only)
exports.addProduct = async (req, res) => {
  try {
    // Only admin can add products
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { name, description, price, image, category, subcategory, stock } = req.body;
    if (!name || !description || !price || !image || !category || !subcategory || stock == null) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const product = new Product({ name, description, price, image, category, subcategory, stock });
    await product.save();
    // Emit real-time event if socket.io is available
    if (req.app.get('io')) {
      req.app.get('io').emit('newProduct', product);
    }
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all products (public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update a product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    const update = req.body;
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
