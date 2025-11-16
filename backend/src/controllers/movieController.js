const Movie = require('../models/Movie');
const { sendSuccess, sendError } = require('../utils/helpers');
const { validateMovie } = require('../utils/validation');

// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res) => {
  try {
    const { genre, language, search, sort = '-releaseDate', page = 1, limit = 20 } = req.query;

    let query = {};
    if (genre) query.genre = genre;
    if (language) query.language = language;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Movie.countDocuments(query);

    sendSuccess(res, 200, {
      movies,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Movies retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving movies', err.message);
  }
};

// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, 200, movie, 'Movie retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving movie', err.message);
  }
};

// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res) => {
  try {
    const { error, value } = validateMovie(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const movie = new Movie(value);
    await movie.save();

    sendSuccess(res, 201, movie, 'Movie created successfully');
  } catch (err) {
    sendError(res, 500, 'Server error creating movie', err.message);
  }
};

// @route   PATCH /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res) => {
  try {
    const { error, value } = validateMovie(req.body, true);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, 200, movie, 'Movie updated successfully');
  } catch (err) {
    sendError(res, 500, 'Server error updating movie', err.message);
  }
};

// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return sendError(res, 404, 'Movie not found');
    }

    sendSuccess(res, 200, { _id: movie._id }, 'Movie deleted successfully');
  } catch (err) {
    sendError(res, 500, 'Server error deleting movie', err.message);
  }
};
