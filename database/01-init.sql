-- Initialize ServiceRW Database
-- This script runs automatically when the database container starts

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "postgis"; -- Disabled for simplified setup

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'ServiceRW Database initialized successfully';
    RAISE NOTICE 'UUID extension: %', (SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'));
    RAISE NOTICE 'PostGIS extension: %', (SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'postgis'));
END $$;
