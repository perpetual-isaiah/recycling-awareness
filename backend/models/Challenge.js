const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    whyParticipate: { type: String, default: '' },
    approved: { type: Boolean, default: false }, // 🔹 NEW field
  },
  { timestamps: true }
);

// Virtual property to check if challenge is still active
challengeSchema.virtual('isActive').get(function () {
  return new Date() <= this.endDate;
});

module.exports = mongoose.model('Challenge', challengeSchema);
