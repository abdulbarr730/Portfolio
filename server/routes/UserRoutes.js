// server/routes/UserRoutes.js
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let User = require('../models/User.model');
const auth = require('../middleware/auth');

// ROUTE 1: Register the first Admin User (only works while no admin exists)
router.route('/register').post(async (req, res) => {
  try {
    if (await User.countDocuments()) {
      return res.status(403).json('Registration is closed');
    }
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json("User registered!");
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

// ROUTE 2: Login
router.route('/login').post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json('Error: ' + err);
  }
});

// ROUTE 3: Current admin account (login name only)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select('username updatedAt');
    if (!user) return res.status(404).json({ msg: 'Account not found' });
    res.json({ username: user.username, updatedAt: user.updatedAt });
  } catch (err) {
    res.status(400).json({ msg: 'Account not found' });
  }
});

// ROUTE 4: Change login email/username and/or password.
// Always requires the current password.
router.put('/me', auth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body || {};
    if (!currentPassword) return res.status(400).json({ msg: 'Enter your current password.' });

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ msg: 'Account not found' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ msg: 'Current password is incorrect.' });

    const changes = [];
    if (typeof newUsername === 'string' && newUsername.trim() && newUsername.trim() !== user.username) {
      const name = newUsername.trim();
      if (name.length < 3) return res.status(400).json({ msg: 'Login name must be at least 3 characters.' });
      const taken = await User.findOne({ username: name, _id: { $ne: user._id } });
      if (taken) return res.status(400).json({ msg: 'That login name is already in use.' });
      user.username = name;
      changes.push('login');
    }
    if (typeof newPassword === 'string' && newPassword) {
      if (newPassword.length < 10) return res.status(400).json({ msg: 'New password must be at least 10 characters.' });
      user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
      changes.push('password');
    }
    if (!changes.length) return res.status(400).json({ msg: 'Nothing to change.' });

    await user.save();
    res.json({ ok: true, username: user.username, changed: changes });
  } catch (err) {
    res.status(500).json({ msg: 'Could not update the account.' });
  }
});

module.exports = router;