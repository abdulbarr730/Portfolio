// server/models/service.model.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, default: 'Globe' }, // lucide-react icon name
    description: String,
    details: String,
    workflow: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
