const express = require("express");
const router = express.Router();
const Job = require("../models/job.model");
const Application = require("../models/application.model");
const studentAuth = require("../middleware/studentAuth");




// ------------------------
// STUDENT: Fetch all jobs
// ------------------------
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// STUDENT: Mark applied
// ------------------------
router.post("/apply", studentAuth, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required" });
    }

    await Application.create({
      studentId: req.student.id,
      jobId,
    });

    res.status(200).json({ message: "Application recorded" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// STUDENT: Applied count
// ------------------------
router.get("/applied-count", studentAuth, async (req, res) => {
  try {
    const count = await Application.countDocuments({
      studentId: req.student.id,
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// STUDENT: Get all applications
// ------------------------
router.get("/my-applications", studentAuth, async (req, res) => {
  try {
    const applications = await Application.find({
      studentId: req.student.id,
    })
      .populate("jobId")
      .sort({ appliedAt: -1 });

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------
 * STUDENT: Withdraw Application (NEW)
 * ------------------------ */
router.delete("/withdraw", studentAuth, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required" });
    }

    const result = await Application.findOneAndDelete({
      studentId: req.student.id,
      jobId: jobId,
    });

    if (!result) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
