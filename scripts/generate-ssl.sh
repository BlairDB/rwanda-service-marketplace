#!/bin/bash

# Generate self-signed SSL certificates for testing
# For production, use Let's Encrypt instead

echo "🔐 Generating self-signed SSL certificates for testing..."

# Create SSL directory if it doesn't exist
mkdir -p nginx/ssl

# Generate private key
openssl genrsa -out nginx/ssl/key.pem 2048

# Generate certificate signing request
openssl req -new -key nginx/ssl/key.pem -out nginx/ssl/cert.csr -subj "/C=RW/ST=Kigali/L=Kigali/O=ServiceRW/OU=IT/CN=servicerw.rw/emailAddress=admin@servicerw.rw"

# Generate self-signed certificate
openssl x509 -req -days 365 -in nginx/ssl/cert.csr -signkey nginx/ssl/key.pem -out nginx/ssl/cert.pem

# Clean up CSR file
rm nginx/ssl/cert.csr

# Set proper permissions
chmod 600 nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem

echo "✅ Self-signed SSL certificates generated successfully!"
echo "⚠️  Note: These are for testing only. Use Let's Encrypt for production:"
echo "   sudo certbot --nginx -d yourdomain.com"
