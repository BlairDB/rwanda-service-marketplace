const { query, connectDB } = require('../src/database/connection');

async function enhanceSchema() {
  try {
    console.log('🔄 Enhancing database schema for advanced business features...');
    
    // Test database connection
    await connectDB();
    
    // Add new columns to businesses table
    console.log('📊 Adding business analytics columns...');
    await query(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS services_offered JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS social_media_links JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS monthly_views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS monthly_contacts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_inquiries INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS response_rate DECIMAL(5,2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS average_response_time INTEGER DEFAULT 0
    `);
    
    // Create business_images table for gallery management
    console.log('🖼️ Creating business images table...');
    await query(`
      CREATE TABLE IF NOT EXISTS business_images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        image_type VARCHAR(50) DEFAULT 'gallery' CHECK (image_type IN ('logo', 'cover', 'gallery')),
        alt_text VARCHAR(255),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        uploaded_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create business_services table for detailed service management
    console.log('🛠️ Creating business services table...');
    await query(`
      CREATE TABLE IF NOT EXISTS business_services (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        service_name VARCHAR(255) NOT NULL,
        service_description TEXT,
        price_range VARCHAR(100),
        duration VARCHAR(100),
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create customer_inquiries table for contact forms
    console.log('📧 Creating customer inquiries table...');
    await query(`
      CREATE TABLE IF NOT EXISTS customer_inquiries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        inquiry_type VARCHAR(50) DEFAULT 'general' CHECK (inquiry_type IN ('general', 'quote', 'service', 'complaint', 'partnership')),
        status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
        priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        source VARCHAR(50) DEFAULT 'website',
        responded_at TIMESTAMP,
        response_message TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create business_analytics table for detailed tracking
    console.log('📈 Creating business analytics table...');
    await query(`
      CREATE TABLE IF NOT EXISTS business_analytics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        page_views INTEGER DEFAULT 0,
        unique_visitors INTEGER DEFAULT 0,
        contact_clicks INTEGER DEFAULT 0,
        phone_clicks INTEGER DEFAULT 0,
        email_clicks INTEGER DEFAULT 0,
        website_clicks INTEGER DEFAULT 0,
        direction_requests INTEGER DEFAULT 0,
        search_appearances INTEGER DEFAULT 0,
        search_clicks INTEGER DEFAULT 0,
        review_views INTEGER DEFAULT 0,
        photo_views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(business_id, date)
      )
    `);
    
    // Create business_hours table for detailed operating hours
    console.log('🕐 Creating business hours table...');
    await query(`
      CREATE TABLE IF NOT EXISTS business_operating_hours (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
        is_open BOOLEAN DEFAULT TRUE,
        open_time TIME,
        close_time TIME,
        break_start_time TIME,
        break_end_time TIME,
        notes VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(business_id, day_of_week)
      )
    `);
    
    // Create indexes for better performance
    console.log('🔍 Creating performance indexes...');
    await query('CREATE INDEX IF NOT EXISTS idx_business_images_business_id ON business_images(business_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_images_type ON business_images(image_type)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_services_business_id ON business_services(business_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_services_featured ON business_services(is_featured)');
    await query('CREATE INDEX IF NOT EXISTS idx_customer_inquiries_business_id ON customer_inquiries(business_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_customer_inquiries_status ON customer_inquiries(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_customer_inquiries_created_at ON customer_inquiries(created_at)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_analytics_business_id ON business_analytics(business_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_analytics_date ON business_analytics(date)');
    await query('CREATE INDEX IF NOT EXISTS idx_business_hours_business_id ON business_operating_hours(business_id)');
    
    console.log('✅ Database schema enhanced successfully!');
    console.log('📋 New features added:');
    console.log('   - Business image management (logos, covers, galleries)');
    console.log('   - Detailed service offerings');
    console.log('   - Customer inquiry system');
    console.log('   - Business analytics tracking');
    console.log('   - Operating hours management');
    
  } catch (error) {
    console.error('❌ Schema enhancement failed:', error);
    process.exit(1);
  }
}

// Run enhancement if this file is executed directly
if (require.main === module) {
  enhanceSchema();
}

module.exports = enhanceSchema;
