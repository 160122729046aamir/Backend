const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update order status/paymentStatus (admin only)
exports.updateOrder = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Place order and send emails
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, userEmail } = req.body;
    if (!items || !shippingAddress || !totalAmount || !userEmail) {
      return res.status(400).json({ message: 'Missing order details' });
    }
    // Create order
    const order = await Order.create({
      user: req.user?._id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'paypal',
      orderNumber: `ORD-${Date.now()}`
    });
    // Send emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    // Email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Order Requested',
      text: `A new order has been requested. Order ID: ${order._id}`
    });
    // Email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmed',
      text: `Your order has been received and is being processed. Order ID: ${order._id}`
    });
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PayPal payment confirmation
exports.paypalSuccess = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = 'processing';
    order.paymentStatus = 'completed';
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
