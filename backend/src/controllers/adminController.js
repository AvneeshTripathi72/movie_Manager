const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { sendSuccess, sendError } = require('../utils/helpers');
const { 
  getUserActivities, 
  getActivitiesByAction, 
  getActivitiesByDateRange 
} = require('../utils/activityLogger');

// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('showId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    sendSuccess(res, 200, {
      bookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Bookings retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving bookings', err.message);
  }
};

// @route   POST /api/admin/bookings/confirm
// @access  Private/Admin
exports.manualConfirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    booking.status = 'confirmed';
    await booking.save();

    sendSuccess(res, 200, booking, 'Booking confirmed manually');
  } catch (err) {
    sendError(res, 500, 'Server error confirming booking', err.message);
  }
};

// @route   POST /api/admin/bookings/cancel
// @access  Private/Admin
exports.manualCancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    booking.status = 'cancelled';
    await booking.save();

    sendSuccess(res, 200, booking, 'Booking cancelled manually');
  } catch (err) {
    sendError(res, 500, 'Server error cancelling booking', err.message);
  }
};

// @route   GET /api/admin/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'confirmed' })
      .populate('showId');

    let totalRevenue = 0;
    const showRevenue = {};

    bookings.forEach(booking => {
      totalRevenue += booking.totalPrice || 0;
      const showId = booking.showId._id;
      showRevenue[showId] = (showRevenue[showId] || 0) + (booking.totalPrice || 0);
    });

    sendSuccess(res, 200, {
      totalRevenue,
      bookingCount: bookings.length,
      showRevenue,
    }, 'Sales report retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving sales report', err.message);
  }
};

// @route   GET /api/admin/reports/top-movies
// @access  Private/Admin
exports.getTopMovies = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'confirmed' })
      .populate({
        path: 'showId',
        populate: { path: 'movieId' },
      });

    const movieStats = {};

    bookings.forEach(booking => {
      const movieId = booking.showId.movieId._id;
      if (!movieStats[movieId]) {
        movieStats[movieId] = {
          movieId,
          title: booking.showId.movieId.title,
          bookings: 0,
          revenue: 0,
        };
      }
      movieStats[movieId].bookings += 1;
      movieStats[movieId].revenue += booking.totalPrice || 0;
    });

    const topMovies = Object.values(movieStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    sendSuccess(res, 200, topMovies, 'Top movies retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving top movies', err.message);
  }
};

// @route   GET /api/admin/activity-logs
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
  try {
    const { 
      userId, 
      action, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 50 
    } = req.query;

    let activities = [];

    // Get activities based on filters
    if (userId) {
      activities = getUserActivities(userId);
    } else if (action) {
      activities = getActivitiesByAction(action);
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      activities = getActivitiesByDateRange(start, end);
    } else {
      // Get all activities from all log files
      const fs = require('fs');
      const path = require('path');
      const logsDir = path.join(__dirname, '../../frontend/logs');
      
      if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir).filter(file => file.startsWith('activity_'));
        
        logFiles.forEach(file => {
          const filePath = path.join(logsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const fileActivities = JSON.parse(content);
          activities.push(...fileActivities);
        });
      }
    }

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    sendSuccess(res, 200, {
      activities: paginatedActivities,
      pagination: {
        total: activities.length,
        page: parseInt(page),
        pages: Math.ceil(activities.length / limit),
        limit: parseInt(limit)
      },
      filters: { userId, action, startDate, endDate }
    }, 'Activity logs retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving activity logs', err.message);
  }
};

// @route   GET /api/admin/activity-logs/summary
// @access  Private/Admin
exports.getActivitySummary = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const logsDir = path.join(__dirname, '../../frontend/logs');
    const summaryPath = path.join(logsDir, 'activity_summary.json');

    if (!fs.existsSync(summaryPath)) {
      return sendSuccess(res, 200, {
        message: 'No activity logs generated yet',
        totalLogsGenerated: 0,
        stats: {
          totalActivities: 0,
          userActions: {},
          actionTypes: {}
        }
      }, 'No activity summary available');
    }

    const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
    const summary = JSON.parse(summaryContent);

    sendSuccess(res, 200, summary, 'Activity summary retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving activity summary', err.message);
  }
};

// @route   GET /api/admin/activity-logs/user/:userId
// @access  Private/Admin
exports.getUserActivityLog = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const activities = getUserActivities(userId);

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const skip = (page - 1) * limit;
    const paginatedActivities = activities.slice(skip, skip + parseInt(limit));

    sendSuccess(res, 200, {
      userId,
      activities: paginatedActivities,
      pagination: {
        total: activities.length,
        page: parseInt(page),
        pages: Math.ceil(activities.length / limit),
        limit: parseInt(limit)
      }
    }, `Activity logs for user ${userId} retrieved successfully`);
  } catch (err) {
    sendError(res, 500, 'Server error retrieving user activity logs', err.message);
  }
};
