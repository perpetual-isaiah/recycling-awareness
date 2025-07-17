const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const guideRoutes = require('./routes/guides');
app.use('/api/guides', guideRoutes);

const recyclingPointsRoutes = require('./routes/recyclingPoints');
app.use('/api/recycling-points', recyclingPointsRoutes);

// New user routes (e.g., update location)
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const challengeRoutes = require('./routes/challenges');
app.use('/api/challenges', challengeRoutes);

const impactRoutes = require('./routes/impact');
app.use('/api/impact', impactRoutes);

const uploadRoutes = require('./routes/uploads');
app.use('/api/uploads', uploadRoutes);

const recyclableRoutes = require('./routes/recyclables');
app.use('/api/recyclables', recyclableRoutes);

const userChallengesRouter = require('./routes/userChallenges');
app.use('/api/user-challenges', userChallengesRouter);




const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)  // <-- updated here
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
