const Screen = require('../models/Screen');
const { sendSuccess, sendError } = require('../utils/helpers');
const { validateScreen } = require('../utils/validation');

// @route   GET /api/screens
// @access  Public
exports.getScreens = async (req, res) => {
  try {
    const { theatreId, page = 1, limit = 20 } = req.query;

    let query = {};
    if (theatreId) query.theatreId = theatreId;

    const skip = (page - 1) * limit;
    const screens = await Screen.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Screen.countDocuments(query);

    sendSuccess(res, 200, {
      screens,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Screens retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving screens', err.message);
  }
};

// @route   GET /api/screens/:id
// @access  Public
exports.getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id);
    if (!screen) {
      return sendError(res, 404, 'Screen not found');
    }

    sendSuccess(res, 200, screen, 'Screen retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving screen', err.message);
  }
};

// @route   POST /api/screens
// @access  Private/Admin
exports.createScreen = async (req, res) => {
  try {
    const { error, value } = validateScreen(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const screen = new Screen(value);
    await screen.save();

    sendSuccess(res, 201, screen, 'Screen created successfully');
  } catch (err) {
    sendError(res, 500, 'Server error creating screen', err.message);
  }
};

// @route   PATCH /api/screens/:id
// @access  Private/Admin
exports.updateScreen = async (req, res) => {
  try {
    const { error, value } = validateScreen(req.body, true);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const screen = await Screen.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!screen) {
      return sendError(res, 404, 'Screen not found');
    }

    sendSuccess(res, 200, screen, 'Screen updated successfully');
  } catch (err) {
    sendError(res, 500, 'Server error updating screen', err.message);
  }
};

// @route   DELETE /api/screens/:id
// @access  Private/Admin
exports.deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) {
      return sendError(res, 404, 'Screen not found');
    }

    sendSuccess(res, 200, { _id: screen._id }, 'Screen deleted successfully');
  } catch (err) {
    sendError(res, 500, 'Server error deleting screen', err.message);
  }
};
