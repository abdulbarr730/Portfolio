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

  phoneNumber: {             // <-- ADDED
    type: String,
    required: true,
    trim: true,
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

  approved: {
    type: Boolean,
    default: false,
  },

  registered: {
    type: Boolean,
    default: false,
  },

  registeredAt: {
    type: Date,
  },

}, { timestamps: true });

module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema);
