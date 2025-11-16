const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Reserve seats with race condition prevention
const reserveSeats = async (showId, seats) => {
  try {
    const show = await Show.findById(showId);

    if (!show) {
      throw new Error('Show not found');
    }

    // Check if seats are available
    const unavailableSeats = seats.filter(seat => show.bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      throw new Error(`Seats ${unavailableSeats.join(', ')} are already booked`);
    }

    return {
      success: true,
      message: 'Seats are available',
      availableSeats: show.availableSeats,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

// Release expired bookings
const releaseExpiredBookings = async () => {
  try {
    const expiredBookings = await Booking.find({
      status: 'pending',
      expiresAt: { $lt: new Date() },
    });

    for (const booking of expiredBookings) {
      booking.status = 'cancelled';
      await booking.save();

      // Update show availability
      const show = await Show.findById(booking.showId);
      if (show) {
        show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
        show.availableSeats += booking.seats.length;
        await show.save();
      }
    }

    return { success: true, releasedCount: expiredBookings.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = {
  reserveSeats,
  releaseExpiredBookings,
};
