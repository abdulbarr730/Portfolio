// server/lib/crud.js
// Builds JSON CRUD routes for a model: public reads, admin-only writes.
//   GET    /         list (sorted)
//   POST   /         create          (auth)
//   PUT    /:id      update          (auth)
//   DELETE /:id      delete          (auth)
//   PUT    /reorder  [{_id, order}]  (auth)
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const clean = (body = {}) => {
  const { _id, __v, createdAt, updatedAt, ...rest } = body;
  return rest;
};

module.exports = function crud(Model, { sort = { order: 1, createdAt: -1 } } = {}) {
  const router = express.Router();
  const validId = (req, res, next) =>
    mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ msg: 'Invalid id' });

  router.get('/', async (req, res) => {
    try {
      res.json(await Model.find().sort(sort).lean());
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

  router.post('/', auth, async (req, res) => {
    try {
      res.status(201).json(await Model.create(clean(req.body)));
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });

  router.put('/reorder', auth, async (req, res) => {
    try {
      const items = Array.isArray(req.body) ? req.body : [];
      await Promise.all(
        items
          .filter((i) => mongoose.isValidObjectId(i._id))
          .map((i) => Model.updateOne({ _id: i._id }, { order: Number(i.order) || 0 }))
      );
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });

  router.put('/:id', auth, validId, async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, clean(req.body), {
        new: true,
        runValidators: true,
      });
      if (!doc) return res.status(404).json({ msg: 'Not found' });
      res.json(doc);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });

  router.delete('/:id', auth, validId, async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ msg: 'Not found' });
      res.json({ ok: true });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  });

  return router;
};
