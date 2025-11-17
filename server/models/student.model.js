const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  rollNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  course: {
    type: String,
    required: true,
  },

  branch: {
    type: String,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  // --- FIX: ADD THESE TWO FIELDS ---
  approved: {
    type: Boolean,
    default: false, // Students are 'pending' by default
  },
  registered: {
    type: Boolean,
    default: false, // Becomes true upon creation/approval
  },
  // --- END FIX ---

  registeredAt: {
    type: Date,
    // default: Date.now, // Let the register route handle this
  },

}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema);