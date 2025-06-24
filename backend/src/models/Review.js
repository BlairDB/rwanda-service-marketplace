const { query } = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Review {
  constructor(data) {
    Object.assign(this, data);
  }

  static async create(reviewData) {
    const {
      userId,
      businessId,
      rating,
      title,
      comment
    } = reviewData;

    const id = uuidv4();
    const now = new Date();

    const result = await query(`
      INSERT INTO reviews (
        id, user_id, business_id, rating, title, comment,
        is_verified, is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      id, userId, businessId, rating, title, comment,
      false, true, now, now
    ]);

    return new Review(this.mapDbRow(result.rows[0]));
  }

  static mapDbRow(row) {
    return {
      id: row.id,
      userId: row.user_id,
      businessId: row.business_id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      isVerified: row.is_verified,
      isActive: row.is_active,
      businessResponse: row.business_response,
      businessResponseAt: row.business_response_at,
      photos: row.photos || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = Review;
