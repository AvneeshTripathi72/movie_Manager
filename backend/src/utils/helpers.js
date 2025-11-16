const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';

  const accessToken = jwt.sign(
    { userId, role },
    secret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    secret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const sendSuccess = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

const formatResponse = (success, message, data = null) => {
  return {
    success,
    message,
    ...(data && { data }),
  };
};

const handleAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  generateToken,
  sendSuccess,
  sendError,
  formatResponse,
  handleAsyncError,
};
