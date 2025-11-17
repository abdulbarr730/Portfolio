// models/job.model.js
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,         // free-form (no enum)
      default: "internship",// sensible default
      trim: true,
    },

    location: {
      type: String,
      default: "",
    },

    createdBy: {
      type: String,
      default: "admin",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Job || mongoose.model("Job", JobSchema);
