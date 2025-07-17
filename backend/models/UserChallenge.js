const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  progress: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  joinDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate entries per user & challenge
userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });


module.exports = mongoose.model('UserChallenge', userChallengeSchema);
