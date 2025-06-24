# Rwanda Service Marketplace - Production Deployment Guide

## 🎯 PRODUCTION READINESS FOR 20,000 BUSINESSES

This guide provides step-by-step instructions for deploying the Rwanda Service Marketplace to production with the capacity to handle 20,000+ businesses.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### ✅ **Infrastructure Requirements**
- [ ] **Server**: Minimum 8 CPU cores, 16GB RAM, 200GB SSD
- [ ] **Database**: PostgreSQL 14+ with 4 CPU cores, 8GB RAM, 100GB SSD
- [ ] **Redis**: 2GB RAM for caching
- [ ] **File Storage**: AWS S3 or equivalent cloud storage
- [ ] **CDN**: CloudFlare or AWS CloudFront
- [ ] **Email Service**: SendGrid or AWS SES account

### ✅ **Domain & SSL**
- [ ] Domain name registered (e.g., servicerw.rw)
- [ ] SSL certificate configured
- [ ] DNS records configured

### ✅ **Environment Variables**
- [ ] All production environment variables configured
- [ ] Database credentials secured
- [ ] API keys and secrets configured

---

## 🚀 DEPLOYMENT STEPS

### **STEP 1: Server Setup**

#### **A. Install Docker & Docker Compose**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### **B. Clone Repository**
```bash
git clone https://github.com/your-org/servicerw-platform.git
cd servicerw-platform
```

### **STEP 2: Environment Configuration**

#### **A. Create Production Environment File**
```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

#### **B. Production Environment Variables**
```env
# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://servicerw.rw

# Database (Primary)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=servicerw_production
DB_USER=servicerw_user
DB_PASSWORD=your-secure-password

# Database (Read Replica - Optional)
DB_READ_HOST=your-read-replica-host.com
DB_READ_PORT=5432

# Enhanced Connection Pool Settings
DB_POOL_MAX=50
DB_POOL_MIN=5
DB_READ_POOL_MAX=30
DB_READ_POOL_MIN=3

# Redis
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=servicerw-uploads
CLOUDFRONT_URL=https://cdn.servicerw.rw

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@servicerw.rw

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn

# Security
CORS_ORIGIN=https://servicerw.rw
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000
```

### **STEP 3: Database Setup**

#### **A. Create Production Database**
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE servicerw_production;
CREATE USER servicerw_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE servicerw_production TO servicerw_user;

-- Connect to the new database
\c servicerw_production

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Grant permissions
GRANT ALL ON SCHEMA public TO servicerw_user;
```

#### **B. Run Database Migrations**
```bash
# Run schema creation
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:migrate

# Run performance optimizations
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:optimize
```

### **STEP 4: Production Docker Configuration**

#### **A. Create Production Docker Compose**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.servicerw.rw
    restart: unless-stopped
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "3001:3001"
    env_file:
      - .env.production
    restart: unless-stopped
    depends_on:
      - redis
    volumes:
      - ./uploads:/app/uploads

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    restart: unless-stopped
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  redis_data:
```

#### **B. Create Production Dockerfiles**

**Frontend Dockerfile.prod:**
```dockerfile
# frontend/Dockerfile.prod
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Backend Dockerfile.prod:**
```dockerfile
# backend/Dockerfile.prod
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

CMD ["npm", "start"]
```

### **STEP 5: NGINX Configuration**

#### **A. Create NGINX Config**
```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    server {
        listen 80;
        server_name servicerw.rw www.servicerw.rw;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name servicerw.rw www.servicerw.rw;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # Frontend
        location / {
            limit_req zone=general burst=50 nodelay;
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /uploads/ {
            alias /app/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### **STEP 6: Deploy Application**

#### **A. Build and Start Services**
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### **B. Verify Deployment**
```bash
# Test frontend
curl -I https://servicerw.rw

# Test backend API
curl -I https://servicerw.rw/api/v1/health

# Test database connection
docker-compose -f docker-compose.prod.yml exec backend npm run db:test
```

---

## 📊 MONITORING & MAINTENANCE

### **A. Health Monitoring**
```bash
# Create monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash
echo "=== Service Status ==="
docker-compose -f docker-compose.prod.yml ps

echo "=== Database Health ==="
curl -s https://servicerw.rw/api/v1/health | jq .

echo "=== System Resources ==="
df -h
free -h
EOF

chmod +x monitor.sh
```

### **B. Backup Strategy**
```bash
# Database backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h your-db-host.com -U servicerw_user servicerw_production > $BACKUP_DIR/db_backup_$DATE.sql

# Compress and upload to S3
gzip $BACKUP_DIR/db_backup_$DATE.sql
aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql.gz s3://servicerw-backups/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Add to crontab for daily backups
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

---

## 🔧 PERFORMANCE OPTIMIZATION

### **A. Database Optimization**
```bash
# Run performance optimizations
docker-compose -f docker-compose.prod.yml exec backend psql -f /app/database/performance-optimizations.sql

# Set up materialized view refresh
echo "0 */6 * * * docker-compose -f docker-compose.prod.yml exec backend npm run db:refresh-views" | crontab -
```

### **B. Application Monitoring**
- Set up application performance monitoring (APM)
- Configure error tracking with Sentry
- Set up uptime monitoring
- Configure log aggregation

---

## 🚨 TROUBLESHOOTING

### **Common Issues:**

#### **High Database Load**
```bash
# Check slow queries
docker-compose -f docker-compose.prod.yml exec backend npm run db:slow-queries

# Optimize queries
docker-compose -f docker-compose.prod.yml exec backend npm run db:analyze
```

#### **Memory Issues**
```bash
# Check memory usage
docker stats

# Restart services if needed
docker-compose -f docker-compose.prod.yml restart
```

#### **SSL Certificate Issues**
```bash
# Renew SSL certificate
certbot renew --nginx

# Restart NGINX
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## ✅ POST-DEPLOYMENT CHECKLIST

- [ ] All services running and healthy
- [ ] Database connections working
- [ ] SSL certificate valid
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Search functionality working
- [ ] Performance monitoring active
- [ ] Backup system configured
- [ ] Error tracking configured
- [ ] Load testing completed

**🎉 Your Rwanda Service Marketplace is now ready for 20,000+ businesses!**
