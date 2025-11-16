const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: [true, 'Screen ID is required'],
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time is required'],
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX'],
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
    },
    seatPrice: {
      type: Number,
      required: [true, 'Seat price is required'],
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: [{
      type: String,
    }],
    availableSeats: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries
showSchema.index({ movieId: 1 });
showSchema.index({ theatreId: 1 });
showSchema.index({ dateTime: 1 });
showSchema.index({ movieId: 1, theatreId: 1, dateTime: 1 });

module.exports = mongoose.model('Show', showSchema);
