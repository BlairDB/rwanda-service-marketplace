const bcrypt = require('bcryptjs');
const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(userData) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'customer'
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await query(`
      INSERT INTO users (
        email, password_hash, first_name, last_name, phone, user_type,
        email_verified, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      email, hashedPassword, firstName, lastName, phone, role,
      false, true
    ]);

    return new User(this.mapDbRow(result.rows[0]));
  }

  static async findOne(conditions) {
    const { email, isActive } = conditions;
    let whereClause = 'WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (email) {
      paramCount++;
      whereClause += ` AND u.email = $${paramCount}`;
      params.push(email);
    }

    if (isActive !== undefined) {
      paramCount++;
      whereClause += ` AND u.is_active = $${paramCount}`;
      params.push(isActive);
    }

    const result = await query(`
      SELECT u.*, b.business_name, b.slug as business_slug,
             b.description_en as business_description,
             b.address_en as business_address, b.website_url as business_website
      FROM users u
      LEFT JOIN businesses b ON u.id = b.owner_id
      ${whereClause}
      LIMIT 1
    `, params);

    if (result.rows.length === 0) {
      return null;
    }

    const userData = this.mapDbRow(result.rows[0]);
    if (result.rows[0].business_name) {
      userData.business = {
        businessName: result.rows[0].business_name,
        slug: result.rows[0].business_slug,
        description: result.rows[0].business_description,
        address: result.rows[0].business_address,
        website: result.rows[0].business_website
      };
    }

    return new User(userData);
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      email: row.email,
      password: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.user_type,
      isVerified: row.email_verified,
      isActive: row.is_active,
      profilePicture: row.profile_image_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  async save() {
    await query(`
      UPDATE users
      SET updated_at = NOW()
      WHERE id = $1
    `, [this.id]);
  }

  toJSON() {
    const data = { ...this };
    delete data.password;
    return data;
  }
}

module.exports = User;
