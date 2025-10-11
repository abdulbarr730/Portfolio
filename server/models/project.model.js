const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
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