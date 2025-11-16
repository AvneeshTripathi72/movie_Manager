const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/theatres
// @access  Public
router.get('/', theatreController.getTheatres);

// @route   GET /api/theatres/:id
// @access  Public
router.get('/:id', theatreController.getTheatreById);

// @route   POST /api/theatres
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), theatreController.createTheatre);

// @route   PATCH /api/theatres/:id
// @access  Private/Admin
router.patch('/:id', authenticate, authorize('admin'), theatreController.updateTheatre);

// @route   DELETE /api/theatres/:id
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), theatreController.deleteTheatre);

module.exports = router;
