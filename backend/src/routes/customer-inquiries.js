const express = require('express');
const { body, validationResult } = require('express-validator');
const CustomerInquiry = require('../models/CustomerInquiry');
const BusinessAnalytics = require('../models/BusinessAnalytics');
const { query } = require('../database/connection');
const emailService = require('../services/emailService');
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

// POST /api/customer-inquiries/:businessId - Submit inquiry to business (public)
router.post('/:businessId', [
  body('customerName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('customerEmail').isEmail().withMessage('Valid email address required'),
  body('customerPhone').optional().trim(),
  body('subject').trim().isLength({ min: 3 }).withMessage('Subject must be at least 3 characters'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('inquiryType').optional().isIn(['general', 'quote', 'service', 'complaint', 'partnership'])
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

    // Verify business exists and is active
    const businessResult = await query('SELECT id, business_name FROM businesses WHERE id = $1 AND status = $2', [businessId, 'approved']);
    if (businessResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found or not available'
      });
    }

    const inquiryData = {
      businessId,
      ...req.body
    };

    const inquiry = await CustomerInquiry.create(inquiryData);

    // Record analytics event
    await BusinessAnalytics.recordEvent(businessId, 'contact_click');

    // Send email notification to business owner (async, don't wait)
    emailService.sendInquiryNotification(inquiry.id).catch(error => {
      console.error('Failed to send inquiry notification email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully. The business will contact you soon.',
      data: {
        inquiryId: inquiry.id
      }
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry',
      error: error.message
    });
  }
});

// GET /api/customer-inquiries/business/:businessId - Get inquiries for business (authenticated)
router.get('/business/:businessId', authenticateToken, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { status, inquiryType, priority, page = 1, limit = 20, sortBy = 'newest' } = req.query;

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
        message: 'Not authorized to view inquiries for this business'
      });
    }

    const filters = {
      status,
      inquiryType,
      priority,
      sortBy,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    const inquiries = await CustomerInquiry.findByBusinessId(businessId, filters);
    const stats = await CustomerInquiry.getStats(businessId);

    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM customer_inquiries 
      WHERE business_id = $1
      ${status ? "AND status = '" + status + "'" : ''}
      ${inquiryType ? "AND inquiry_type = '" + inquiryType + "'" : ''}
      ${priority ? "AND priority = '" + priority + "'" : ''}
    `, [businessId]);

    const totalItems = parseInt(countResult.rows[0].total);

    res.json({
      success: true,
      data: {
        inquiries,
        stats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalItems / limit),
          totalItems,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get business inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      error: error.message
    });
  }
});

// GET /api/customer-inquiries/:inquiryId - Get specific inquiry (authenticated)
router.get('/:inquiryId', authenticateToken, async (req, res) => {
  try {
    const { inquiryId } = req.params;

    const inquiry = await CustomerInquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [inquiry.businessId]);
    if (businessOwnerResult.rows.length === 0 || 
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this inquiry'
      });
    }

    // Mark as read if it's new
    if (inquiry.status === 'new') {
      await inquiry.markAsRead();
    }

    res.json({
      success: true,
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry',
      error: error.message
    });
  }
});

// PUT /api/customer-inquiries/:inquiryId/respond - Respond to inquiry (authenticated)
router.put('/:inquiryId/respond', authenticateToken, [
  body('responseMessage').trim().isLength({ min: 10 }).withMessage('Response must be at least 10 characters')
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

    const { inquiryId } = req.params;
    const { responseMessage } = req.body;

    const inquiry = await CustomerInquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [inquiry.businessId]);
    if (businessOwnerResult.rows.length === 0 || 
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this inquiry'
      });
    }

    await inquiry.respond(responseMessage);

    // Send email notification to customer (async, don't wait)
    emailService.sendResponseNotification(inquiry.id, responseMessage).catch(error => {
      console.error('Failed to send response notification email:', error);
    });

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Respond to inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send response',
      error: error.message
    });
  }
});

// PUT /api/customer-inquiries/:inquiryId/status - Update inquiry status (authenticated)
router.put('/:inquiryId/status', authenticateToken, [
  body('status').isIn(['new', 'read', 'responded', 'closed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent'])
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

    const { inquiryId } = req.params;
    const { status, priority } = req.body;

    const inquiry = await CustomerInquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Verify business ownership
    const businessOwnerResult = await query('SELECT owner_id FROM businesses WHERE id = $1', [inquiry.businessId]);
    if (businessOwnerResult.rows.length === 0 || 
        (businessOwnerResult.rows[0].owner_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    if (status) {
      await inquiry.updateStatus(status);
    }

    if (priority) {
      await inquiry.updatePriority(priority);
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry',
      error: error.message
    });
  }
});

module.exports = router;
