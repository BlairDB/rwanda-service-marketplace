const { query, connectDB } = require('../src/database/connection');
const { User, Business, Review } = require('../src/models');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Test database connection
    await connectDB();

    // Clear existing data (optional - remove in production)
    await query('DELETE FROM reviews');
    await query('DELETE FROM businesses');
    await query('DELETE FROM users');
    
    // Create demo users
    console.log('👥 Creating demo users...');
    
    const adminUser = await User.create({
      email: 'admin@servicerw.rw',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      phone: '+250 788 000 001',
      role: 'admin',
      isVerified: true,
      emailVerifiedAt: new Date()
    });
    
    const businessUser = await User.create({
      email: 'business@servicerw.rw',
      password: 'business123',
      firstName: 'Business',
      lastName: 'Owner',
      phone: '+250 788 000 002',
      role: 'business',
      isVerified: true,
      emailVerifiedAt: new Date()
    });
    
    const customerUser = await User.create({
      email: 'customer@servicerw.rw',
      password: 'customer123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+250 788 000 003',
      role: 'customer',
      isVerified: true,
      emailVerifiedAt: new Date()
    });
    
    // Create additional business users
    const businessUser2 = await User.create({
      email: 'elite@servicerw.rw',
      password: 'elite123',
      firstName: 'Elite',
      lastName: 'Design',
      phone: '+250 788 000 004',
      role: 'business',
      isVerified: true,
      emailVerifiedAt: new Date()
    });
    
    const businessUser3 = await User.create({
      email: 'gasabo@servicerw.rw',
      password: 'gasabo123',
      firstName: 'Gasabo',
      lastName: 'Maintenance',
      phone: '+250 788 000 005',
      role: 'business',
      isVerified: false
    });
    
    console.log('🏢 Creating demo businesses...');
    
    // Create demo businesses
    const business1 = await Business.create({
      userId: businessUser.id,
      businessName: 'Kigali Construction Ltd',
      category: 'construction',
      description: 'Leading construction company specializing in residential and commercial buildings across Rwanda. We have over 15 years of experience in delivering high-quality construction projects.',
      location: 'Kigali City',
      address: 'KG 123 Street, Gasabo District, Kigali',
      phone: '+250 788 123 456',
      email: 'info@kigaliconstruction.rw',
      website: 'www.kigaliconstruction.rw',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.8,
      reviewCount: 24,
      viewCount: 156,
      contactCount: 23,
      services: [
        'Residential Construction',
        'Commercial Buildings',
        'Renovation & Remodeling',
        'Infrastructure Development',
        'Project Management',
        'Architectural Design'
      ],
      founded: 2008,
      employeeCount: '50-100'
    });
    
    const business2 = await Business.create({
      userId: businessUser2.id,
      businessName: 'Elite Interior Design',
      category: 'design-architecture',
      description: 'Modern interior design solutions for homes and offices with Rwandan cultural elements.',
      location: 'Kigali City',
      address: 'KG 789 Road, Kicukiro District, Kigali',
      phone: '+250 788 345 678',
      email: 'hello@elitedesign.rw',
      website: 'www.elitedesign.rw',
      isVerified: true,
      verifiedAt: new Date(),
      rating: 4.9,
      reviewCount: 31,
      viewCount: 89,
      contactCount: 15,
      services: [
        'Interior Design',
        'Space Planning',
        'Furniture Selection',
        'Color Consultation',
        'Lighting Design',
        'Project Management'
      ],
      founded: 2018,
      employeeCount: '15-30'
    });
    
    const business3 = await Business.create({
      userId: businessUser3.id,
      businessName: 'Gasabo Maintenance Services',
      category: 'maintenance-repair',
      description: 'Comprehensive maintenance and repair services for residential and commercial properties.',
      location: 'Gasabo District',
      address: 'KG 321 Street, Gasabo District, Kigali',
      phone: '+250 788 456 789',
      email: 'service@gasabomaintenance.rw',
      website: 'www.gasabomaintenance.rw',
      isVerified: false,
      rating: 4.5,
      reviewCount: 12,
      viewCount: 45,
      contactCount: 8,
      services: [
        'Plumbing Services',
        'Electrical Repairs',
        'HVAC Maintenance',
        'General Repairs',
        'Emergency Services',
        'Preventive Maintenance'
      ],
      founded: 2020,
      employeeCount: '5-15'
    });
    
    console.log('⭐ Creating demo reviews...');
    
    // Create demo reviews
    await Review.create({
      userId: customerUser.id,
      businessId: business1.id,
      rating: 5,
      title: 'Excellent Construction Work',
      comment: 'Kigali Construction Ltd did an amazing job on our new home. Professional, timely, and high quality work. Highly recommended!',
      isVerified: true
    });
    
    await Review.create({
      userId: customerUser.id,
      businessId: business2.id,
      rating: 5,
      title: 'Beautiful Interior Design',
      comment: 'Elite Interior Design transformed our office space beautifully. They perfectly blended modern design with Rwandan cultural elements.',
      isVerified: true
    });
    
    await Review.create({
      userId: adminUser.id,
      businessId: business1.id,
      rating: 4,
      title: 'Good Service',
      comment: 'Professional service and good communication throughout the project.',
      isVerified: true
    });
    
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
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = seed;
