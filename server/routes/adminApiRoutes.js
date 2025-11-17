const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// --- Import ALL necessary models ---
const Job = require("../models/job.model");
const Student = require("../models/student.model");
const Application = require("../models/application.model");

/*
 * =====================================
 * ADMIN JOB ROUTES
 * =====================================
*/

/* -------------------------------------
 * ADMIN: CREATE NEW JOB
 * ------------------------------------- */
router.post("/jobs/create", async (req, res) => {
  try {
    const { name, link, description } = req.body;
    if (!name || !link) {
      return res.status(400).json({ error: "Name and link required" });
    }
    const job = await Job.create({
      name,
      link,
      description,
      createdBy: "admin",
    });
    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error(err);
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
 * ADMIN: GET A SINGLE JOB'S DETAILS
 * ------------------------------------- */
router.get("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json({ job });
  } catch (err) {
    console.error("get-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: UPDATE A JOB
 * ------------------------------------- */
router.put("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { name, link, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }
    if (!name || !link) {
      return res.status(400).json({ error: "Name and link are required" });
    }
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { name, link, description },
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
 * ADMIN: DELETE A JOB
 * ------------------------------------- */
router.delete("/jobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid Job ID" });
    }
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Also delete all applications associated with this job
    await Application.deleteMany({ jobId: jobId });

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

/* -------------------------------------
 * ADMIN: BULK APPROVE / UNAPPROVE (NEW)
 * ------------------------------------- */
router.put("/students/bulk-approve", async (req, res) => {
  try {
    const { rollNumbers, approve } = req.body;

    if (!rollNumbers || !Array.isArray(rollNumbers) || rollNumbers.length === 0) {
      return res.status(400).json({ error: "List of rollNumbers is required." });
    }

    // Update all matching students
    const result = await Student.updateMany(
      { rollNumber: { $in: rollNumbers } },
      { $set: { approved: approve, registered: true } }
    );

    res.status(200).json({ 
        message: `${result.modifiedCount} students successfully updated.`,
        modifiedCount: result.modifiedCount
    });

  } catch (err) {
    console.error("bulk-approve error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: BULK DELETE (NEW)
 * Note: Uses POST method for reliable JSON payload handling
 * ------------------------------------- */
router.post("/students/bulk-delete", async (req, res) => {
  try {
    const { rollNumbers } = req.body; 

    if (!rollNumbers || !Array.isArray(rollNumbers) || rollNumbers.length === 0) {
      return res.status(400).json({ error: "List of rollNumbers is required." });
    }
    
    // 1. Find IDs of students to delete
    const studentsToDelete = await Student.find({ rollNumber: { $in: rollNumbers } }).select('_id');
    const studentIds = studentsToDelete.map(s => s._id);

    // 2. Delete the students
    const deleteResult = await Student.deleteMany({ _id: { $in: studentIds } });
    
    // 3. Delete associated applications
    await Application.deleteMany({ studentId: { $in: studentIds } });

    res.status(200).json({ 
        message: `${deleteResult.deletedCount} students and their applications deleted.`,
        deletedCount: deleteResult.deletedCount
    });

  } catch (err) {
    console.error("bulk-delete error", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* -------------------------------------
 * ADMIN: GET ALL STUDENTS (Verified, Pending, etc.)
 * ------------------------------------- */
router.get("/students/all", async (req, res) => {
  try {
    // Selects everything EXCEPT the password hash
    const students = await Student.find().sort({ name: 1 }).select('-passwordHash');
    res.status(200).json({ students });
  } catch (err) {
    console.error("get-all-students error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: DELETE STUDENT (Reject)
 * ------------------------------------- */
router.delete("/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid Student ID" });
    }

    // Delete the student record
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Also delete any applications they may have created
    await Application.deleteMany({ studentId: studentId });

    res.status(200).json({ message: "Student and all related data deleted" });
  } catch (err) {
    console.error("delete-student error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: RESET/CHANGE PASSWORD
 * ------------------------------------- */
router.put("/students/password/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) { // Simple validation
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update the student record
    student.passwordHash = passwordHash;
    await student.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("change-student-password error", err);
    res.status(500).json({ error: "Server error" });
  }
});
/* -------------------------------------
 * ADMIN: GET STUDENT STATS
 * ------------------------------------- */
router.get("/students/stats", async (req, res) => {
  try {
    // Run all count queries in parallel
    const [total, verified, pending, totalJobs] = await Promise.all([ // <-- ADD totalJobs
      Student.countDocuments(),
      Student.countDocuments({ approved: true }),
      Student.countDocuments({ approved: false, registered: true }),
      Job.countDocuments() // <-- ADD THIS QUERY
    ]);

    res.status(200).json({
      stats: {
        total,
        verified,
        pending,
        totalJobs // <-- ADD THIS TO THE RESPONSE
      }
    });

  } catch (err) {
    console.error("get-stats error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: GET PENDING STUDENTS
 * ------------------------------------- */
router.get("/students/pending", async (req, res) => {
  try {
    const pendingStudents = await Student.find({
      approved: false,
      registered: false, // Find users who registered but weren't on the list
    }).sort({ createdAt: -1 });
    res.status(200).json({ students: pendingStudents });
  } catch (err) {
    console.error("get-pending error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: APPROVE STUDENT
 * ------------------------------------- */
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
      await student.save();
      return res.status(200).json({ success: true, message: "Student approved" });
    } else {
      student.approved = false;
      student.registered = false;
      await student.save();
      return res.status(200).json({ success: true, message: "Student unapproved" });
    }
  } catch (err) {
    console.error("approve error", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/*
 * =====================================
 * ADMIN APPLICATION ROUTES
 * =====================================
*/

/* -------------------------------------
 * ADMIN: GET ALL APPLICATIONS (FLAT LIST)
 * (For the "Export" page)
 * ------------------------------------- */
router.get("/applications/all", async (req, res) => {
  try {
    const allApplications = await Application.find()
      .populate('studentId')
      .populate('jobId')
      .sort({ appliedAt: -1 });
    // Filter out any applications where student or job was deleted
    const cleanData = allApplications.filter(app => app.studentId && app.jobId);
    res.status(200).json({ applications: cleanData });
  } catch (err) {
    console.error("get-all-applications error", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------------------------
 * ADMIN: GET ALL APPLICATIONS, GROUPED BY JOB
 * (For the "Cool Dashboard" page)
 * ------------------------------------- */
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
              appliedAt: "$appliedAt"
            }
          }
        }
      },
      { $sort: { jobCreatedAt: -1 } }
    ]);
    res.status(200).json({ data: applicationsByJob });
  } catch (err) {
    console.error("get-applications-by-job error", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;