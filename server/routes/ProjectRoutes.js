const router = require('express').Router();
let Project = require('../models/project.model');
const auth = require('../middleware/auth'); // Import the auth middleware

// GET: Fetch all projects (This remains public)
router.route('/').get((req, res) => {
  Project.find().sort({ order: 1 })
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new project (This route is now protected by the 'auth' middleware)
router.route('/add').post(auth, (req, res) => {
  const { title, description, technologies, liveUrl, githubUrl, imageUrl, order } = req.body;
  
  // Convert comma-separated technologies string into an array
  const technologiesArray = technologies.split(',').map(tech => tech.trim());

  const newProject = new Project({
    title,
    description,
    technologies: technologiesArray, // Save the array
    liveUrl,
    githubUrl,
    imageUrl,
    order
  });

  newProject.save()
    .then(() => res.json('Project added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE: Delete a project by ID (Protected)
router.route('/:id').delete(auth, (req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => res.json('Project deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Update a project by ID (Protected)
router.route('/update/:id').post(auth, (req, res) => {
  Project.findById(req.params.id)
    .then(project => {
      project.title = req.body.title;
      project.description = req.body.description;
      project.technologies = req.body.technologies.split(',').map(tech => tech.trim());
      project.liveUrl = req.body.liveUrl;
      project.githubUrl = req.body.githubUrl;

      project.save()
        .then(() => res.json('Project updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;