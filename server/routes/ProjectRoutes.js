const router = require('express').Router();
let Project = require('../models/project.model');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth'); // Import the auth middleware


// --- Multer & Cloudinary Config ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    uploadStream.end(fileBuffer);
  });
};


// GET: Fetch all projects (This remains public)
router.route('/').get((req, res) => {
  Project.find().sort({ order: 1 })
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new project (UPDATED to handle file upload)
router.route('/add').post(auth, upload.single('snapshot'), async (req, res) => {
  const { title, description, technologies, liveUrl, githubUrl, featured } = req.body;
  
  try {
    let snapshotUrl = '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      snapshotUrl = result.secure_url;
    }

    const newProject = new Project({
      title,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),
      liveUrl,
      githubUrl,
      featured: featured === 'true',
      snapshotUrl,
    });

    await newProject.save();
    res.json('Project added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

// POST: Update a project (UPDATED to handle file upload)
router.route('/update/:id').post(auth, upload.single('snapshot'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json('Project not found');

    project.title = req.body.title;
    project.description = req.body.description;
    project.technologies = req.body.technologies.split(',').map(tech => tech.trim());
    project.liveUrl = req.body.liveUrl;
    project.githubUrl = req.body.githubUrl;
    project.featured = req.body.featured === 'true';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      project.snapshotUrl = result.secure_url;
    }

    await project.save();
    res.json('Project updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


// DELETE: Delete a project by ID (Protected)
router.route('/:id').delete(auth, (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => res.json('Project deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;