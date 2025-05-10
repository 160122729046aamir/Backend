const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrder, placeOrder, paypalSuccess } = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware');

// GET /api/orders - Admin: get all orders
router.get('/', protect, getAllOrders);
// PATCH /api/orders/:id - Admin: update order status/paymentStatus
router.patch('/:id', protect, updateOrder);
// POST /api/orders/checkout - Place order and send emails
router.post('/checkout', placeOrder);
// PATCH /api/orders/:id/paypal - Mark order as paid after PayPal
router.patch('/:id/paypal', paypalSuccess);

module.exports = router;
