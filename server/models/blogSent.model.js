const mongoose = require("mongoose");

const blogSentSchema = new mongoose.Schema({
  link: {
    type: String,
    unique: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BlogSent", blogSentSchema);