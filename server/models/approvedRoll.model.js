// server/models/approvedRoll.model.js
const mongoose = require('mongoose');

const ApprovedRollSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.ApprovedRoll || mongoose.model('ApprovedRoll', ApprovedRollSchema);
