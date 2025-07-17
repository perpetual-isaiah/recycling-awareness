const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const UserChallenge = require('../models/UserChallenge');
const verifyToken = require('../middleware/verifyToken');

// ✅ Create a new challenge (approval pending by default)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, startDate, endDate, whyParticipate } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: 'Invalid start/end date' });
    }

    const challenge = new Challenge({
      title,
      description,
      startDate: start,
      endDate: end,
      createdBy: req.user.id,
      whyParticipate,
      approved: false, // Default: pending approval
    });

    await challenge.save();
    res.status(201).json({ message: 'Challenge created. Pending approval.', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
});

// ✅ Get all challenges (admin gets all, users get only approved)
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const filter = user.role === 'admin' ? {} : { approved: true };

    const challenges = await Challenge.find(filter)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
});

// ✅ Get a single challenge by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    // If not admin, restrict access to unapproved challenges
    const user = await User.findById(req.user.id);
    if (challenge.approved === false && user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to view this challenge' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenge details', error: error.message });
  }
});

// ✅ Join a challenge
router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    const now = new Date();
    if (now > challenge.endDate) {
      return res.status(400).json({ message: 'Challenge has already ended' });
    }

    if (!challenge.approved) {
      return res.status(403).json({ message: 'Challenge is not approved yet' });
    }

    const userId = req.user.id;

    if (challenge.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push(userId);

    const userChallenge = new UserChallenge({
      userId,
      challengeId: challenge._id,
      status: 'active',
      progress: new Map(),
      startDate: new Date(),
    });

    await Promise.all([
      challenge.save(),
      userChallenge.save(),
      User.findByIdAndUpdate(userId, {
        $addToSet: { challengesJoined: challenge._id },
      }),
    ]);

    res.status(201).json({
      message: 'Successfully joined challenge',
      userChallenge: await userChallenge.populate('challengeId'),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining challenge', error: error.message });
  }
});

// ✅ Get challenges user has joined
router.get('/joined', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'challengesJoined',
      select: 'title description startDate endDate approved',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ challenges: user.challengesJoined });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching joined challenges', error: error.message });
  }
});

// ✅ Admin approves a challenge
router.patch('/:id/approve', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can approve challenges' });
    }

    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    res.json({ message: 'Challenge approved', challenge });
  } catch (error) {
    res.status(500).json({ message: 'Error approving challenge', error: error.message });
  }
});

module.exports = router;
