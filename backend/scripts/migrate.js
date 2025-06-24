const { query, connectDB } = require('../src/database/connection');

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');

    // Test database connection
    await connectDB();
    console.log('✅ Database connection established successfully.');

    // Enable UUID extension
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'business', 'admin')),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        email_verified_at TIMESTAMP,
        profile_picture VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Users table created/updated');

    // Create businesses table
    await query(`
      CREATE TABLE IF NOT EXISTS businesses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL CHECK (category IN (
          'construction', 'real-estate', 'maintenance-repair', 'legal-financial',
          'design-architecture', 'moving-logistics', 'technology-proptech',
          'education-training', 'cleaning-services', 'security-services',
          'material-suppliers', 'government-services'
        )),
        location VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        website VARCHAR(500),
        logo VARCHAR(500),
        cover_image VARCHAR(500),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 0.00,
        review_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        contact_count INTEGER DEFAULT 0,
        services JSONB DEFAULT '[]',
        business_hours JSONB DEFAULT '{}',
        social_media JSONB DEFAULT '{}',
        founded INTEGER,
        employee_count VARCHAR(50),
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ Businesses table created/updated');

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        business_response TEXT,
        business_response_at TIMESTAMP,
        photos JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, business_id)
      )
    `);
    console.log('✅ Reviews table created/updated');

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
      CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location);
      CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC);
      CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
    `);
    console.log('✅ Database indexes created');

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;
