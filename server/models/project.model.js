const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  description: { type: String, required: true },
  detailedDescription: { type: String, default: '' },
  problemSolved: { type: String, default: '' },
  challengesFaced: { type: String, default: '' },
  futureScope: { type: String, default: '' },
  impact: {
    metric: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  technologies: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  snapshotUrl: { type: String, default: '' },
  imageUrl: { type: String }, // URL to the project image
  order: { type: Number, default: 0 } // To control the display order
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;