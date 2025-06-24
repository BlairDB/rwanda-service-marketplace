const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class BusinessImage {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(imageData) {
    const {
      businessId,
      imageUrl,
      imageType = 'gallery',
      altText,
      displayOrder = 0
    } = imageData;

    const id = uuidv4();

    const result = await query(`
      INSERT INTO business_images (
        id, business_id, image_url, image_type, alt_text, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      id, businessId, imageUrl, imageType, altText, displayOrder
    ]);

    return new BusinessImage(this.mapDbRow(result.rows[0]));
  }

  static async findByBusinessId(businessId, imageType = null) {
    let whereClause = 'WHERE business_id = $1 AND is_active = true';
    const params = [businessId];

    if (imageType) {
      whereClause += ' AND image_type = $2';
      params.push(imageType);
    }

    const result = await query(`
      SELECT * FROM business_images 
      ${whereClause}
      ORDER BY display_order ASC, uploaded_at ASC
    `, params);

    return result.rows.map(row => new BusinessImage(this.mapDbRow(row)));
  }

  static async findLogo(businessId) {
    const result = await query(`
      SELECT * FROM business_images 
      WHERE business_id = $1 AND image_type = 'logo' AND is_active = true
      ORDER BY uploaded_at DESC
      LIMIT 1
    `, [businessId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new BusinessImage(this.mapDbRow(result.rows[0]));
  }

  static async findCoverImage(businessId) {
    const result = await query(`
      SELECT * FROM business_images 
      WHERE business_id = $1 AND image_type = 'cover' AND is_active = true
      ORDER BY uploaded_at DESC
      LIMIT 1
    `, [businessId]);

    if (result.rows.length === 0) {
      return null;
    }

    return new BusinessImage(this.mapDbRow(result.rows[0]));
  }

  static async findGallery(businessId, limit = 10) {
    const result = await query(`
      SELECT * FROM business_images 
      WHERE business_id = $1 AND image_type = 'gallery' AND is_active = true
      ORDER BY display_order ASC, uploaded_at DESC
      LIMIT $2
    `, [businessId, limit]);

    return result.rows.map(row => new BusinessImage(this.mapDbRow(row)));
  }

  async update(updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

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
    values.push(new Date());
    paramCount++;
    values.push(this.id);

    const result = await query(`
      UPDATE business_images 
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
      UPDATE business_images 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  async reorder(newOrder) {
    await query(`
      UPDATE business_images 
      SET display_order = $1, updated_at = NOW()
      WHERE id = $2
    `, [newOrder, this.id]);
    
    this.displayOrder = newOrder;
  }

  getDbFieldName(jsField) {
    const fieldMap = {
      imageUrl: 'image_url',
      imageType: 'image_type',
      altText: 'alt_text',
      displayOrder: 'display_order',
      isActive: 'is_active',
      uploadedAt: 'uploaded_at'
    };
    return fieldMap[jsField] || jsField;
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      businessId: row.business_id,
      imageUrl: row.image_url,
      imageType: row.image_type,
      altText: row.alt_text,
      displayOrder: row.display_order,
      isActive: row.is_active,
      uploadedAt: row.uploaded_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = BusinessImage;
