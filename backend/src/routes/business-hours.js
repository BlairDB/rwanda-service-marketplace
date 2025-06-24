const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/v1/business-hours/:businessId - Get business operating hours
router.get('/:businessId', async (req, res) => {
  try {
    const { businessId } = req.params;
    
    const result = await query(`
      SELECT * FROM business_operating_hours 
      WHERE business_id = $1 
      ORDER BY day_of_week ASC
    `, [businessId]);

    // If no hours exist, return default structure
    if (result.rows.length === 0) {
      const defaultHours = [];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      for (let i = 0; i < 7; i++) {
        defaultHours.push({
          day_of_week: i,
          day_name: days[i],
          is_open: i < 5, // Monday-Friday open by default
          open_time: '09:00',
          close_time: '17:00',
          break_start_time: null,
          break_end_time: null
        });
      }
      
      return res.json({
        success: true,
        data: {
          hours: defaultHours,
          isDefault: true
        }
      });
    }

    // Add day names to the results
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hoursWithNames = result.rows.map(hour => ({
      ...hour,
      day_name: days[hour.day_of_week]
    }));

    res.json({
      success: true,
      data: {
        hours: hoursWithNames,
        isDefault: false
      }
    });
  } catch (error) {
    console.error('Get business hours error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business hours',
      error: error.message
    });
  }
});

// POST /api/v1/business-hours/:businessId - Set business operating hours
router.post('/:businessId', auth, [
  body('hours').isArray().withMessage('Hours must be an array'),
  body('hours.*.day_of_week').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
  body('hours.*.is_open').isBoolean().withMessage('is_open must be boolean'),
  body('hours.*.open_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid open time format'),
  body('hours.*.close_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid close time format'),
  body('hours.*.break_start_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid break start time format'),
  body('hours.*.break_end_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid break end time format')
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
    const { hours } = req.body;
    
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
        message: 'Not authorized to update hours for this business'
      });
    }

    // Validate hours data
    if (hours.length !== 7) {
      return res.status(400).json({
        success: false,
        message: 'Must provide hours for all 7 days of the week'
      });
    }

    // Begin transaction
    await query('BEGIN');

    try {
      // Delete existing hours
      await query('DELETE FROM business_operating_hours WHERE business_id = $1', [businessId]);
      
      // Insert new hours
      for (const hour of hours) {
        const {
          day_of_week,
          is_open,
          open_time,
          close_time,
          break_start_time,
          break_end_time
        } = hour;
        
        // Validate that open/close times are provided if is_open is true
        if (is_open && (!open_time || !close_time)) {
          throw new Error(`Open and close times are required for ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day_of_week]}`);
        }
        
        // Validate break times
        if (break_start_time && !break_end_time) {
          throw new Error('Break end time is required when break start time is provided');
        }
        if (break_end_time && !break_start_time) {
          throw new Error('Break start time is required when break end time is provided');
        }
        
        await query(`
          INSERT INTO business_operating_hours 
          (business_id, day_of_week, is_open, open_time, close_time, break_start_time, break_end_time)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          businessId,
          day_of_week,
          is_open,
          is_open ? open_time : null,
          is_open ? close_time : null,
          break_start_time || null,
          break_end_time || null
        ]);
      }
      
      await query('COMMIT');
      
      // Return updated hours
      const updatedHours = await query(`
        SELECT * FROM business_operating_hours 
        WHERE business_id = $1 
        ORDER BY day_of_week ASC
      `, [businessId]);
      
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const hoursWithNames = updatedHours.rows.map(hour => ({
        ...hour,
        day_name: days[hour.day_of_week]
      }));

      res.json({
        success: true,
        message: 'Business hours updated successfully',
        data: {
          hours: hoursWithNames
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Set business hours error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update business hours',
      error: error.message
    });
  }
});

// GET /api/v1/business-hours/:businessId/current-status - Get current open/closed status
router.get('/:businessId/current-status', async (req, res) => {
  try {
    const { businessId } = req.params;
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    // Convert Sunday (0) to our format (6), and shift others down by 1
    const dayOfWeek = currentDay === 0 ? 6 : currentDay - 1;
    
    const result = await query(`
      SELECT * FROM business_operating_hours 
      WHERE business_id = $1 AND day_of_week = $2
    `, [businessId, dayOfWeek]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          isOpen: false,
          status: 'Hours not set',
          nextChange: null
        }
      });
    }

    const todayHours = result.rows[0];
    
    if (!todayHours.is_open) {
      return res.json({
        success: true,
        data: {
          isOpen: false,
          status: 'Closed today',
          nextChange: null
        }
      });
    }

    const openTime = todayHours.open_time;
    const closeTime = todayHours.close_time;
    const breakStart = todayHours.break_start_time;
    const breakEnd = todayHours.break_end_time;
    
    let isOpen = false;
    let status = '';
    let nextChange = null;
    
    if (currentTime < openTime) {
      isOpen = false;
      status = `Opens at ${openTime}`;
      nextChange = openTime;
    } else if (currentTime >= closeTime) {
      isOpen = false;
      status = `Closed (opened until ${closeTime})`;
    } else if (breakStart && breakEnd && currentTime >= breakStart && currentTime < breakEnd) {
      isOpen = false;
      status = `On break (returns at ${breakEnd})`;
      nextChange = breakEnd;
    } else {
      isOpen = true;
      if (breakStart && currentTime < breakStart) {
        status = `Open (break at ${breakStart})`;
        nextChange = breakStart;
      } else {
        status = `Open until ${closeTime}`;
        nextChange = closeTime;
      }
    }

    res.json({
      success: true,
      data: {
        isOpen,
        status,
        nextChange,
        todayHours: {
          open_time: openTime,
          close_time: closeTime,
          break_start_time: breakStart,
          break_end_time: breakEnd
        }
      }
    });
  } catch (error) {
    console.error('Get current status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get current status',
      error: error.message
    });
  }
});

module.exports = router;
