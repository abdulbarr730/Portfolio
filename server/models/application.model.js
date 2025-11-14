const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
ApplicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
