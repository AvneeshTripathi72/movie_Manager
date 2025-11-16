const { logActivity } = require('../utils/activityLogger');

/**
 * Middleware to log all user activities
 */
const activityLogger = (req, res, next) => {
  // Capture response
  const originalSend = res.send;

  res.send = function (data) {
    // Get user info from JWT token or session
    const userId = req.user?.id || req.user?._id || 'anonymous';
    const userEmail = req.user?.email || 'unknown';

    // Only log successful requests (2xx status codes)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const activity = {
        userId,
        userEmail,
        method: req.method,
        endpoint: req.path,
        action: getActionFromRequest(req),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        query: req.query,
        body: sanitizeBody(req.body),
        timestamp: new Date().toISOString()
      };

      // Log activity asynchronously (non-blocking)
      setImmediate(() => {
        logActivity(activity);
      });
    }

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Determine the action from request
 */
const getActionFromRequest = (req) => {
  const method = req.method;
  const path = req.path;

  if (path.includes('auth') || path.includes('login')) return 'LOGIN';
  if (path.includes('logout')) return 'LOGOUT';
  if (path.includes('register')) return 'REGISTER';
  if (path.includes('bookings')) && method === 'POST') return 'CREATE_BOOKING';
  if (path.includes('bookings') && method === 'GET') return 'VIEW_BOOKING';
  if (path.includes('bookings') && method === 'DELETE') return 'CANCEL_BOOKING';
  if (path.includes('movies') && method === 'GET') return 'VIEW_MOVIES';
  if (path.includes('shows') && method === 'GET') return 'VIEW_SHOWS';
  if (path.includes('theatres') && method === 'GET') return 'VIEW_THEATRES';
  if (path.includes('admin') && method === 'GET') return 'ADMIN_VIEW';
  if (path.includes('admin') && method === 'POST') return 'ADMIN_CREATE';
  if (path.includes('admin') && method === 'PUT') return 'ADMIN_UPDATE';
  if (path.includes('admin') && method === 'DELETE') return 'ADMIN_DELETE';
  if (method === 'POST') return 'CREATE';
  if (method === 'PUT') return 'UPDATE';
  if (method === 'DELETE') return 'DELETE';
  if (method === 'GET') return 'VIEW';
  
  return 'UNKNOWN';
};

/**
 * Sanitize request body to remove sensitive data
 */
const sanitizeBody = (body) => {
  if (!body) return {};

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

module.exports = activityLogger;
