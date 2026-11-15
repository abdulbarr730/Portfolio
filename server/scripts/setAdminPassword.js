// server/scripts/setAdminPassword.js
// Sets (or resets) the password for a portfolio admin account (/admin/login).
// The password is bcrypt-hashed before it is stored; it is never printed.
//
// Usage (from server/):
//   node scripts/setAdminPassword.js <username> <new-password>
//   node scripts/setAdminPassword.js admin "your-new-password"
//
// If the username doesn't exist yet it is created.
require('dotenv').config({ quiet: true });
if (process.env.DNS_SERVERS) require('dns').setServers(process.env.DNS_SERVERS.split(','));

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Usage: node scripts/setAdminPassword.js <username> <new-password>');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Use at least 10 characters for the password.');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 });
  const hash = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const existing = await User.findOne({ username });
  if (existing) {
    existing.password = hash;
    await existing.save();
    console.log(`Password updated for "${username}".`);
  } else {
    await User.create({ username, password: hash });
    console.log(`Admin "${username}" created.`);
  }
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
