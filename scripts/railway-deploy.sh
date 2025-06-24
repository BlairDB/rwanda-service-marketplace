#!/bin/bash

# Rwanda Service Marketplace - Railway Deployment Script
# Deploy your app for FREE using Railway

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🚂 RAILWAY DEPLOYMENT${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header

echo "🇷🇼 Welcome to Rwanda Service Marketplace Railway Deployment!"
echo
echo "This script will deploy your marketplace to Railway for FREE!"
echo "✅ $5 free credit monthly (enough for 500+ hours)"
echo "✅ PostgreSQL database included"
echo "✅ Redis cache included"
echo "✅ Custom domains supported"
echo "✅ Automatic deployments from GitHub"
echo

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    print_status "Installing Railway CLI..."
    npm install -g @railway/cli
    
    if ! command -v railway &> /dev/null; then
        print_error "Failed to install Railway CLI. Please install manually:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
    
    print_success "Railway CLI installed successfully!"
else
    print_success "Railway CLI is already installed"
fi

# Check if user is logged in
print_status "Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    print_status "Please log in to Railway..."
    railway login
    
    if ! railway whoami &> /dev/null; then
        print_error "Failed to authenticate with Railway"
        exit 1
    fi
    
    print_success "Successfully authenticated with Railway!"
else
    print_success "Already authenticated with Railway"
fi

# Initialize Railway project
print_status "Initializing Railway project..."
railway init

# Add PostgreSQL database
print_status "Adding PostgreSQL database..."
railway add postgresql

print_success "PostgreSQL database added!"

# Add Redis cache
print_status "Adding Redis cache..."
railway add redis

print_success "Redis cache added!"

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Set environment variables
print_status "Setting environment variables..."

railway variables set NODE_ENV=production
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set CORS_ORIGIN="*"
railway variables set FROM_EMAIL="noreply@servicerw.rw"
railway variables set UPLOAD_PATH="/app/uploads"
railway variables set MAX_FILE_SIZE="5242880"
railway variables set ENABLE_EMAIL_NOTIFICATIONS="true"
railway variables set ENABLE_IMAGE_UPLOAD="true"
railway variables set ENABLE_BUSINESS_HOURS="true"
railway variables set ENABLE_REVIEW_RESPONSES="true"
railway variables set ENABLE_ADVANCED_SEARCH="true"
railway variables set LOG_LEVEL="info"
railway variables set RATE_LIMIT_WINDOW="15"
railway variables set RATE_LIMIT_MAX="1000"

print_success "Environment variables configured!"

# Create a simple database migration script for Railway
print_status "Creating database migration script..."

cat > backend/scripts/railway-migrate.js << 'EOF'
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Running database migrations...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('✅ Schema migration completed');
    }
    
    // Read and execute optimizations
    const optimizationsPath = path.join(__dirname, '../../database/performance-optimizations.sql');
    if (fs.existsSync(optimizationsPath)) {
      const optimizations = fs.readFileSync(optimizationsPath, 'utf8');
      await pool.query(optimizations);
      console.log('✅ Performance optimizations applied');
    }
    
    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
EOF

# Update backend package.json to include migration script
print_status "Updating package.json scripts..."

# Create a temporary package.json with the migration script
node -e "
const pkg = require('./backend/package.json');
pkg.scripts['railway:migrate'] = 'node scripts/railway-migrate.js';
pkg.scripts['railway:start'] = 'npm run railway:migrate && npm start';
require('fs').writeFileSync('./backend/package.json', JSON.stringify(pkg, null, 2));
"

print_success "Package.json updated with Railway scripts!"

# Deploy the application
print_status "Deploying application to Railway..."
print_warning "This may take a few minutes..."

railway up

# Wait for deployment to complete
print_status "Waiting for deployment to complete..."
sleep 30

# Get the deployment URL
RAILWAY_URL=$(railway status --json 2>/dev/null | grep -o '"url":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$RAILWAY_URL" ]; then
    print_warning "Could not automatically detect deployment URL"
    print_status "You can find your app URL in the Railway dashboard"
else
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "🌐 Your Rwanda Service Marketplace is now live at:"
    echo "   $RAILWAY_URL"
    echo
fi

# Display next steps
echo "📋 Next Steps:"
echo
echo "1. 🌐 Visit your Railway dashboard: https://railway.app/dashboard"
echo "2. 🔗 Get your app URL from the dashboard"
echo "3. 🧪 Test your application thoroughly"
echo "4. 📧 Configure email settings (optional)"
echo "5. 🏢 Add your first businesses!"
echo
echo "📚 Useful Railway Commands:"
echo "   railway logs          - View application logs"
echo "   railway variables     - Manage environment variables"
echo "   railway status        - Check deployment status"
echo "   railway open          - Open app in browser"
echo "   railway shell         - Access application shell"
echo
echo "💡 Tips:"
echo "   • Railway provides $5 free credit monthly"
echo "   • Your app will sleep after 30 minutes of inactivity"
echo "   • Upgrade to Pro ($20/month) for always-on hosting"
echo "   • Connect a custom domain in Railway dashboard"
echo
print_success "🇷🇼 Rwanda Service Marketplace is ready to serve businesses!"
echo
echo "🎉 Congratulations! Your marketplace is now live and ready to connect"
echo "    Rwanda's real estate value chain players!"
