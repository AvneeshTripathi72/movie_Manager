const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/shows
// @access  Public
router.get('/', showController.getShows);

// @route   GET /api/shows/:id
// @access  Public
router.get('/:id', showController.getShowById);

// @route   GET /api/shows/:id/seats
// @access  Public
router.get('/:id/seats', showController.getShowSeats);

// @route   POST /api/shows
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), showController.createShow);

// @route   PATCH /api/shows/:id
// @access  Private/Admin
router.patch('/:id', authenticate, authorize('admin'), showController.updateShow);

// @route   DELETE /api/shows/:id
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), showController.deleteShow);

module.exports = router;
