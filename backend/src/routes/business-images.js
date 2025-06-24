const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const auth = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/business-images');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `business-${req.params.businessId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /api/v1/business-images/:businessId/upload - Upload business images
router.post('/:businessId/upload', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { businessId } = req.params;
    const { imageType = 'gallery', altText = '' } = req.body;
    
    // Verify business ownership
    const businessCheck = await query(
      'SELECT owner_id FROM businesses WHERE id = $1',
      [businessId]
    );
    
    if (businessCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }
    
    if (businessCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload images for this business'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedImages = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const imageUrl = `/uploads/business-images/${file.filename}`;
      
      // Get next display order
      const orderResult = await query(
        'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM business_images WHERE business_id = $1 AND image_type = $2',
        [businessId, imageType]
      );
      const displayOrder = orderResult.rows[0].next_order;
      
      // Insert image record
      const result = await query(`
        INSERT INTO business_images (business_id, image_url, image_type, alt_text, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING *
      `, [businessId, imageUrl, imageType, altText, displayOrder]);
      
      uploadedImages.push(result.rows[0]);
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      data: {
        images: uploadedImages
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// GET /api/v1/business-images/:businessId - Get business images
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { imageType } = req.query;
    
    let whereClause = 'WHERE business_id = $1 AND is_active = true';
    const params = [businessId];
    
    if (imageType) {
      whereClause += ' AND image_type = $2';
      params.push(imageType);
    }
    
    const result = await query(`
      SELECT * FROM business_images 
      ${whereClause}
      ORDER BY image_type, display_order ASC
    `, params);

    res.json({
      success: true,
      data: {
        images: result.rows
      }
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
      error: error.message
    });
  }
});

// PUT /api/v1/business-images/:imageId - Update image details
router.put('/:imageId', auth, [
  body('altText').optional().isLength({ max: 255 }),
  body('displayOrder').optional().isInt({ min: 1 })
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

    const { imageId } = req.params;
    const { altText, displayOrder } = req.body;
    
    // Verify ownership
    const imageCheck = await query(`
      SELECT bi.*, b.owner_id 
      FROM business_images bi
      JOIN businesses b ON bi.business_id = b.id
      WHERE bi.id = $1
    `, [imageId]);
    
    if (imageCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    if (imageCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this image'
      });
    }

    const updates = [];
    const params = [];
    let paramCount = 0;

    if (altText !== undefined) {
      paramCount++;
      updates.push(`alt_text = $${paramCount}`);
      params.push(altText);
    }

    if (displayOrder !== undefined) {
      paramCount++;
      updates.push(`display_order = $${paramCount}`);
      params.push(displayOrder);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    paramCount++;
    params.push(imageId);

    const result = await query(`
      UPDATE business_images 
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `, params);

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: {
        image: result.rows[0]
      }
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error.message
    });
  }
});

// DELETE /api/v1/business-images/:imageId - Delete image
router.delete('/:imageId', auth, async (req, res) => {
  try {
    const { imageId } = req.params;
    
    // Verify ownership and get image details
    const imageCheck = await query(`
      SELECT bi.*, b.owner_id 
      FROM business_images bi
      JOIN businesses b ON bi.business_id = b.id
      WHERE bi.id = $1
    `, [imageId]);
    
    if (imageCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    if (imageCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this image'
      });
    }

    const image = imageCheck.rows[0];
    
    // Delete file from filesystem
    try {
      const filePath = path.join(__dirname, '../../', image.image_url);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('Failed to delete file:', fileError.message);
    }
    
    // Delete from database
    await query('DELETE FROM business_images WHERE id = $1', [imageId]);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;
