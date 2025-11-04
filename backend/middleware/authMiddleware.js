const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Protect middleware - verifies JWT token and attaches user to request
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {Function} next
 */
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  } catch (error) {
    res.status(401).json({ message: 'Token failed' })
  }
}

/**
 * Authorization middleware factory - restrict routes to provided roles
 * Usage: authorize('admin') or authorize('admin', 'manager')
 * @param  {...string} roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
}
