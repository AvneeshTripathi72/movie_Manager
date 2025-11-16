const Show = require('../models/Show');
const { sendSuccess, sendError } = require('../utils/helpers');
const { validateShow } = require('../utils/validation');
const showService = require('../services/showService');

// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date, page = 1, limit = 20 } = req.query;

    let query = {};
    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.dateTime = { $gte: startDate, $lt: endDate };
    }

    const skip = (page - 1) * limit;
    const shows = await Show.find(query)
      .populate('movieId', 'title')
      .populate('theatreId', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ dateTime: 1 });

    const total = await Show.countDocuments(query);

    sendSuccess(res, 200, {
      shows,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Shows retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving shows', err.message);
  }
};

// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId')
      .populate('screenId');

    if (!show) {
      return sendError(res, 404, 'Show not found');
    }

    sendSuccess(res, 200, show, 'Show retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving show', err.message);
  }
};

// @route   GET /api/shows/:id/seats
// @access  Public
exports.getShowSeats = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) {
      return sendError(res, 404, 'Show not found');
    }

    const seats = await showService.getAvailableSeats(req.params.id);

    sendSuccess(res, 200, { seats, availableCount: seats.length }, 'Seats retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving seats', err.message);
  }
};

// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res) => {
  try {
    const { error, value } = validateShow(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const show = new Show(value);
    await show.save();

    sendSuccess(res, 201, show, 'Show created successfully');
  } catch (err) {
    sendError(res, 500, 'Server error creating show', err.message);
  }
};

// @route   PATCH /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res) => {
  try {
    const { error, value } = validateShow(req.body, true);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const show = await Show.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!show) {
      return sendError(res, 404, 'Show not found');
    }

    sendSuccess(res, 200, show, 'Show updated successfully');
  } catch (err) {
    sendError(res, 500, 'Server error updating show', err.message);
  }
};

// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return sendError(res, 404, 'Show not found');
    }

    sendSuccess(res, 200, { _id: show._id }, 'Show deleted successfully');
  } catch (err) {
    sendError(res, 500, 'Server error deleting show', err.message);
  }
};
