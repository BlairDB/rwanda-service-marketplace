const { query, connectDB } = require('../src/database/connection');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test database connection
    await connectDB();
    
    // Clear existing data
    await query('DELETE FROM reviews');
    await query('DELETE FROM businesses');
    await query('DELETE FROM users');
    
    console.log('👥 Creating demo users...');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['admin@servicerw.rw', adminPassword, 'Admin', 'User', '+250 788 000 001', 'admin', true]);
    
    // Create business user
    const businessPassword = await bcrypt.hash('business123', 12);
    const businessUserResult = await query(`
      INSERT INTO users (email, password, first_name, last_name, phone, user_type, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['business@servicerw.rw', businessPassword, 'Business', 'Owner', '+250 788 000 002', 'provider', true]);

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerResult = await query(`
      INSERT INTO users (email, password, first_name, last_name, phone, user_type, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['customer@servicerw.rw', customerPassword, 'John', 'Doe', '+250 788 000 003', 'customer', true]);
    
    console.log('🏢 Creating demo businesses...');

    // Get a category ID for construction contractors
    const categoryResult = await query(`
      SELECT id FROM categories WHERE slug = 'construction-contractors' LIMIT 1
    `);

    // Get a location ID for Gasabo
    const locationResult = await query(`
      SELECT id FROM locations WHERE name_en = 'Gasabo' LIMIT 1
    `);

    if (categoryResult.rows.length > 0 && locationResult.rows.length > 0) {
      // Create business for business user
      const businessResult = await query(`
        INSERT INTO businesses (
          owner_id, business_name, slug, description_en, category_id, location_id,
          address_en, phone_primary, email, website_url, is_verified, status,
          view_count, contact_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `, [
        businessUserResult.rows[0].id,
        'Kigali Construction Ltd',
        'kigali-construction-ltd',
        'Leading construction company specializing in residential and commercial buildings across Rwanda.',
        categoryResult.rows[0].id,
        locationResult.rows[0].id,
        'KG 123 Street, Gasabo District, Kigali',
        '+250 788 123 456',
        'info@kigaliconstruction.rw',
        'www.kigaliconstruction.rw',
        true,
        'approved',
        156,
        23
      ]);

      console.log('⭐ Creating demo reviews...');

      // Create review
      await query(`
        INSERT INTO reviews (reviewer_id, business_id, rating, title_en, comment_en, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        customerResult.rows[0].id,
        businessResult.rows[0].id,
        5,
        'Excellent Construction Work',
        'Kigali Construction Ltd did an amazing job on our new home. Professional, timely, and high quality work. Highly recommended!',
        'approved'
      ]);
    } else {
      console.log('⚠️ Skipping business creation - categories or locations not found');
    }
    

    
    console.log('✅ Database seeded successfully!');
    
    // Count records
    const userCount = await query('SELECT COUNT(*) FROM users');
    const businessCount = await query('SELECT COUNT(*) FROM businesses');
    const reviewCount = await query('SELECT COUNT(*) FROM reviews');
    
    console.log('📊 Created:');
    console.log(`   - ${userCount.rows[0].count} users`);
    console.log(`   - ${businessCount.rows[0].count} businesses`);
    console.log(`   - ${reviewCount.rows[0].count} reviews`);
    
    console.log('\n🔑 Demo Accounts:');
    console.log('   Admin: admin@servicerw.rw / admin123');
    console.log('   Business: business@servicerw.rw / business123');
    console.log('   Customer: customer@servicerw.rw / customer123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = seed;
