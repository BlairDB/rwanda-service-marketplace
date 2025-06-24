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
      INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['business@servicerw.rw', businessPassword, 'Business', 'Owner', '+250 788 000 002', 'provider', true]);
    
    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customerResult = await query(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, ['customer@servicerw.rw', customerPassword, 'John', 'Doe', '+250 788 000 003', 'customer', true]);
    
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
