const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate } = require('../middleware/auth');

// @route   POST /api/bookings/reserve
// @access  Private
router.post('/reserve', authenticate, bookingController.reserveSeats);

// @route   POST /api/bookings/confirm
// @access  Private
router.post('/confirm', authenticate, bookingController.confirmBooking);

// @route   GET /api/bookings
// @access  Private
router.get('/', authenticate, bookingController.getMyBookings);

// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', authenticate, bookingController.getBookingById);

// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', authenticate, bookingController.cancelBooking);

module.exports = router;
