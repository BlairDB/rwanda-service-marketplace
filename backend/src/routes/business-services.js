const express = require('express');
const { body, validationResult } = require('express-validator');
const BusinessService = require('../models/BusinessService');
const { query } = require('../database/connection');
const router = express.Router();

// Middleware to verify JWT token (reuse from businesses.js)
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

    try {
      const User = require('../models/User');
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

// GET /api/business-services/:businessId - Get services for a business
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const services = await BusinessService.findByBusinessId(businessId);
    
    res.json({
      success: true,
      data: {
        services
      }
    });
  } catch (error) {
    console.error('Get business services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business services',
      error: error.message
    });
  }
});

// POST /api/business-services/:businessId - Add service to business (authenticated)
router.post('/:businessId', authenticateToken, [
  body('serviceName').trim().isLength({ min: 2 }).withMessage('Service name must be at least 2 characters'),
  body('serviceDescription').optional().trim(),
  body('priceRange').optional().trim(),
  body('duration').optional().trim(),
  body('isFeatured').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { businessId } = req.params;

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [businessId]);
    if (businessOwnerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    if (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add services to this business'
      });
    }

    const serviceData = {
      businessId,
      ...req.body
    };

    const service = await BusinessService.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Add business service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add service',
      error: error.message
    });
  }
});

// PUT /api/business-services/service/:serviceId - Update service (authenticated)
router.put('/service/:serviceId', authenticateToken, [
  body('serviceName').optional().trim().isLength({ min: 2 }),
  body('serviceDescription').optional().trim(),
  body('priceRange').optional().trim(),
  body('duration').optional().trim(),
  body('isFeatured').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { serviceId } = req.params;

    const service = await BusinessService.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [service.businessId]);
    if (businessOwnerResult.rows.length === 0 || 
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    await service.update(req.body);

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: {
        service
      }
    });
  } catch (error) {
    console.error('Update business service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
});

// DELETE /api/business-services/service/:serviceId - Delete service (authenticated)
router.delete('/service/:serviceId', authenticateToken, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await BusinessService.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [service.businessId]);
    if (businessOwnerResult.rows.length === 0 || 
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    await service.delete();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete business service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
});

module.exports = router;
