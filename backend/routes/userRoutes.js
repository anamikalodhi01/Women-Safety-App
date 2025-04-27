const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Token generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Middleware to authenticate users based on JWT token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token)
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = await User.create({ name, email, phone, password });
    const token = generateToken(newUser._id);

    res.json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD FRIEND
// Add Friend Route
router.post('/add', authenticate, async (req, res) => {
  const { name, phone } = req.body;
  console.log(name, phone)

  if (!name || !phone) {
    return res.status(400).json({ error: 'userId, name, and phone are required' });
  }

  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if this phone already exists in user's friends
    const alreadyExists = user.friends.some(friend => friend.phone === phone);

    if (alreadyExists) {
      return res.status(400).json({ error: 'Friend already exists' });
    }

    // Add the friend
    user.friends.push({ name, phone });
    await user.save();

    console.log(user)

    res.status(200).json({ message: 'Friend added successfully', friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a friend (no middleware, using userId + phone)
router.post('/delete', authenticate, async (req, res) => {
  const {phone} = req.body;
  console.log(req.body)

  if (!phone) {
    return res.status(400).json({ error: 'userId and phone number are required' });
  }

  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter out the friend with the given phone number
    const updatedFriends = user.friends.filter(friend => friend.phone !== phone);

    if (updatedFriends.length === user.friends.length) {
      return res.status(404).json({ error: 'Friend not found in your list' });
    }

    user.friends = updatedFriends;
    await user.save();

    res.status(200).json({ message: 'Friend deleted successfully', friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Profile Route
// Edit Profile Route
router.put('/editProfile', authenticate, async (req, res) => {
  const { name, email, phone, fakeCallerName } = req.body;

  try {
    const user = await User.findById(req.user); // req.user is populated by the authenticate middleware

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (fakeCallerName !== undefined) user.fakeCallerName = fakeCallerName;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      updatedUser: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        fakeCallerName: user.fakeCallerName
      }
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/getUser', authenticate, async (req, res) => {
    const user = await User.findById(req.user).select({
      _id: false,
      name: true, 
      friends: true, 
      email: true, 
      phone: true
    }); 

    return res.status(200).json({ data: user });

})

module.exports = router;