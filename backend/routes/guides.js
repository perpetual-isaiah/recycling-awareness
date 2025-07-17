const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');

// GET all guides
router.get('/', async (req, res) => {
  try {
    const guides = await Guide.find();
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new guide
router.post('/', async (req, res) => {
  const newGuide = new Guide(req.body);
  try {
    const savedGuide = await newGuide.save();
    res.status(201).json(savedGuide);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
