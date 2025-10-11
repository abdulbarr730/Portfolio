// server/routes/ReviewRoutes.js
const router = require('express').Router();
let Review = require('../models/Review.model');

// GET: Fetch all reviews (no longer filtering for isApproved)
router.route('/').get((req, res) => {
  Review.find().sort({ createdAt: -1 }) // REMOVED: { isApproved: true }
    .then(reviews => res.json(reviews))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST: Add a new review
// POST: Add a new review and return it
router.route('/add').post((req, res) => {
  const { name, review, rating } = req.body;
  const newReview = new Review({ name, review, rating });

  newReview.save()
    // CHANGED: Instead of a simple message, we now send back the new review object
    .then((savedReview) => res.status(201).json(savedReview))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;