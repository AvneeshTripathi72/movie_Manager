const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { sendSuccess, sendError } = require('../utils/helpers');
const { validateBooking } = require('../utils/validation');
const bookingService = require('../services/bookingService');

// @route   POST /api/bookings/reserve
// @access  Private
exports.reserveSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || seats.length === 0) {
      return sendError(res, 400, 'Show ID and seats are required');
    }

    const show = await Show.findById(showId);
    if (!show) {
      return sendError(res, 404, 'Show not found');
    }

    // Check seat availability
    const unavailable = seats.filter(seat => show.bookedSeats.includes(seat));
    if (unavailable.length > 0) {
      return sendError(res, 409, `Seats ${unavailable.join(', ')} are already booked`);
    }

    // Create booking with 10 minute expiry
    const booking = new Booking({
      userId: req.user.id,
      showId,
      seats,
      status: 'pending',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await booking.save();

    sendSuccess(res, 201, booking, 'Seats reserved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error reserving seats', err.message);
  }
};

// @route   POST /api/bookings/confirm
// @access  Private
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, email, phone, paymentMethod } = req.body;

    if (!bookingId) {
      return sendError(res, 400, 'Booking ID is required');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== req.user.id) {
      return sendError(res, 403, 'Unauthorized to confirm this booking');
    }

    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (!paymentSuccess) {
      return sendError(res, 400, 'Payment failed. Please try again.');
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.email = email;
    booking.phone = phone;
    booking.paymentMethod = paymentMethod;

    // Update show booked seats
    const show = await Show.findById(booking.showId);
    show.bookedSeats.push(...booking.seats);
    show.availableSeats -= booking.seats.length;

    // Calculate total price
    booking.totalPrice = booking.seats.length * show.seatPrice;

    await booking.save();
    await show.save();

    sendSuccess(res, 200, booking, 'Booking confirmed successfully');
  } catch (err) {
    sendError(res, 500, 'Server error confirming booking', err.message);
  }
};

// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('showId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({ userId: req.user.id });

    sendSuccess(res, 200, {
      bookings,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    }, 'Bookings retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving bookings', err.message);
  }
};

// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('showId');

    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return sendError(res, 403, 'Unauthorized to view this booking');
    }

    sendSuccess(res, 200, booking, 'Booking retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving booking', err.message);
  }
};

// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return sendError(res, 404, 'Booking not found');
    }

    if (booking.userId.toString() !== req.user.id) {
      return sendError(res, 403, 'Unauthorized to cancel this booking');
    }

    if (booking.status === 'cancelled') {
      return sendError(res, 400, 'Booking is already cancelled');
    }

    // Update booking status
    booking.status = 'cancelled';

    // Update show booked seats
    const show = await Show.findById(booking.showId);
    show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
    show.availableSeats += booking.seats.length;

    await booking.save();
    await show.save();

    sendSuccess(res, 200, booking, 'Booking cancelled successfully');
  } catch (err) {
    sendError(res, 500, 'Server error cancelling booking', err.message);
  }
};
