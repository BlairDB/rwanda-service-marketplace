const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Business {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(businessData) {
    const {
      userId,
      businessName,
      category,
      description,
      location,
      address,
      website,
      email,
      phone
    } = businessData;

    const id = uuidv4();
    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const now = new Date();

    const result = await query(`
      INSERT INTO businesses (
        id, user_id, business_name, slug, description, category, location,
        address, phone, email, website, is_verified, is_active, rating,
        review_count, view_count, contact_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      id, userId, businessName, slug, description, category, location,
      address, phone, email, website, false, true, 0.00, 0, 0, 0, now, now
    ]);

    return new Business(this.mapDbRow(result.rows[0]));
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      userId: row.user_id,
      businessName: row.business_name,
      slug: row.slug,
      description: row.description,
      category: row.category,
      location: row.location,
      address: row.address,
      phone: row.phone,
      email: row.email,
      website: row.website,
      logo: row.logo,
      coverImage: row.cover_image,
      isVerified: row.is_verified,
      isActive: row.is_active,
      isFeatured: row.is_featured,
      rating: parseFloat(row.rating) || 0,
      reviewCount: row.review_count || 0,
      viewCount: row.view_count || 0,
      contactCount: row.contact_count || 0,
      services: row.services || [],
      businessHours: row.business_hours || {},
      socialMedia: row.social_media || {},
      founded: row.founded,
      employeeCount: row.employee_count,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async incrementViewCount() {
    this.viewCount += 1;
    await query(`
      UPDATE businesses
      SET view_count = view_count + 1, updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  async incrementContactCount() {
    this.contactCount += 1;
    await query(`
      UPDATE businesses
      SET contact_count = contact_count + 1, updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  async updateRating(newRating, reviewCount) {
    this.rating = newRating;
    this.reviewCount = reviewCount;
    await query(`
      UPDATE businesses
      SET rating = $1, review_count = $2, updated_at = NOW()
      WHERE id = $3
    `, [newRating, reviewCount, this.id]);
  }

  static async findById(id) {
    const result = await query(`
      SELECT b.*, u.first_name, u.last_name, u.email as owner_email, u.phone as owner_phone,
             c.name_en as category_name, l.name_en as location_name
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.id = $1 AND b.status = 'approved'
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Business(this.mapDbRowWithRelations(result.rows[0]));
  }

  static async findBySlug(category, slug) {
    const result = await query(`
      SELECT b.*, u.first_name, u.last_name, u.email as owner_email, u.phone as owner_phone,
             c.name_en as category_name, c.slug as category_slug, l.name_en as location_name
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.slug = $1 AND c.slug = $2 AND b.status = 'approved'
    `, [slug, category]);

    if (result.rows.length === 0) {
      return null;
    }

    return new Business(this.mapDbRowWithRelations(result.rows[0]));
  }

  static async findByOwnerId(ownerId) {
    const result = await query(`
      SELECT b.*, c.name_en as category_name, l.name_en as location_name
      FROM businesses b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.owner_id = $1
      ORDER BY b.created_at DESC
    `, [ownerId]);

    return result.rows.map(row => new Business(this.mapDbRowWithRelations(row)));
  }

  static async findAll(filters = {}) {
    let whereClause = "WHERE b.status = 'approved'";
    const params = [];
    let paramCount = 0;

    if (filters.category) {
      paramCount++;
      whereClause += ` AND c.slug = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.location) {
      paramCount++;
      whereClause += ` AND l.name_en ILIKE $${paramCount}`;
      params.push(`%${filters.location}%`);
    }

    if (filters.search) {
      paramCount++;
      whereClause += ` AND (b.business_name ILIKE $${paramCount} OR b.description_en ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    if (filters.verified !== undefined) {
      paramCount++;
      whereClause += ` AND b.is_verified = $${paramCount}`;
      params.push(filters.verified);
    }

    const orderBy = filters.sortBy === 'rating' ? 'ORDER BY b.rating DESC, b.created_at DESC' : 'ORDER BY b.created_at DESC';
    const limit = filters.limit ? `LIMIT ${parseInt(filters.limit)}` : '';
    const offset = filters.offset ? `OFFSET ${parseInt(filters.offset)}` : '';

    const result = await query(`
      SELECT b.*, u.first_name, u.last_name,
             c.name_en as category_name, c.slug as category_slug,
             l.name_en as location_name
      FROM businesses b
      LEFT JOIN users u ON b.owner_id = u.id
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN locations l ON b.location_id = l.id
      ${whereClause}
      ${orderBy}
      ${limit}
      ${offset}
    `, params);

    return result.rows.map(row => new Business(this.mapDbRowWithRelations(row)));
  }

  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    // Build dynamic update query
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        paramCount++;
        const dbField = this.getDbFieldName(key);
        fields.push(`${dbField} = $${paramCount}`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      return this;
    }

    paramCount++;
    values.push(new Date()); // updated_at
    paramCount++;
    values.push(this.id);

    const result = await query(`
      UPDATE businesses
      SET ${fields.join(', ')}, updated_at = $${paramCount - 1}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length > 0) {
      Object.assign(this, this.constructor.mapDbRow(result.rows[0]));
    }

    return this;
  }

  async delete() {
    await query(`
      UPDATE businesses
      SET status = 'deleted', updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  getDbFieldName(jsField) {
    const fieldMap = {
      businessName: 'business_name',
      categoryId: 'category_id',
      locationId: 'location_id',
      descriptionEn: 'description_en',
      addressEn: 'address_en',
      phonePrimary: 'phone_primary',
      websiteUrl: 'website_url',
      isVerified: 'is_verified',
      isFeatured: 'is_featured'
    };
    return fieldMap[jsField] || jsField;
  }

  static mapDbRowWithRelations(row) {
    const business = this.mapDbRow(row);

    if (row.category_name) {
      business.category = {
        name: row.category_name,
        slug: row.category_slug
      };
    }

    if (row.location_name) {
      business.location = {
        name: row.location_name
      };
    }

    if (row.first_name) {
      business.owner = {
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.owner_email,
        phone: row.owner_phone
      };
    }

    return business;
  }
}

module.exports = Business;
