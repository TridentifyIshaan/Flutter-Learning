const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authService = {
  // Register new user
  register: async (email, password, fullName, userType = 'patient', phone = null) => {
    // Check if user exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        full_name: fullName,
        user_type: userType,
        phone,
        is_active: true,
      })
      .returning('*');

    return authService.generateToken(user);
  },

  // Login user
  login: async (email, password) => {
    const user = await db('users').where('email', email).first();

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (!user.is_active) {
      const error = new Error('User account is inactive');
      error.statusCode = 403;
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    return authService.generateToken(user);
  },

  // Generate JWT token
  generateToken: (user) => {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        userType: user.user_type,
        phone: user.phone,
      },
    };
  },

  // Get user by ID
  getUserById: async (userId) => {
    const user = await db('users').where('id', userId).first();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      userType: user.user_type,
      phone: user.phone,
      isActive: user.is_active,
    };
  },

  // Update user profile
  updateProfile: async (userId, data) => {
    const [user] = await db('users')
      .where('id', userId)
      .update({
        full_name: data.fullName || undefined,
        phone: data.phone || undefined,
      }, '*')
      .returning('*');

    return user;
  },
};

module.exports = authService;
