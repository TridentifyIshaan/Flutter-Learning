const express = require('express');
const authService = require('../services/authService');
const authMiddleware = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, userType, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'fullName'],
      });
    }

    const result = await authService.register(email, password, fullName, userType, phone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password'],
      });
    }

    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    const user = await authService.updateProfile(req.user.id, { fullName, phone });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
