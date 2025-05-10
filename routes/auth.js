// routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login, updateProfile } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
    res.json({ user: req.user });
});

// Profile routes
router.get('/user/profile', protect, async (req, res) => {
    try {
        // User is already populated with appointments and orders from middleware
        const user = req.user;

        // Calculate some additional stats
        const totalOrders = user.orders.length;
        const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalAppointments = user.appointments.length;

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                stats: {
                    totalOrders,
                    totalSpent,
                    totalAppointments
                },
                appointments: user.appointments,
                orders: user.orders,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching profile',
            error: error.message 
        });
    }
});

router.post('/user/profile', protect, updateProfile);

module.exports = router;
