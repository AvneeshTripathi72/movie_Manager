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

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);

router.post('/', auth, admin, createShow);
router.get('/', auth, admin, getAllShows);

module.exports = router;
