const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const verifyToken = require('../middleware/verifyToken');
const axios = require('axios');

// PUT /api/user/location
// PUT /api/user/location
router.put('/location', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { location, city } = req.body;

    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { location, city },
      { new: true }
    ).select('-password');

    res.json({ message: 'Location updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
});

// GET /api/user/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// PUT /api/user/profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, gender, dateOfBirth, profilePhotoUrl } = req.body;

    const updateFields = {};

    if (phone !== undefined) {
      // optionally sanitize phone here
      updateFields.phone = phone.trim();
    }

    if (gender !== undefined) {
      const validGenders = ['male', 'female', 'other', '--'];
      if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid gender value' });
      }
      updateFields.gender = gender;
    }

    if (dateOfBirth !== undefined) {
      if (isNaN(Date.parse(dateOfBirth))) {
        return res.status(400).json({ message: 'Invalid date of birth' });
      }
      updateFields.dateOfBirth = new Date(dateOfBirth);
    }

    if (profilePhotoUrl !== undefined) {
      updateFields.profilePhotoUrl = profilePhotoUrl.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      select: '-password',
    });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});


// POST /api/user/join/:challengeId
router.post('/join/:challengeId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const challengeId = req.params.challengeId;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    if (challenge.participants.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push(userId);
    await challenge.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { challengesJoined: challengeId } });

    res.json({ message: 'Challenge joined successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error joining challenge', error: error.message });
  }
});

// GET /api/user/challenges
router.get('/challenges', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'challengesJoined',
      select: 'title description startDate endDate',
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ challenges: user.challengesJoined });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching joined challenges', error: error.message });
  }
});


// PUT /api/user/city - with GeoDB city validation
router.put('/city', verifyToken, async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) return res.status(400).json({ message: 'City is required' });

    // Validate city via GeoDB API
    const geoRes = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
      params: { namePrefix: city, limit: 10 },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    const cityExists = geoRes.data.data.some(
      c => c.name.toLowerCase() === city.toLowerCase()
    );

    if (!cityExists) {
      return res.status(400).json({ message: 'Invalid city name' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { city },
      { new: true }
    ).select('-password');

    res.json({ message: 'City updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ message: 'Error updating city', error: error.message });
  }
});


module.exports = router;
