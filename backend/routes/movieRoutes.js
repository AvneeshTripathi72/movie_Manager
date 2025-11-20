
const express = require('express');
const router = express.Router();
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', getAllMovies);

router.get('/:id', getMovieById);

router.post('/', auth, admin, createMovie);

router.put('/:id', auth, admin, updateMovie);

router.delete('/:id', auth, admin, deleteMovie);

module.exports = router;
