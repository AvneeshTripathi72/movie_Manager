const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings
} = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// User routes (require authentication)
router.post('/', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);

// Admin routes
router.get('/', auth, admin, getAllBookings);

module.exports = router;
