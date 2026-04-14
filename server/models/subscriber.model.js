const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
  },
  consent: {
    type: Boolean,
    default: false
  },
  consentAt: {
    type: Date
  },
  consentVersion: {
    type: Number,
    default: 1
  }
});

// TTL index
subscriberSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Subscriber", subscriberSchema);