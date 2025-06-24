#!/bin/bash

# Rwanda Service Marketplace - Backup Script
# Usage: ./scripts/backup.sh

set -e

# Load environment variables
if [ -f ".env.production" ]; then
    set -a
    source .env.production
    set +a
fi

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "🔄 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "📊 Backing up database..."
docker-compose -f docker-compose.prod.yml exec -T database pg_dump -U servicerw_user servicerw_production > $BACKUP_DIR/db_backup_$DATE.sql

# Compress database backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads directory
echo "📁 Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz uploads/

# Backup configuration files
echo "⚙️  Backing up configuration..."
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz \
    .env.production \
    docker-compose.prod.yml \
    nginx/ \
    scripts/ \
    --exclude=nginx/ssl/key.pem

# Clean up old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Display backup summary
echo "✅ Backup completed successfully!"
echo "📊 Backup files created:"
ls -lh $BACKUP_DIR/*_$DATE.*

# Calculate total backup size
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo "💾 Total backup directory size: $TOTAL_SIZE"

echo "🎉 Backup process completed!"
