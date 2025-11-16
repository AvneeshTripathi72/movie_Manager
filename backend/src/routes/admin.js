const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/admin/bookings
// @access  Private/Admin
router.get('/bookings', authenticate, authorize('admin'), adminController.getAllBookings);

// @route   POST /api/admin/bookings/confirm
// @access  Private/Admin
router.post('/bookings/confirm', authenticate, authorize('admin'), adminController.manualConfirmBooking);

// @route   POST /api/admin/bookings/cancel
// @access  Private/Admin
router.post('/bookings/cancel', authenticate, authorize('admin'), adminController.manualCancelBooking);

// @route   GET /api/admin/reports/sales
// @access  Private/Admin
router.get('/reports/sales', authenticate, authorize('admin'), adminController.getSalesReport);

// @route   GET /api/admin/reports/top-movies
// @access  Private/Admin
router.get('/reports/top-movies', authenticate, authorize('admin'), adminController.getTopMovies);

// @route   GET /api/admin/activity-logs
// @access  Private/Admin
router.get('/activity-logs', authenticate, authorize('admin'), adminController.getActivityLogs);

// @route   GET /api/admin/activity-logs/summary
// @access  Private/Admin
router.get('/activity-logs/summary', authenticate, authorize('admin'), adminController.getActivitySummary);

// @route   GET /api/admin/activity-logs/user/:userId
// @access  Private/Admin
router.get('/activity-logs/user/:userId', authenticate, authorize('admin'), adminController.getUserActivityLog);

module.exports = router;
