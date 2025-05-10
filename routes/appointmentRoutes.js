const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');

// Public routes
router.post('/', appointmentController.createAppointment);

// Protected routes (require authentication)
router.use(protect);
router.get('/', appointmentController.getAppointments);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router;