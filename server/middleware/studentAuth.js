const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';
const COOKIE_NAME = 'student_token';

module.exports = function studentAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach student data to request
    req.student = {
      id: decoded.id,
      email: decoded.email,
      rollNumber: decoded.rollNumber,
      name: decoded.name
    };

    next();

  } catch (error) {
    console.log('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
