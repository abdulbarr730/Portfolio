// server/routes/ExperienceRoutes.js
const router = require('express').Router();
let Experience = require('../models/experience.model');
const auth = require('../middleware/auth');

// GET: Fetch all experience (Public)
router.route('/').get((req, res) => {
  Experience.find().sort({ createdAt: -1 })
    .then(experiences => res.json(experiences))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add new experience (Protected)
router.route('/add').post(auth, (req, res) => {
  const { role, company, duration, description, type } = req.body;
  const descriptionArray = description.split(',').map(desc => desc.trim());
  
  const newExperience = new Experience({
    role,
    company,
    duration,
    description: descriptionArray,
    type
  });

  newExperience.save()
    .then(() => res.json('Experience added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Update an experience by ID (Protected)
router.route('/update/:id').post(auth, (req, res) => {
  Experience.findById(req.params.id)
    .then(experience => {
      experience.role = req.body.role;
      experience.company = req.body.company;
      experience.duration = req.body.duration;
      experience.description = req.body.description.split(',').map(desc => desc.trim());
      experience.type = req.body.type;

      experience.save()
        .then(() => res.json('Experience updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE: Delete an experience by ID (Protected)
router.route('/:id').delete(auth, (req, res) => {
  Experience.findByIdAndDelete(req.params.id)
    .then(() => res.json('Experience deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;