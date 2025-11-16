const Theatre = require('../models/Theatre');
const { sendSuccess, sendError } = require('../utils/helpers');
const { validateTheatre } = require('../utils/validation');

// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res) => {
  try {
    const { city, search, page = 1, limit = 20 } = req.query;

    let query = {};
    if (city) query.city = city;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const theatres = await Theatre.find(query)
      .populate('screens')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Theatre.countDocuments(query);

    sendSuccess(res, 200, {
      theatres,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Theatres retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving theatres', err.message);
  }
};

// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id).populate('screens');
    if (!theatre) {
      return sendError(res, 404, 'Theatre not found');
    }

    sendSuccess(res, 200, theatre, 'Theatre retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving theatre', err.message);
  }
};

// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res) => {
  try {
    const { error, value } = validateTheatre(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const theatre = new Theatre(value);
    await theatre.save();

    sendSuccess(res, 201, theatre, 'Theatre created successfully');
  } catch (err) {
    sendError(res, 500, 'Server error creating theatre', err.message);
  }
};

// @route   PATCH /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res) => {
  try {
    const { error, value } = validateTheatre(req.body, true);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const theatre = await Theatre.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!theatre) {
      return sendError(res, 404, 'Theatre not found');
    }

    sendSuccess(res, 200, theatre, 'Theatre updated successfully');
  } catch (err) {
    sendError(res, 500, 'Server error updating theatre', err.message);
  }
};

// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);
    if (!theatre) {
      return sendError(res, 404, 'Theatre not found');
    }

    sendSuccess(res, 200, { _id: theatre._id }, 'Theatre deleted successfully');
  } catch (err) {
    sendError(res, 500, 'Server error deleting theatre', err.message);
  }
};
