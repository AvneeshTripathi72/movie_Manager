const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show ID is required'],
    },
    seats: {
      type: [String],
      required: [true, 'Seats are required'],
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from creation
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically remove pending bookings after expiry
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Regular indexes for queries
bookingSchema.index({ userId: 1 });
bookingSchema.index({ showId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
