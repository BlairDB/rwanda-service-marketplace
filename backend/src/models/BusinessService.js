const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class BusinessService {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(serviceData) {
    const {
      businessId,
      serviceName,
      serviceDescription,
      priceRange,
      duration,
      isFeatured = false,
      displayOrder = 0
    } = serviceData;

    const id = uuidv4();

    const result = await query(`
      INSERT INTO business_services (
        id, business_id, service_name, service_description, 
        price_range, duration, is_featured, display_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      id, businessId, serviceName, serviceDescription,
      priceRange, duration, isFeatured, displayOrder
    ]);

    return new BusinessService(this.mapDbRow(result.rows[0]));
  }

  static async findByBusinessId(businessId) {
    const result = await query(`
      SELECT * FROM business_services 
      WHERE business_id = $1 AND is_active = true
      ORDER BY display_order ASC, created_at ASC
    `, [businessId]);

    return result.rows.map(row => new BusinessService(this.mapDbRow(row)));
  }

  static async findById(id) {
    const result = await query(`
      SELECT * FROM business_services 
      WHERE id = $1 AND is_active = true
    `, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return new BusinessService(this.mapDbRow(result.rows[0]));
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
      UPDATE business_services 
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
      UPDATE business_services 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  getDbFieldName(jsField) {
    const fieldMap = {
      serviceName: 'service_name',
      serviceDescription: 'service_description',
      priceRange: 'price_range',
      isFeatured: 'is_featured',
      isActive: 'is_active',
      displayOrder: 'display_order'
    };
    return fieldMap[jsField] || jsField;
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      businessId: row.business_id,
      serviceName: row.service_name,
      serviceDescription: row.service_description,
      priceRange: row.price_range,
      duration: row.duration,
      isFeatured: row.is_featured,
      isActive: row.is_active,
      displayOrder: row.display_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = BusinessService;
