const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student.model');
const studentAuth = require('../middleware/studentAuth');
const ApprovedRoll = require('../models/approvedRoll.model');

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const COOKIE_NAME = 'student_token';

// --- Fail-Fast Security Check ---
if (!JWT_SECRET || !ADMIN_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET or ADMIN_SECRET is not defined in .env");
  process.exit(1);
}

/* -------------------------------------
 * LOGIN STUDENT
 * ------------------------------------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const student = await Student.findOne({ email: String(email).trim().toLowerCase() });
    if (!student) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    if (!student.approved) {
      return res.status(403).json({ error: 'Account is pending admin approval.' });
    }

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

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------------------
 * GET LOGGED-IN STUDENT DATA
 * ------------------------------------- */
router.get('/me', studentAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.status(200).json(student);

  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

/* -------------------------------------
 * LOGOUT STUDENT
 * ------------------------------------- */
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(200).json({ message: 'Logged out successfully' });
});

/* -------------------------------------
 * UPDATE PROFILE (Protected)
 * ------------------------------------- */
router.put('/update-profile', studentAuth, async (req, res) => {
  try {
    const { name, email, course, branch, year, phoneNumber } = req.body;

    if (!name || !email || !course || !branch || !year || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

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
        year,
        phoneNumber
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
 * CHANGE PASSWORD
 * ------------------------------------- */
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

    const isMatch = await bcrypt.compare(oldPassword, student.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

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

/* -------------------------------------
 * REGISTER (with Approval Logic)
 * ------------------------------------- */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, course, branch, year, phoneNumber } = req.body;

    if (!name || !email || !password || !rollNumber || !course || !branch || !year || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const rn = String(rollNumber).trim();
    const em = String(email).trim().toLowerCase();

    const existingByRoll = await Student.findOne({ rollNumber: rn });
    if (existingByRoll) {
      return res.status(409).json({ error: 'Roll number already exists. Contact admin if this is an error.' });
    }
    const existingByEmail = await Student.findOne({ email: em });
    if (existingByEmail) {
      return res.status(409).json({ error: 'Email already registered. Please login or use a different email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const approved = await ApprovedRoll.findOne({ rollNumber: rn });

    if (approved) {
      await Student.create({
        name,
        email: em,
        passwordHash,
        rollNumber: rn,
        course,
        branch,
        year,
        phoneNumber,
        approved: true,
        registered: true,
        registeredAt: new Date()
      });

      return res.status(201).json({ success: true, message: 'Registered and approved. You can now login.' });
    } else {
      await Student.create({
        name,
        email: em,
        passwordHash,
        rollNumber: rn,
        course,
        branch,
        year,
        phoneNumber,
        approved: false,
        registered: false
      });

      return res.status(202).json({
        pending: true,
        message: 'Registration received. Waiting admin approval.',
        email: em,
        rollNumber: rn
      });
    }
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------------------
 * CANCEL PENDING REGISTRATION
 * ------------------------------------- */
router.post('/cancel-registration', async (req, res) => {
  try {
    const { email, rollNumber } = req.body;

    if (!email && !rollNumber) {
      return res.status(400).json({ error: 'Provide email or rollNumber to cancel' });
    }

    const query = email ? { email: String(email).toLowerCase() } : { rollNumber: String(rollNumber).trim() };
    const student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({ error: 'Pending registration not found' });
    }

    if (student.approved === true || student.registered === true) {
      return res.status(403).json({ error: 'This account is already approved/active and cannot be cancelled here.' });
    }

    await Student.deleteOne({ _id: student._id });

    return res.status(200).json({ success: true, message: 'Registration cancelled and record removed.' });
  } catch (err) {
    console.error('cancel-registration error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
