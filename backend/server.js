const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const ClaimHistory = require('./models/ClaimHistory');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add user
app.post('/users', async (req, res) => {
  const user = new User({ name: req.body.name });
  await user.save();
  res.json(user);
});

// Claim points
app.post('/claim', async (req, res) => {
  const { userId } = req.body;
  const points = Math.floor(Math.random() * 10) + 1;

  const user = await User.findById(userId);
  user.totalPoints += points;
  await user.save();

  const history = new ClaimHistory({ userId, points });
  await history.save();

  res.json({ points, user });
});

// Get leaderboard
app.get('/leaderboard', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  const ranked = users.map((u, i) => ({
    rank: i + 1,
    name: u.name,
    totalPoints: u.totalPoints,
    _id: u._id,
  }));
  res.json(ranked);
});

// History
app.get('/history/:userId', async (req, res) => {
  const history = await ClaimHistory.find({ userId: req.params.userId });
  res.json(history);
});

app.listen(5000, () => console.log('Server running on port 5000'));