const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'Genre is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 1,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    director: {
      type: String,
      required: [true, 'Director is required'],
    },
    cast: [String],
    language: {
      type: [String],
      default: ['English'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    posterUrl: {
      type: String,
      default: null,
    },
    trailerUrl: {
      type: String,
      default: null,
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

// Index for search queries
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });

module.exports = mongoose.model('Movie', movieSchema);
