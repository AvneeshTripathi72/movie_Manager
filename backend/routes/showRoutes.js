const express = require('express');
const router = express.Router();
const {
  createShow,
  getShowsByMovie,
  getAllShows,
  getShowById
} = require('../controllers/showController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/:movieId', getShowsByMovie);
router.get('/detail/:id', getShowById);

// Admin routes
router.post('/', auth, admin, createShow);
router.get('/', auth, admin, getAllShows);

module.exports = router;
