// server/routes/contentRoutes.js
// Everything the admin panel edits: site settings, image uploads,
// projects / experience / services (JSON CRUD) and review moderation.
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const crud = require('../lib/crud');
const { uploadToR2 } = require('../config/r2');

const SiteSettings = require('../models/siteSettings.model');
const Project = require('../models/project.model');
const Experience = require('../models/experience.model');
const Service = require('../models/service.model');
const Review = require('../models/Review.model');

const router = express.Router();

// ---------- Site settings (single document) ----------
router.get('/settings', async (req, res) => {
  try {
    const doc = await SiteSettings.findOne({ key: 'main' }).lean();
    res.json(doc || {});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/settings', auth, async (req, res) => {
  try {
    const { _id, __v, key, createdAt, updatedAt, ...data } = req.body || {};
    const doc = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ---------- Image upload -> Cloudflare R2 ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(png|jpe?g|webp|gif|svg\+xml|avif)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only image files are allowed')),
});

router.post('/uploads', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
    try {
      const folder = String(req.query.folder || 'uploads').replace(/[^a-z0-9-]/gi, '') || 'uploads';
      const url = await uploadToR2(req.file.buffer, req.file, folder);
      res.status(201).json({ url });
    } catch (e) {
      res.status(500).json({ msg: e.message });
    }
  });
});

// ---------- Collections ----------
router.use('/content/projects', crud(Project));
router.use('/content/experience', crud(Experience, { sort: { order: 1, createdAt: 1 } }));
router.use('/content/services', crud(Service));

// ---------- Review moderation ----------
router.get('/content/reviews', auth, async (req, res) => {
  try {
    res.json(await Review.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.patch('/content/reviews/:id', auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'Invalid id' });
    const doc = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: Boolean(req.body.isApproved) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ msg: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete('/content/reviews/:id', auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ msg: 'Invalid id' });
    await Review.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
