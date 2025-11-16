const Show = require('../models/Show');
const Booking = require('../models/Booking');

// Get available seats for a show
const getAvailableSeats = async (showId) => {
  try {
    const show = await Show.findById(showId);

    if (!show) {
      throw new Error('Show not found');
    }

    // Generate all seat numbers based on layout
    const screen = await require('../models/Screen').findById(show.screenId);
    const totalSeats = screen.layout.rows * screen.layout.columns;

    const allSeats = [];
    for (let i = 0; i < screen.layout.rows; i++) {
      for (let j = 0; j < screen.layout.columns; j++) {
        const seatNumber = String.fromCharCode(65 + i) + (j + 1); // A1, A2, etc.
        allSeats.push(seatNumber);
      }
    }

    // Filter out booked seats
    const availableSeats = allSeats.filter(seat => !show.bookedSeats.includes(seat));

    return availableSeats;
  } catch (err) {
    throw new Error(`Error getting available seats: ${err.message}`);
  }
};

// Update show seat availability
const updateShowAvailability = async (showId, bookedSeats) => {
  try {
    const show = await Show.findById(showId);

    if (!show) {
      throw new Error('Show not found');
    }

    show.bookedSeats.push(...bookedSeats);
    show.availableSeats -= bookedSeats.length;

    await show.save();

    return {
      success: true,
      availableSeats: show.availableSeats,
    };
  } catch (err) {
    throw new Error(`Error updating show availability: ${err.message}`);
  }
};

// Get show statistics
const getShowStatistics = async (showId) => {
  try {
    const show = await Show.findById(showId);
    const bookings = await Booking.find({ showId, status: 'confirmed' });

    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    return {
      showId,
      totalSeats: show.totalSeats,
      bookedSeats: show.bookedSeats.length,
      availableSeats: show.availableSeats,
      bookingCount: bookings.length,
      totalRevenue,
      occupancyRate: ((show.totalSeats - show.availableSeats) / show.totalSeats * 100).toFixed(2) + '%',
    };
  } catch (err) {
    throw new Error(`Error getting show statistics: ${err.message}`);
  }
};

module.exports = {
  getAvailableSeats,
  updateShowAvailability,
  getShowStatistics,
};
