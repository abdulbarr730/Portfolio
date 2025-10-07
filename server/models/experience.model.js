const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  description: [{ type: String }], // Array for bullet points
  type: { type: String, enum: ['professional', 'education'], required: true }
}, { timestamps: true });

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience;