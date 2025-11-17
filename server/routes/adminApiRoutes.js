const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// MODELS
const Job = require("../models/job.model");
const Student = require("../models/student.model");
const Application = require("../models/application.model");

/*
 * =====================================
 * ADMIN JOB ROUTES
 * =====================================
*/


/**
 * ADMIN: GET ALL APPLICATIONS GROUPED BY STUDENT
 * GET /api/admin/applications/by-student
 */
router.get("/applications/by-student", async (req, res) => {
  try {
    const results = await Application.aggregate([
      { $sort: { appliedAt: -1 } },

      { $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo"
      }},
      { $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobInfo"
      }},

      { $unwind: "$studentInfo" },
      { $unwind: "$jobInfo" },

      {
        $group: {
          _id: "$studentInfo._id",
          studentName: { $first: "$studentInfo.name" },
          studentEmail: { $first: "$studentInfo.email" },
          studentRoll: { $first: "$studentInfo.rollNumber" },
          studentBranch: { $first: "$studentInfo.branch" },
          studentYear: { $first: "$studentInfo.year" },
          studentPhone: { $first: "$studentInfo.phoneNumber" },   // <-- ADDED
          applications: {
            $push: {
              jobId: "$jobInfo._id",
              jobName: "$jobInfo.name",
              jobLink: "$jobInfo.link",
              appliedAt: "$appliedAt"
            }
          }
        }
      },

      { $sort: { studentName: 1 } }
    ]);

    res.status(200).json({ data: results });
  } catch (err) {
    console.error("get-applications-by-student error", err);
    res.status(500).json({ error: "Server error" });
  }
});



/* -------------------------------------
 * ADMIN: CREATE NEW JOB
 * ------------------------------------- */
router.post("/jobs/create", async (req, res) => {
  try {
    const { name, link, description, type, location } = req.body;

    if (!name || !link) {
      return res.status(400).json({ error: "Name and link required" });
    }

    const job = await Job.create({
      name,
      link,
      description,
      type: type || "internship",
      location: location || "",
      createdBy: "admin",
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("create-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* -------------------------------------
 * ADMIN: GET ALL JOBS
 * ------------------------------------- */
router.get("/jobs/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    console.error("get-all-jobs error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* -------------------------------------
 * ADMIN: GET SINGLE JOB
 * ------------------------------------- */
router.get("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    res.status(200).json({ job });
  } catch (err) {
    console.error("get-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* -------------------------------------
 * ADMIN: UPDATE JOB
 * ------------------------------------- */
router.put("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { name, link, description, type, location } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }

    if (!name || !link) {
      return res.status(400).json({ error: "Name and link are required" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        name,
        link,
        description: description || "",
        type: type || "internship",
        location: location || "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    console.error("update-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* -------------------------------------
 * ADMIN: DELETE JOB
 * ------------------------------------- */
router.delete("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }

    const job = await Job.findByIdAndDelete(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    await Application.deleteMany({ jobId });

    res.status(200).json({ message: "Job and associated applications deleted" });
  } catch (err) {
    console.error("delete-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});



/*
 * =====================================
 * ADMIN STUDENT ROUTES
 * =====================================
*/

router.put("/students/bulk-approve", async (req, res) => {
  try {
    const { rollNumbers, approve } = req.body;

    if (!rollNumbers || !Array.isArray(rollNumbers)) {
      return res.status(400).json({ error: "List of rollNumbers required" });
    }

    const result = await Student.updateMany(
      { rollNumber: { $in: rollNumbers } },
      { $set: { approved: approve, registered: true } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} students successfully updated.`,
    });
  } catch (err) {
    console.error("bulk-approve error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/students/bulk-delete", async (req, res) => {
  try {
    const { rollNumbers } = req.body;

    if (!rollNumbers || !Array.isArray(rollNumbers)) {
      return res.status(400).json({ error: "List of rollNumbers required" });
    }

    const studentsToDelete = await Student.find({
      rollNumber: { $in: rollNumbers },
    }).select("_id");

    const studentIds = studentsToDelete.map((s) => s._id);

    const deleteResult = await Student.deleteMany({ _id: { $in: studentIds } });

    await Application.deleteMany({ studentId: { $in: studentIds } });

    res.status(200).json({
      message: `${deleteResult.deletedCount} students and their applications deleted.`,
    });
  } catch (err) {
    console.error("bulk-delete error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/students/all", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }).select("-passwordHash");
    res.status(200).json({ students });
  } catch (err) {
    console.error("get-all-students error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid Student ID" });
    }

    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await Application.deleteMany({ studentId });

    res.status(200).json({ message: "Student and related data deleted" });
  } catch (err) {
    console.error("delete-student error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/students/password/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const salt = await bcrypt.genSalt(10);
    student.passwordHash = await bcrypt.hash(newPassword, salt);

    await student.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("change-password error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/students/stats", async (req, res) => {
  try {
    const [total, verified, pending, totalJobs] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ approved: true }),
      Student.countDocuments({ approved: false, registered: true }),
      Job.countDocuments(),
    ]);

    res.status(200).json({
      stats: {
        total,
        verified,
        pending,
        totalJobs,
      },
    });
  } catch (err) {
    console.error("get-stats error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/students/pending", async (req, res) => {
  try {
    const pendingStudents = await Student.find({
      approved: false,
      registered: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({ students: pendingStudents });
  } catch (err) {
    console.error("get-pending error", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.put("/students/approve", async (req, res) => {
  try {
    const { rollNumber, approve } = req.body;

    if (!rollNumber) return res.status(400).json({ error: "rollNumber required" });

    const student = await Student.findOne({ rollNumber: String(rollNumber).trim() });

    if (!student) return res.status(404).json({ error: "Student not found" });

    if (approve) {
      student.approved = true;
      student.registered = true;
      student.registeredAt = new Date();
    } else {
      student.approved = false;
      student.registered = false;
    }

    await student.save();

    res.status(200).json({ success: true, message: approve ? "Student approved" : "Student unapproved" });
  } catch (err) {
    console.error("approve error", err);
    res.status(500).json({ error: "Server error" });
  }
});



/*
 * =====================================
 * ADMIN APPLICATION ROUTES
 * =====================================
*/

router.get("/applications/all", async (req, res) => {
  try {
    const allApplications = await Application.find()
      .populate("studentId")
      .populate("jobId")
      .sort({ appliedAt: -1 });

    const cleanData = allApplications
      .filter(app => app.studentId && app.jobId)
      .map(app => ({
        _id: app._id,
        appliedAt: app.appliedAt,
        student: {
          name: app.studentId.name,
          email: app.studentId.email,
          rollNumber: app.studentId.rollNumber,
          branch: app.studentId.branch,
          year: app.studentId.year,
          phoneNumber: app.studentId.phoneNumber     // <-- ADDED
        },
        job: {
          id: app.jobId._id,
          name: app.jobId.name,
          link: app.jobId.link,
        }
      }));

    res.status(200).json({ applications: cleanData });
  } catch (err) {
    console.error("get-all-applications error", err);
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/applications/by-job", async (req, res) => {
  try {
    const applicationsByJob = await Application.aggregate([
      { $sort: { appliedAt: -1 } },

      { $lookup: { from: "students", localField: "studentId", foreignField: "_id", as: "studentInfo" } },
      { $lookup: { from: "jobs", localField: "jobId", foreignField: "_id", as: "jobInfo" } },

      { $unwind: "$studentInfo" },
      { $unwind: "$jobInfo" },

      {
        $group: {
          _id: "$jobInfo._id",
          jobName: { $first: "$jobInfo.name" },
          jobLink: { $first: "$jobInfo.link" },
          jobCreatedAt: { $first: "$jobInfo.createdAt" },

          applications: {
            $push: {
              studentName: "$studentInfo.name",
              studentEmail: "$studentInfo.email",
              studentRoll: "$studentInfo.rollNumber",
              studentBranch: "$studentInfo.branch",
              studentYear: "$studentInfo.year",
              studentPhone: "$studentInfo.phoneNumber",   // <-- ADDED
              appliedAt: "$appliedAt",
            },
          },
        },
      },

      { $sort: { jobCreatedAt: -1 } },
    ]);

    res.status(200).json({ data: applicationsByJob });
  } catch (err) {
    console.error("get-app-by-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
