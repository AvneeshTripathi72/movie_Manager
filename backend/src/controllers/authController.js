const User = require('../models/User');
const { generateToken, sendSuccess, sendError } = require('../utils/helpers');
const { validateRegister, validateLogin } = require('../utils/validation');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { error, value } = validateRegister(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const { name, email, password } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: email.endsWith('@gmail.com') ? 'admin' : 'user',
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id, user.role);

    sendSuccess(res, 201, {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 'User registered successfully');
  } catch (err) {
    sendError(res, 500, 'Server error during registration', err.message);
  }
};

// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateToken(user._id, user.role);

    sendSuccess(res, 200, {
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 'Login successful');
  } catch (err) {
    sendError(res, 500, 'Server error during login', err.message);
  }
};

// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, user, 'User retrieved successfully');
  } catch (err) {
    sendError(res, 500, 'Server error retrieving user', err.message);
  }
};
