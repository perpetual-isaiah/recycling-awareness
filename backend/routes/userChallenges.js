const express = require('express');
const router = express.Router();
const UserChallenge = require('../models/UserChallenge');
const authMiddleware = require('../middleware/auth');

// Get all joined challenges + progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userChallenges = await UserChallenge.find({ userId: req.user })
      .populate('challengeId')
      .exec();
    res.json(userChallenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress
router.patch('/:userChallengeId/progress', authMiddleware, async (req, res) => {
  try {
    const { taskKey, completed } = req.body;
    const userChallenge = await UserChallenge.findById(req.params.userChallengeId);

    if (!userChallenge) return res.status(404).json({ message: 'Not found' });
    if (userChallenge.userId.toString() !== req.user)
      return res.status(403).json({ message: 'Unauthorized' });

    // Use .set() if progress is a Map, else use bracket notation
    userChallenge.progress.set(taskKey, completed);
    await userChallenge.save();

    res.json({ message: 'Progress updated', progress: userChallenge.progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get one user challenge with ownership check
router.get('/:userChallengeId', authMiddleware, async (req, res) => {
  try {
    const userChallenge = await UserChallenge.findById(req.params.userChallengeId)
      .populate('challengeId');
    if (!userChallenge) return res.status(404).json({ message: 'Not found' });

    if (userChallenge.userId.toString() !== req.user)
      return res.status(403).json({ message: 'Unauthorized' });

    res.json(userChallenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update status with ownership check
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!['active', 'completed', 'abandoned'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const userChallenge = await UserChallenge.findById(req.params.id);
    if (!userChallenge) return res.status(404).json({ message: 'Not found' });

    if (userChallenge.userId.toString() !== req.user)
      return res.status(403).json({ message: 'Unauthorized' });

    userChallenge.status = status;
    await userChallenge.save();

    res.json(userChallenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get userChallenge by challengeId for the logged-in user
router.get('/by-challenge/:challengeId', authMiddleware, async (req, res) => {
  try {
    const userChallenge = await UserChallenge.findOne({
      challengeId: req.params.challengeId,
      userId: req.user,
    }).populate('challengeId');

    if (!userChallenge) return res.status(404).json({ message: 'Not found' });

    res.json(userChallenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
