const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'plastic',
      'glass',
      'paper',
      'metal',
      'carton',
      'ewaste',
      'organic',
      'batteries',
      'clothes',
      'tires',
      'construction',
    ],
  },
  category: String,
  description: { type: String, required: true }, // How to Recycle [Material]
  steps: [String],
  images: [String],
  icon: String, // e.g., "bottle-soda", "leaf"
  containerTag: String, // e.g., "Green container"
  environmentalImpact: String,
  economicImpact: String
});

module.exports = mongoose.model('Guide', guideSchema);
