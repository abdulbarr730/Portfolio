const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin_jobs.model'); // Using your 'admin_jobs.model.js' file

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_COOKIE_NAME = 'admin_token';

// --- POST /api/admin/auth/login ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, isAdmin: true },
      JWT_SECRET,
      { expiresIn: '1d' } // 1 day session
    );

    // Set http-only cookie
    res.cookie(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        // CRITICAL FIX: Must be Secure: true and SameSite: None for cross-site login
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        });

    res.status(200).json({ message: 'Admin login successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- GET /api/admin/auth/logout ---
router.get('/logout', (req, res) => {
  // Pass the same options used to set the cookie
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  
  res.status(200).json({ message: 'Admin logged out successfully' });
});

module.exports = router;