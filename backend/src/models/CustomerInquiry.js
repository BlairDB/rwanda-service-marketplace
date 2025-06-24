const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class CustomerInquiry {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(inquiryData) {
    const {
      businessId,
      customerName,
      customerEmail,
      customerPhone,
      subject,
      message,
      inquiryType = 'general',
      source = 'website'
    } = inquiryData;

    const id = uuidv4();

    const result = await query(`
      INSERT INTO customer_inquiries (
        id, business_id, customer_name, customer_email, customer_phone,
        subject, message, inquiry_type, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      id, businessId, customerName, customerEmail, customerPhone,
      subject, message, inquiryType, source
    ]);

    // Update business contact count
    await query(`
      UPDATE businesses 
      SET contact_count = contact_count + 1, total_inquiries = total_inquiries + 1
      WHERE id = $1
    `, [businessId]);

    return new CustomerInquiry(this.mapDbRow(result.rows[0]));
  }

  static async findByBusinessId(businessId, filters = {}) {
    let whereClause = 'WHERE business_id = $1';
    const params = [businessId];
    let paramCount = 1;

    if (filters.status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.inquiryType) {
      paramCount++;
      whereClause += ` AND inquiry_type = $${paramCount}`;
      params.push(filters.inquiryType);
    }

    if (filters.priority) {
      paramCount++;
      whereClause += ` AND priority = $${paramCount}`;
      params.push(filters.priority);
    }

    const orderBy = filters.sortBy === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';
    const limit = filters.limit ? `LIMIT ${parseInt(filters.limit)}` : '';
    const offset = filters.offset ? `OFFSET ${parseInt(filters.offset)}` : '';

    const result = await query(`
      SELECT ci.*, b.business_name
      FROM customer_inquiries ci
      LEFT JOIN businesses b ON ci.business_id = b.id
      ${whereClause}
      ${orderBy}
      ${limit}
      ${offset}
    `, params);

    return result.rows.map(row => new CustomerInquiry(this.mapDbRowWithBusiness(row)));
  }

  static async findById(id) {
    const result = await query(`
      SELECT ci.*, b.business_name
      FROM customer_inquiries ci
      LEFT JOIN businesses b ON ci.business_id = b.id
      WHERE ci.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new CustomerInquiry(this.mapDbRowWithBusiness(result.rows[0]));
  }

  static async getStats(businessId, dateRange = 30) {
    const result = await query(`
      SELECT 
        COUNT(*) as total_inquiries,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_inquiries,
        COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_inquiries,
        COUNT(CASE WHEN responded_at IS NOT NULL THEN 1 END) as total_responded,
        AVG(CASE 
          WHEN responded_at IS NOT NULL 
          THEN EXTRACT(EPOCH FROM (responded_at - created_at))/3600 
        END) as avg_response_time_hours
      FROM customer_inquiries 
      WHERE business_id = $1 
      AND created_at >= NOW() - INTERVAL '${dateRange} days'
    `, [businessId]);

    const stats = result.rows[0];
    return {
      totalInquiries: parseInt(stats.total_inquiries) || 0,
      newInquiries: parseInt(stats.new_inquiries) || 0,
      respondedInquiries: parseInt(stats.responded_inquiries) || 0,
      responseRate: stats.total_inquiries > 0 
        ? ((stats.total_responded / stats.total_inquiries) * 100).toFixed(2)
        : 0,
      avgResponseTimeHours: stats.avg_response_time_hours 
        ? parseFloat(stats.avg_response_time_hours).toFixed(1)
        : 0
    };
  }

  async markAsRead() {
    if (this.status === 'new') {
      await query(`
        UPDATE customer_inquiries 
        SET status = 'read', updated_at = NOW()
        WHERE id = $1
      `, [this.id]);
      
      this.status = 'read';
    }
  }

  async respond(responseMessage) {
    await query(`
      UPDATE customer_inquiries 
      SET status = 'responded', response_message = $1, responded_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `, [responseMessage, this.id]);

    this.status = 'responded';
    this.responseMessage = responseMessage;
    this.respondedAt = new Date();

    // Update business response rate
    await this.updateBusinessResponseRate();
  }

  async updateStatus(newStatus) {
    await query(`
      UPDATE customer_inquiries 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
    `, [newStatus, this.id]);

    this.status = newStatus;
  }

  async updatePriority(newPriority) {
    await query(`
      UPDATE customer_inquiries 
      SET priority = $1, updated_at = NOW()
      WHERE id = $2
    `, [newPriority, this.id]);

    this.priority = newPriority;
  }

  async updateBusinessResponseRate() {
    const stats = await CustomerInquiry.getStats(this.businessId);
    
    await query(`
      UPDATE businesses 
      SET response_rate = $1, average_response_time = $2
      WHERE id = $3
    `, [
      parseFloat(stats.responseRate),
      parseFloat(stats.avgResponseTimeHours) * 60, // Convert to minutes
      this.businessId
    ]);
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      businessId: row.business_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      subject: row.subject,
      message: row.message,
      inquiryType: row.inquiry_type,
      status: row.status,
      priority: row.priority,
      source: row.source,
      respondedAt: row.responded_at,
      responseMessage: row.response_message,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  static mapDbRowWithBusiness(row) {
    const inquiry = this.mapDbRow(row);
    if (row.business_name) {
      inquiry.businessName = row.business_name;
    }
    return inquiry;
  }
}

module.exports = CustomerInquiry;
