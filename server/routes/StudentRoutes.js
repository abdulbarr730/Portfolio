const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
const studentAuth = require('../middleware/studentAuth');

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';
const COOKIE_NAME = 'student_token';

/* -------------------------------------
   REGISTER STUDENT
------------------------------------- */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, course, branch, year } = req.body;

    if (!name || !email || !password || !rollNumber || !course || !branch || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check existing email or rollNumber
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) return res.status(400).json({ error: 'Roll number already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create student entry
    const student = await Student.create({
      name,
      email,
      passwordHash,
      rollNumber,
      course,
      branch,
      year,
    });

    return res.status(201).json({ message: 'Registration successful' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------------------
   LOGIN STUDENT
------------------------------------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        rollNumber: student.rollNumber,
        name: student.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set http-only cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------------------
   GET LOGGED-IN STUDENT DATA
------------------------------------- */
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const student = await Student.findById(decoded.id).select('-passwordHash');

    return res.status(200).json(student);

  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

/* -------------------------------------
   LOGOUT STUDENT
------------------------------------- */
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(200).json({ message: 'Logged out successfully' });
});



/* -------------------------------------
    UPDATE PROFILE (Protected)
------------------------------------- */
router.put('/update-profile', studentAuth, async (req, res) => {
  try {
    const { name, email, course, branch, year } = req.body;

    if (!name || !email || !course || !branch || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists for another student
    const existingEmail = await Student.findOne({
      email,
      _id: { $ne: req.student.id }
    });

    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.student.id,
      {
        name,
        email,
        course,
        branch,
        year
      },
      { new: true }
    ).select('-passwordHash');

    return res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.log("Update profile error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
    CHANGE PASSWORD (Protected)
------------------------------------- */
router.put('/change-password', studentAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Old and new password required" });
    }

    const student = await Student.findById(req.student.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Validate old password
    const isMatch = await bcrypt.compare(oldPassword, student.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    student.passwordHash = newHash;
    await student.save();

    return res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.log("Change password error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
