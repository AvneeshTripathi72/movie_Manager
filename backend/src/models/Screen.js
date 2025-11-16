const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema(
  {
    screenNumber: {
      type: Number,
      required: [true, 'Screen number is required'],
      min: 1,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Screen capacity is required'],
      min: 1,
    },
    layout: {
      rows: {
        type: Number,
        required: true,
      },
      columns: {
        type: Number,
        required: true,
      },
    },
    facilities: [String],
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
screenSchema.index({ theatreId: 1 });

module.exports = mongoose.model('Screen', screenSchema);
