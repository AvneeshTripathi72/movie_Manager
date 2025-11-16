const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/movies
// @access  Public
router.get('/', movieController.getMovies);

// @route   GET /api/movies/:id
// @access  Public
router.get('/:id', movieController.getMovieById);

// @route   POST /api/movies
// @access  Private/Admin
router.post('/', authenticate, authorize('admin'), movieController.createMovie);

// @route   PATCH /api/movies/:id
// @access  Private/Admin
router.patch('/:id', authenticate, authorize('admin'), movieController.updateMovie);

// @route   DELETE /api/movies/:id
// @access  Private/Admin
router.delete('/:id', authenticate, authorize('admin'), movieController.deleteMovie);

module.exports = router;
