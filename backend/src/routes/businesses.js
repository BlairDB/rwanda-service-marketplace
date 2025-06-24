const express = require('express');
const { body, validationResult } = require('express-validator');
const Business = require('../models/Business');
const User = require('../models/User');
const { query } = require('../database/connection');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'servicerw-secret-key';

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from database
    try {
      const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
      if (userResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'User not found'
        });
      }
      req.user = User.mapDbRow(userResult.rows[0]);
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  });
};

// GET /api/businesses - Get all businesses with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      location,
      search,
      page = 1,
      limit = 12,
      sortBy = 'created_at',
      verified
    } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
      category,
      location,
      search,
      verified: verified === 'true' ? true : verified === 'false' ? false : undefined,
      sortBy,
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const businesses = await Business.findAll(filters);

    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.status = 'approved'
      ${category ? "AND c.slug = '" + category + "'" : ''}
      ${location ? "AND l.name_en ILIKE '%" + location + "%'" : ''}
      ${search ? "AND (b.business_name ILIKE '%" + search + "%' OR b.description_en ILIKE '%" + search + "%')" : ''}
      ${verified !== undefined ? "AND b.is_verified = " + (verified === 'true') : ''}
    `);

    const totalItems = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        businesses,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch businesses',
      error: error.message
    });
  }
});

// GET /api/businesses/category/:category - Get businesses by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const filters = {
      category,
      sortBy: 'rating',
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const businesses = await Business.findAll(filters);

    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.status = 'approved' AND c.slug = $1
    `, [category]);

    const totalItems = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        businesses,
        category,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get businesses by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch businesses',
      error: error.message
    });
  }
});

// GET /api/businesses/:category/:slug - Get business by category and slug
router.get('/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;

    const business = await Business.findBySlug(category, slug);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Increment view count
    await business.incrementViewCount();

    res.json({
      success: true,
      data: {
        business
      }
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business',
      error: error.message
    });
  }
});

// POST /api/businesses - Create new business (authenticated)
router.post('/', authenticateToken, [
  body('businessName').trim().isLength({ min: 2 }).withMessage('Business name must be at least 2 characters'),
  body('categoryId').isUUID().withMessage('Valid category ID required'),
  body('locationId').isUUID().withMessage('Valid location ID required'),
  body('descriptionEn').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('addressEn').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('phonePrimary').optional().isMobilePhone(),
  body('email').optional().isEmail(),
  body('websiteUrl').optional().isURL()
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

    // Check if user already has a business
    const existingBusiness = await Business.findByOwnerId(req.user.id);
    if (existingBusiness.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already has a business registered'
      });
    }

    const {
      businessName,
      categoryId,
      locationId,
      descriptionEn,
      addressEn,
      phonePrimary,
      email,
      websiteUrl
    } = req.body;

    // Generate slug
    const slug = businessName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists
    const existingSlug = await query('SELECT id FROM businesses WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Business name already exists, please choose a different name'
      });
    }

    // Create business
    const result = await query(`
      INSERT INTO businesses (
        owner_id, business_name, slug, category_id, location_id,
        description_en, address_en, phone_primary, email, website_url,
        status, is_verified
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      req.user.id, businessName, slug, categoryId, locationId,
      descriptionEn, addressEn, phonePrimary, email, websiteUrl,
      'pending', false
    ]);

    const business = new Business(Business.mapDbRow(result.rows[0]));

    res.status(201).json({
      success: true,
      message: 'Business created successfully',
      data: {
        business
      }
    });
  } catch (error) {
    console.error('Create business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create business',
      error: error.message
    });
  }
});

// GET /api/businesses/my - Get current user's businesses (authenticated)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const businesses = await Business.findByOwnerId(req.user.id);

    res.json({
      success: true,
      data: {
        businesses
      }
    });
  } catch (error) {
    console.error('Get my businesses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch businesses',
      error: error.message
    });
  }
});

// PUT /api/businesses/:id - Update business (authenticated)
router.put('/:id', authenticateToken, [
  body('businessName').optional().trim().isLength({ min: 2 }),
  body('categoryId').optional().isUUID(),
  body('locationId').optional().isUUID(),
  body('descriptionEn').optional().trim().isLength({ min: 10 }),
  body('addressEn').optional().trim().isLength({ min: 5 }),
  body('phonePrimary').optional().isMobilePhone(),
  body('email').optional().isEmail(),
  body('websiteUrl').optional().isURL()
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

    const { id } = req.params;

    // Find business and verify ownership
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if user owns this business or is admin
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [id]);
    if (businessOwnerResult.rows.length === 0 ||
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this business'
      });
    }

    // Update business
    const updateData = req.body;

    // If business name is being updated, update slug too
    if (updateData.businessName) {
      const newSlug = updateData.businessName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if new slug already exists
      const existingSlug = await query('SELECT id FROM businesses WHERE slug = $1 AND id != $2', [newSlug, id]);
      if (existingSlug.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Business name already exists, please choose a different name'
        });
      }
      updateData.slug = newSlug;
    }

    await business.update(updateData);

    res.json({
      success: true,
      message: 'Business updated successfully',
      data: {
        business
      }
    });
  } catch (error) {
    console.error('Update business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update business',
      error: error.message
    });
  }
});

// DELETE /api/businesses/:id - Delete business (authenticated)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find business and verify ownership
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    // Check if user owns this business or is admin
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [id]);
    if (businessOwnerResult.rows.length === 0 ||
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this business'
      });
    }

    // Soft delete business
    await business.delete();

    res.json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    console.error('Delete business error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete business',
      error: error.message
    });
  }
});

module.exports = router;