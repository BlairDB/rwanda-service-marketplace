const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Business = require('../models/Business');
const { query } = require('../database/connection');
const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'servicerw-secret-key';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('userType').isIn(['customer', 'business'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      userType,
      businessName,
      businessCategory,
      businessDescription,
      businessLocation,
      businessAddress,
      businessWebsite
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: userType === 'business' ? 'provider' : 'customer'
    });

    // If business user, create business profile
    let business = null;
    if (userType === 'business' && businessName) {
      business = await Business.create({
        userId: user.id,
        businessName,
        category: businessCategory,
        description: businessDescription,
        location: businessLocation,
        address: businessAddress,
        website: businessWebsite,
        email: email,
        phone: phone
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Prepare response data
    const responseData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      role: user.role,
      verified: user.isVerified,
      registrationDate: user.createdAt
    };

    if (business) {
      responseData.businessName = business.businessName;
      responseData.businessSlug = business.slug;
      responseData.businessCategory = business.category;
      responseData.businessLocation = business.location;
      responseData.businessDescription = business.descriptionEn;
      responseData.businessAddress = business.addressEn;
      responseData.businessWebsite = business.websiteUrl;
      responseData.businessId = business.id;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: responseData,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Note: last_login_at column doesn't exist in current schema
    // await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    // Generate token
    const token = generateToken(user.id);

    // Prepare response data
    const responseData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phone,
      role: user.role,
      verified: user.isVerified,
      loginTime: new Date()
    };

    // Get user's business if they are a provider
    if (user.role === 'provider' && user.business) {
      responseData.businessName = user.business.businessName;
      responseData.businessSlug = user.business.slug;
      responseData.businessCategory = user.business.category;
      responseData.businessLocation = user.business.location;
      responseData.businessDescription = user.business.description;
      responseData.businessAddress = user.business.address;
      responseData.businessWebsite = user.business.website;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: responseData,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
