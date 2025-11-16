const { sendError } = require('../utils/helpers');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return sendError(res, 400, 'Validation error', messages);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return sendError(res, 409, `${field} already exists`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Default server error
  sendError(res, 500, 'Internal server error', err.message);
};

module.exports = errorHandler;
