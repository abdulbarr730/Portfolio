const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_COOKIE_NAME = 'admin_token';

// This middleware now checks for the admin JWT cookie
module.exports = function adminAuth(req, res, next) {
  try {
    const token = req.cookies[ADMIN_COOKIE_NAME];
    
    if (!token) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if it's an admin token
    if (!decoded.isAdmin) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    // Attach admin data to request if needed
    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };
    
    next();

  } catch (error) {
    console.log('Admin Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};