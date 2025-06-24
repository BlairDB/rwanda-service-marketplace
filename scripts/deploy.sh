#!/bin/bash

# Rwanda Service Marketplace - Production Deployment Script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting Rwanda Service Marketplace Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_error ".env.production file not found. Please create it first."
    print_status "Copy .env.production.example and update with your values"
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p uploads/business-images
mkdir -p logs/nginx
mkdir -p backups
mkdir -p nginx/ssl

# Set proper permissions
chmod 755 uploads
chmod 755 logs
chmod 755 backups

print_success "Directories created successfully"

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    print_warning "SSL certificates not found in nginx/ssl/"
    print_status "You can:"
    print_status "1. Use Let's Encrypt: sudo certbot --nginx -d yourdomain.com"
    print_status "2. Use self-signed for testing: ./scripts/generate-ssl.sh"
    print_status "3. Copy your existing certificates to nginx/ssl/"
    
    read -p "Do you want to generate self-signed certificates for testing? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./scripts/generate-ssl.sh
    else
        print_error "SSL certificates are required. Exiting."
        exit 1
    fi
fi

# Load environment variables
print_status "Loading environment variables..."
set -a
source .env.production
set +a

# Validate required environment variables
required_vars=("DB_PASSWORD" "JWT_SECRET" "REDIS_PASSWORD")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_success "Environment variables validated"

# Stop existing containers if running
print_status "Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down --remove-orphans || true

# Pull latest images
print_status "Pulling latest base images..."
docker-compose -f docker-compose.prod.yml pull

# Build application images
print_status "Building application images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start database and redis first
print_status "Starting database and Redis..."
docker-compose -f docker-compose.prod.yml up -d database redis

# Wait for database to be ready
print_status "Waiting for database to be ready..."
timeout=60
counter=0
while ! docker-compose -f docker-compose.prod.yml exec -T database pg_isready -U servicerw_user -d servicerw_production; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        print_error "Database failed to start within $timeout seconds"
        exit 1
    fi
done

print_success "Database is ready"

# Run database migrations
print_status "Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:migrate || {
    print_error "Database migration failed"
    exit 1
}

print_success "Database migrations completed"

# Start all services
print_status "Starting all services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

services=("database" "redis" "backend" "frontend" "nginx")
for service in "${services[@]}"; do
    if docker-compose -f docker-compose.prod.yml ps | grep -q "${service}.*Up"; then
        print_success "$service is running"
    else
        print_error "$service failed to start"
        docker-compose -f docker-compose.prod.yml logs $service
        exit 1
    fi
done

# Test application endpoints
print_status "Testing application endpoints..."

# Test backend health
if curl -f -s http://localhost:3001/api/v1/health > /dev/null; then
    print_success "Backend API is responding"
else
    print_error "Backend API is not responding"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Test frontend
if curl -f -s http://localhost:3000 > /dev/null; then
    print_success "Frontend is responding"
else
    print_error "Frontend is not responding"
    docker-compose -f docker-compose.prod.yml logs frontend
    exit 1
fi

# Test nginx
if curl -f -s http://localhost/health > /dev/null; then
    print_success "NGINX is responding"
else
    print_error "NGINX is not responding"
    docker-compose -f docker-compose.prod.yml logs nginx
    exit 1
fi

# Display deployment summary
echo
echo "🎉 Deployment completed successfully!"
echo
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps
echo
echo "🌐 Application URLs:"
echo "  Frontend: http://localhost (or your domain)"
echo "  Backend API: http://localhost/api/v1"
echo "  Health Check: http://localhost/health"
echo
echo "📋 Next Steps:"
echo "  1. Configure your domain DNS to point to this server"
echo "  2. Set up SSL certificates with Let's Encrypt"
echo "  3. Configure monitoring and backups"
echo "  4. Test all functionality"
echo
echo "📚 Useful Commands:"
echo "  View logs: docker-compose -f docker-compose.prod.yml logs -f [service]"
echo "  Restart: docker-compose -f docker-compose.prod.yml restart [service]"
echo "  Stop: docker-compose -f docker-compose.prod.yml down"
echo "  Backup: ./scripts/backup.sh"
echo
print_success "Rwanda Service Marketplace is now running! 🇷🇼"
