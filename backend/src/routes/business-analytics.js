const express = require('express');
const BusinessAnalytics = require('../models/BusinessAnalytics');
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

// POST /api/business-analytics/:businessId/event - Record analytics event (public)
router.post('/:businessId/event', async (req, res) => {
  try {
    const { businessId } = req.params;
    const { eventType, eventData } = req.body;

    // Validate event type
    const validEvents = [
      'page_view', 'unique_visitor', 'contact_click', 'phone_click', 
      'email_click', 'website_click', 'direction_request', 'search_appearance',
      'search_click', 'review_view', 'photo_view'
    ];

    if (!validEvents.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type'
      });
    }

    // Verify business exists
    const businessResult = await query('SELECT id FROM businesses WHERE id = $1', [businessId]);
    if (businessResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Business not found'
      });
    }

    await BusinessAnalytics.recordEvent(businessId, eventType, eventData);

    res.json({
      success: true,
      message: 'Event recorded successfully'
    });
  } catch (error) {
    console.error('Record analytics event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record event',
      error: error.message
    });
  }
});

// GET /api/business-analytics/:businessId/overview - Get analytics overview (authenticated)
router.get('/:businessId/overview', authenticateToken, async (req, res) => {
  try {
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
        message: 'Not authorized to view analytics for this business'
      });
    }

    // Get various analytics data
    const [weeklyStats, monthlyStats, growthStats] = await Promise.all([
      BusinessAnalytics.getWeeklyStats(businessId),
      BusinessAnalytics.getMonthlyStats(businessId),
      BusinessAnalytics.getGrowthStats(businessId)
    ]);

    // Get recent daily data for charts
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dailyData = await BusinessAnalytics.findByDateRange(businessId, startDate, endDate);

    res.json({
      success: true,
      data: {
        weeklyStats,
        monthlyStats,
        growthStats,
        dailyData,
        summary: {
          totalViews: monthlyStats.totalPageViews,
          totalContacts: monthlyStats.totalContactClicks,
          avgDailyViews: monthlyStats.avgDailyViews,
          conversionRate: monthlyStats.totalPageViews > 0 
            ? ((monthlyStats.totalContactClicks / monthlyStats.totalPageViews) * 100).toFixed(2)
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// GET /api/business-analytics/:businessId/detailed - Get detailed analytics (authenticated)
router.get('/:businessId/detailed', authenticateToken, async (req, res) => {
  try {
    const { businessId } = req.params;
    const { startDate, endDate, period = 'daily' } = req.query;

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
        message: 'Not authorized to view analytics for this business'
      });
    }

    // Set default date range if not provided
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let analyticsData;
    
    if (period === 'daily') {
      analyticsData = await BusinessAnalytics.findByDateRange(businessId, start, end);
    } else {
      // For weekly/monthly aggregation, we'll need to implement grouping
      analyticsData = await BusinessAnalytics.findByDateRange(businessId, start, end);
    }

    // Calculate totals and averages
    const totals = analyticsData.reduce((acc, day) => {
      acc.pageViews += day.pageViews;
      acc.uniqueVisitors += day.uniqueVisitors;
      acc.contactClicks += day.contactClicks;
      acc.phoneClicks += day.phoneClicks;
      acc.emailClicks += day.emailClicks;
      acc.websiteClicks += day.websiteClicks;
      acc.directionRequests += day.directionRequests;
      return acc;
    }, {
      pageViews: 0,
      uniqueVisitors: 0,
      contactClicks: 0,
      phoneClicks: 0,
      emailClicks: 0,
      websiteClicks: 0,
      directionRequests: 0
    });

    const averages = {
      avgDailyViews: analyticsData.length > 0 ? (totals.pageViews / analyticsData.length).toFixed(1) : 0,
      avgDailyContacts: analyticsData.length > 0 ? (totals.contactClicks / analyticsData.length).toFixed(1) : 0,
      conversionRate: totals.pageViews > 0 ? ((totals.contactClicks / totals.pageViews) * 100).toFixed(2) : 0
    };

    res.json({
      success: true,
      data: {
        analyticsData,
        totals,
        averages,
        period: {
          startDate: start,
          endDate: end,
          period
        }
      }
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch detailed analytics',
      error: error.message
    });
  }
});

// GET /api/business-analytics/:businessId/performance - Get performance metrics (authenticated)
router.get('/:businessId/performance', authenticateToken, async (req, res) => {
  try {
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
        message: 'Not authorized to view analytics for this business'
      });
    }

    // Get performance metrics
    const performanceResult = await query(`
      SELECT 
        b.view_count,
        b.contact_count,
        b.rating,
        b.review_count,
        b.monthly_views,
        b.monthly_contacts,
        b.response_rate,
        b.average_response_time,
        COUNT(DISTINCT ba.date) as active_days,
        AVG(ba.page_views) as avg_daily_views,
        MAX(ba.page_views) as peak_daily_views,
        SUM(ba.search_appearances) as total_search_appearances,
        SUM(ba.search_clicks) as total_search_clicks
      FROM businesses b
      LEFT JOIN business_analytics ba ON b.id = ba.business_id 
        AND ba.date >= CURRENT_DATE - INTERVAL '30 days'
      WHERE b.id = $1
      GROUP BY b.id, b.view_count, b.contact_count, b.rating, b.review_count, 
               b.monthly_views, b.monthly_contacts, b.response_rate, b.average_response_time
    `, [businessId]);

    const performance = performanceResult.rows[0];

    // Calculate additional metrics
    const searchCTR = performance.total_search_appearances > 0 
      ? ((performance.total_search_clicks / performance.total_search_appearances) * 100).toFixed(2)
      : 0;

    const conversionRate = performance.monthly_views > 0 
      ? ((performance.monthly_contacts / performance.monthly_views) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalViews: parseInt(performance.view_count) || 0,
        totalContacts: parseInt(performance.contact_count) || 0,
        monthlyViews: parseInt(performance.monthly_views) || 0,
        monthlyContacts: parseInt(performance.monthly_contacts) || 0,
        rating: parseFloat(performance.rating) || 0,
        reviewCount: parseInt(performance.review_count) || 0,
        responseRate: parseFloat(performance.response_rate) || 0,
        avgResponseTime: parseInt(performance.average_response_time) || 0,
        activeDays: parseInt(performance.active_days) || 0,
        avgDailyViews: parseFloat(performance.avg_daily_views) || 0,
        peakDailyViews: parseInt(performance.peak_daily_views) || 0,
        searchAppearances: parseInt(performance.total_search_appearances) || 0,
        searchClicks: parseInt(performance.total_search_clicks) || 0,
        searchCTR: parseFloat(searchCTR),
        conversionRate: parseFloat(conversionRate)
      }
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics',
      error: error.message
    });
  }
});

module.exports = router;
