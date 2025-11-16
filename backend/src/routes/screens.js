const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/screens
// @access  Public
router.get('/', screenController.getScreens);

// @route   GET /api/screens/:id
// @access  Public
router.get('/:id', screenController.getScreenById);

// @route   POST /api/screens
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), screenController.createScreen);

// @route   PATCH /api/screens/:id
// @access  Private/Admin
router.patch('/:id', authenticate, authorize('admin'), screenController.updateScreen);

// @route   DELETE /api/screens/:id
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), screenController.deleteScreen);

module.exports = router;
