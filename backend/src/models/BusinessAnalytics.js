const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class BusinessAnalytics {
  constructor(data) {
    Object.assign(this, data);
  }

  static async recordEvent(businessId, eventType, eventData = {}) {
    const today = new Date().toISOString().split('T')[0];
    
    // Get or create today's analytics record
    let analytics = await this.findByDate(businessId, today);
    
    if (!analytics) {
      analytics = await this.create({
        businessId,
        date: today
      });
    }

    // Update the specific metric
    const updateField = this.getEventField(eventType);
    if (updateField) {
      await query(`
        UPDATE business_analytics 
        SET ${updateField} = ${updateField} + 1
        WHERE business_id = $1 AND date = $2
      `, [businessId, today]);

      // Also update the main businesses table for quick access
      await this.updateBusinessCounters(businessId, eventType);
    }

    return analytics;
  }

  static async create(analyticsData) {
    const {
      businessId,
      date,
      pageViews = 0,
      uniqueVisitors = 0,
      contactClicks = 0,
      phoneClicks = 0,
      emailClicks = 0,
      websiteClicks = 0,
      directionRequests = 0,
      searchAppearances = 0,
      searchClicks = 0,
      reviewViews = 0,
      photoViews = 0
    } = analyticsData;

    const id = uuidv4();

    const result = await query(`
      INSERT INTO business_analytics (
        id, business_id, date, page_views, unique_visitors, contact_clicks,
        phone_clicks, email_clicks, website_clicks, direction_requests,
        search_appearances, search_clicks, review_views, photo_views
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      id, businessId, date, pageViews, uniqueVisitors, contactClicks,
      phoneClicks, emailClicks, websiteClicks, directionRequests,
      searchAppearances, searchClicks, reviewViews, photoViews
    ]);

    return new BusinessAnalytics(this.mapDbRow(result.rows[0]));
  }

  static async findByDate(businessId, date) {
    const result = await query(`
      SELECT * FROM business_analytics 
      WHERE business_id = $1 AND date = $2
    `, [businessId, date]);

    if (result.rows.length === 0) {
      return null;
    }

    return new BusinessAnalytics(this.mapDbRow(result.rows[0]));
  }

  static async findByDateRange(businessId, startDate, endDate) {
    const result = await query(`
      SELECT * FROM business_analytics 
      WHERE business_id = $1 AND date >= $2 AND date <= $3
      ORDER BY date ASC
    `, [businessId, startDate, endDate]);

    return result.rows.map(row => new BusinessAnalytics(this.mapDbRow(row)));
  }

  static async getWeeklyStats(businessId) {
    const result = await query(`
      SELECT 
        SUM(page_views) as total_page_views,
        SUM(unique_visitors) as total_unique_visitors,
        SUM(contact_clicks) as total_contact_clicks,
        SUM(phone_clicks) as total_phone_clicks,
        SUM(email_clicks) as total_email_clicks,
        SUM(website_clicks) as total_website_clicks,
        SUM(direction_requests) as total_direction_requests,
        AVG(page_views) as avg_daily_views
      FROM business_analytics 
      WHERE business_id = $1 
      AND date >= CURRENT_DATE - INTERVAL '7 days'
    `, [businessId]);

    return this.mapStatsRow(result.rows[0]);
  }

  static async getMonthlyStats(businessId) {
    const result = await query(`
      SELECT 
        SUM(page_views) as total_page_views,
        SUM(unique_visitors) as total_unique_visitors,
        SUM(contact_clicks) as total_contact_clicks,
        SUM(phone_clicks) as total_phone_clicks,
        SUM(email_clicks) as total_email_clicks,
        SUM(website_clicks) as total_website_clicks,
        SUM(direction_requests) as total_direction_requests,
        AVG(page_views) as avg_daily_views
      FROM business_analytics 
      WHERE business_id = $1 
      AND date >= CURRENT_DATE - INTERVAL '30 days'
    `, [businessId]);

    return this.mapStatsRow(result.rows[0]);
  }

  static async getGrowthStats(businessId) {
    const result = await query(`
      SELECT 
        -- Current month
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '30 days' THEN page_views ELSE 0 END) as current_month_views,
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '30 days' THEN contact_clicks ELSE 0 END) as current_month_contacts,
        
        -- Previous month
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '60 days' AND date < CURRENT_DATE - INTERVAL '30 days' THEN page_views ELSE 0 END) as previous_month_views,
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '60 days' AND date < CURRENT_DATE - INTERVAL '30 days' THEN contact_clicks ELSE 0 END) as previous_month_contacts,
        
        -- Current week
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '7 days' THEN page_views ELSE 0 END) as current_week_views,
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '7 days' THEN contact_clicks ELSE 0 END) as current_week_contacts,
        
        -- Previous week
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '14 days' AND date < CURRENT_DATE - INTERVAL '7 days' THEN page_views ELSE 0 END) as previous_week_views,
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '14 days' AND date < CURRENT_DATE - INTERVAL '7 days' THEN contact_clicks ELSE 0 END) as previous_week_contacts
      FROM business_analytics 
      WHERE business_id = $1
    `, [businessId]);

    const stats = result.rows[0];
    
    return {
      monthlyViewsGrowth: this.calculateGrowthPercentage(stats.current_month_views, stats.previous_month_views),
      monthlyContactsGrowth: this.calculateGrowthPercentage(stats.current_month_contacts, stats.previous_month_contacts),
      weeklyViewsGrowth: this.calculateGrowthPercentage(stats.current_week_views, stats.previous_week_views),
      weeklyContactsGrowth: this.calculateGrowthPercentage(stats.current_week_contacts, stats.previous_week_contacts),
      currentMonthViews: parseInt(stats.current_month_views) || 0,
      currentMonthContacts: parseInt(stats.current_month_contacts) || 0,
      currentWeekViews: parseInt(stats.current_week_views) || 0,
      currentWeekContacts: parseInt(stats.current_week_contacts) || 0
    };
  }

  static calculateGrowthPercentage(current, previous) {
    if (!previous || previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous * 100).toFixed(1);
  }

  static getEventField(eventType) {
    const eventMap = {
      'page_view': 'page_views',
      'unique_visitor': 'unique_visitors',
      'contact_click': 'contact_clicks',
      'phone_click': 'phone_clicks',
      'email_click': 'email_clicks',
      'website_click': 'website_clicks',
      'direction_request': 'direction_requests',
      'search_appearance': 'search_appearances',
      'search_click': 'search_clicks',
      'review_view': 'review_views',
      'photo_view': 'photo_views'
    };
    return eventMap[eventType];
  }

  static async updateBusinessCounters(businessId, eventType) {
    if (eventType === 'page_view') {
      await query(`
        UPDATE businesses 
        SET view_count = view_count + 1, monthly_views = monthly_views + 1
        WHERE id = $1
      `, [businessId]);
    } else if (eventType === 'contact_click' || eventType === 'phone_click' || eventType === 'email_click') {
      await query(`
        UPDATE businesses 
        SET contact_count = contact_count + 1, monthly_contacts = monthly_contacts + 1
        WHERE id = $1
      `, [businessId]);
    }
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      businessId: row.business_id,
      date: row.date,
      pageViews: parseInt(row.page_views) || 0,
      uniqueVisitors: parseInt(row.unique_visitors) || 0,
      contactClicks: parseInt(row.contact_clicks) || 0,
      phoneClicks: parseInt(row.phone_clicks) || 0,
      emailClicks: parseInt(row.email_clicks) || 0,
      websiteClicks: parseInt(row.website_clicks) || 0,
      directionRequests: parseInt(row.direction_requests) || 0,
      searchAppearances: parseInt(row.search_appearances) || 0,
      searchClicks: parseInt(row.search_clicks) || 0,
      reviewViews: parseInt(row.review_views) || 0,
      photoViews: parseInt(row.photo_views) || 0,
      createdAt: row.created_at
    };
  }

  static mapStatsRow(row) {
    return {
      totalPageViews: parseInt(row.total_page_views) || 0,
      totalUniqueVisitors: parseInt(row.total_unique_visitors) || 0,
      totalContactClicks: parseInt(row.total_contact_clicks) || 0,
      totalPhoneClicks: parseInt(row.total_phone_clicks) || 0,
      totalEmailClicks: parseInt(row.total_email_clicks) || 0,
      totalWebsiteClicks: parseInt(row.total_website_clicks) || 0,
      totalDirectionRequests: parseInt(row.total_direction_requests) || 0,
      avgDailyViews: parseFloat(row.avg_daily_views) || 0
    };
  }
}

module.exports = BusinessAnalytics;
