#!/bin/bash

# Rwanda Service Marketplace - FREE Deployment Script
# Deploy your app for $0/month using free tiers

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
    echo -e "${PURPLE}🆓 FREE DEPLOYMENT OPTIONS${NC}"
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

echo "🇷🇼 Welcome to Rwanda Service Marketplace FREE Deployment!"
echo
echo "Choose your FREE deployment option:"
echo
echo "1. 🚂 Railway (Recommended)"
echo "   ✅ All-in-one solution"
echo "   ✅ PostgreSQL + Redis included"
echo "   ✅ $5 free credit monthly"
echo "   ✅ Custom domains"
echo
echo "2. ▲ Vercel + Supabase"
echo "   ✅ Best for static sites"
echo "   ✅ Global CDN"
echo "   ✅ Serverless functions"
echo "   ✅ Real-time database"
echo
echo "3. 🎨 Render"
echo "   ✅ Simple deployment"
echo "   ✅ Free static hosting"
echo "   ✅ $7/month for backend"
echo
echo "4. ☁️  Oracle Cloud Always Free"
echo "   ✅ 4 ARM CPUs, 24GB RAM"
echo "   ✅ No time limits"
echo "   ✅ Full VPS control"
echo
echo "5. 🔧 Local development setup"
echo "   ✅ Test everything locally"
echo "   ✅ No external dependencies"
echo

read -p "Enter your choice (1-5): " choice

case $choice in
  1)
    echo
    print_status "🚂 Setting up Railway deployment..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    print_status "Logging into Railway..."
    railway login
    
    print_status "Initializing Railway project..."
    railway init
    
    print_status "Adding PostgreSQL database..."
    railway add postgresql
    
    print_status "Adding Redis cache..."
    railway add redis
    
    print_status "Setting environment variables..."
    railway variables set NODE_ENV=production
    railway variables set JWT_SECRET=$(openssl rand -base64 32)
    railway variables set CORS_ORIGIN=https://$(railway status --json | jq -r '.deployments[0].url')
    railway variables set FROM_EMAIL=noreply@servicerw.rw
    
    print_status "Deploying application..."
    railway up
    
    print_success "🎉 Railway deployment completed!"
    print_status "Your app will be available at: https://$(railway status --json | jq -r '.deployments[0].url')"
    ;;
    
  2)
    echo
    print_status "▲ Setting up Vercel + Supabase deployment..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    print_status "Deploying frontend to Vercel..."
    cd frontend
    vercel --prod
    cd ..
    
    print_status "Deploying backend to Vercel..."
    cd backend
    
    # Create vercel.json for backend
    cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
EOF
    
    vercel --prod
    cd ..
    
    print_success "✅ Vercel deployment completed!"
    print_warning "⚠️  Next steps:"
    echo "1. Go to https://supabase.com and create a free account"
    echo "2. Create a new project"
    echo "3. Copy the database URL"
    echo "4. Set DATABASE_URL in Vercel environment variables"
    echo "5. Run your database schema in Supabase SQL editor"
    ;;
    
  3)
    echo
    print_status "🎨 Setting up Render deployment..."
    
    # Create render.yaml
    cat > render.yaml << 'EOF'
services:
  - type: web
    name: servicerw-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: servicerw-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        sync: false

  - type: web
    name: servicerw-frontend
    env: static
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: servicerw-db
    databaseName: servicerw
    user: servicerw_user
    plan: free
EOF
    
    print_success "✅ Render configuration created!"
    print_warning "⚠️  Next steps:"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Render will automatically deploy using render.yaml"
    echo "4. Free tier includes 750 hours/month"
    ;;
    
  4)
    echo
    print_status "☁️  Setting up Oracle Cloud Always Free..."
    
    print_warning "⚠️  Oracle Cloud setup requires manual steps:"
    echo
    echo "1. Go to https://cloud.oracle.com"
    echo "2. Sign up for Always Free account"
    echo "3. Create VM instance with these specs:"
    echo "   - Shape: VM.Standard.A1.Flex (ARM)"
    echo "   - CPUs: 4"
    echo "   - Memory: 24GB"
    echo "   - Storage: 200GB"
    echo "4. Install Docker on the VM"
    echo "5. Clone your repository"
    echo "6. Run: ./scripts/deploy.sh"
    echo
    print_status "Creating Oracle Cloud deployment script..."
    
    cat > oracle-cloud-setup.sh << 'EOF'
#!/bin/bash
# Oracle Cloud VM setup script

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/your-username/servicerw-platform.git
cd servicerw-platform

# Deploy
./scripts/deploy.sh
EOF
    
    chmod +x oracle-cloud-setup.sh
    print_success "✅ Oracle Cloud setup script created!"
    ;;
    
  5)
    echo
    print_status "🔧 Setting up local development environment..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Starting local development environment..."
    docker-compose up -d
    
    print_status "Waiting for services to start..."
    sleep 30
    
    # Test services
    if curl -f -s http://localhost:3001/api/v1/health > /dev/null; then
        print_success "✅ Backend is running at http://localhost:3001"
    else
        print_error "❌ Backend failed to start"
    fi
    
    if curl -f -s http://localhost:3000 > /dev/null; then
        print_success "✅ Frontend is running at http://localhost:3000"
    else
        print_error "❌ Frontend failed to start"
    fi
    
    print_success "🎉 Local development environment is ready!"
    echo
    echo "🌐 Access your application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:3001/api/v1"
    echo "  Database: localhost:5432"
    echo
    echo "📚 Useful commands:"
    echo "  Stop: docker-compose down"
    echo "  Logs: docker-compose logs -f"
    echo "  Restart: docker-compose restart"
    ;;
    
  *)
    print_error "Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo
print_success "🎉 Deployment process completed!"
echo
echo "📋 Next Steps:"
echo "1. Test your application thoroughly"
echo "2. Set up custom domain (if needed)"
echo "3. Configure email notifications"
echo "4. Add your business data"
echo "5. Share with Rwanda businesses!"
echo
echo "🇷🇼 Your Rwanda Service Marketplace is ready to connect businesses!"
