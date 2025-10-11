// server/models/Review.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  name: { type: String, required: true, trim: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  isApproved: { type: Boolean, default: true }, // You will manually approve reviews
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;