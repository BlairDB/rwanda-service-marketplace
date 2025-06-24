-- Rwanda Service Marketplace - Performance Optimizations for 20K+ Businesses
-- Execute these optimizations to prepare for scale

-- ============================================================================
-- ADVANCED INDEXING STRATEGY
-- ============================================================================

-- 1. Full-text search optimization for businesses
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_search_vector 
ON businesses USING gin(to_tsvector('english', business_name || ' ' || COALESCE(description_en, '')));

-- 2. Composite index for filtered business searches
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_location_category_status 
ON businesses(location_id, category_id, status, is_active) 
WHERE status = 'approved' AND is_active = true;

-- 3. Featured businesses optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_featured_active 
ON businesses(is_featured, featured_until, created_at) 
WHERE status = 'approved' AND is_active = true;

-- 4. Business owner lookup optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_owner_status 
ON businesses(owner_id, status, is_active);

-- 5. Customer inquiries optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_inquiries_business_status_date 
ON customer_inquiries(business_id, status, created_at DESC);

-- 6. Customer inquiries by customer
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customer_inquiries_customer_date 
ON customer_inquiries(customer_email, created_at DESC);

-- 7. Reviews optimization for business profiles
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_business_rating_date 
ON reviews(business_id, rating, created_at DESC) 
WHERE status = 'approved';

-- 8. Business analytics aggregation optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_business_analytics_aggregation 
ON business_analytics(business_id, date, event_type);

-- 9. Business analytics time-series optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_business_analytics_date_business 
ON business_analytics(date DESC, business_id, event_type);

-- 10. Business services search optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_business_services_search 
ON business_services USING gin(to_tsvector('english', service_name_en || ' ' || COALESCE(description_en, '')))
WHERE is_active = true;

-- 11. Business images optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_business_images_business_type_order 
ON business_images(business_id, image_type, display_order) 
WHERE is_active = true;

-- 12. Business operating hours optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_business_operating_hours_business_day 
ON business_operating_hours(business_id, day_of_week);

-- 13. Email logs optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_logs_recipient_date 
ON email_logs(recipient, sent_at DESC);

-- 14. Email logs status optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_email_logs_status_date 
ON email_logs(status, sent_at DESC);

-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================================================

-- 1. Business summary view with aggregated data
CREATE MATERIALIZED VIEW IF NOT EXISTS business_summary AS
SELECT 
    b.id,
    b.business_name,
    b.slug,
    b.description_en,
    b.category_id,
    c.name_en as category_name,
    b.location_id,
    l.name_en as location_name,
    b.is_verified,
    b.is_featured,
    b.status,
    b.created_at,
    COALESCE(r.avg_rating, 0) as average_rating,
    COALESCE(r.review_count, 0) as review_count,
    COALESCE(i.inquiry_count, 0) as inquiry_count,
    COALESCE(v.view_count, 0) as total_views
FROM businesses b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN locations l ON b.location_id = l.id
LEFT JOIN (
    SELECT 
        business_id,
        AVG(rating) as avg_rating,
        COUNT(*) as review_count
    FROM reviews 
    WHERE status = 'approved'
    GROUP BY business_id
) r ON b.id = r.business_id
LEFT JOIN (
    SELECT 
        business_id,
        COUNT(*) as inquiry_count
    FROM customer_inquiries
    GROUP BY business_id
) i ON b.id = i.business_id
LEFT JOIN (
    SELECT 
        business_id,
        SUM(CASE WHEN event_type = 'profile_view' THEN 1 ELSE 0 END) as view_count
    FROM business_analytics
    GROUP BY business_id
) v ON b.id = v.business_id
WHERE b.status = 'approved' AND b.is_active = true;

-- Index for the materialized view
CREATE INDEX IF NOT EXISTS idx_business_summary_category_location 
ON business_summary(category_id, location_id, average_rating DESC);

CREATE INDEX IF NOT EXISTS idx_business_summary_featured_rating 
ON business_summary(is_featured, average_rating DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_summary_search 
ON business_summary USING gin(to_tsvector('english', business_name || ' ' || COALESCE(description_en, '')));

-- 2. Daily analytics summary
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_analytics_summary AS
SELECT 
    business_id,
    date,
    SUM(CASE WHEN event_type = 'profile_view' THEN 1 ELSE 0 END) as profile_views,
    SUM(CASE WHEN event_type = 'contact_click' THEN 1 ELSE 0 END) as contact_clicks,
    SUM(CASE WHEN event_type = 'phone_click' THEN 1 ELSE 0 END) as phone_clicks,
    SUM(CASE WHEN event_type = 'website_click' THEN 1 ELSE 0 END) as website_clicks,
    SUM(CASE WHEN event_type = 'search_appearance' THEN 1 ELSE 0 END) as search_appearances
FROM business_analytics
GROUP BY business_id, date;

-- Index for daily analytics
CREATE INDEX IF NOT EXISTS idx_daily_analytics_business_date 
ON daily_analytics_summary(business_id, date DESC);

-- ============================================================================
-- FUNCTIONS FOR AUTOMATIC MATERIALIZED VIEW REFRESH
-- ============================================================================

-- Function to refresh business summary
CREATE OR REPLACE FUNCTION refresh_business_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY business_summary;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh daily analytics
CREATE OR REPLACE FUNCTION refresh_daily_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_analytics_summary;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTITIONING FOR LARGE TABLES
-- ============================================================================

-- Partition business_analytics by month for better performance
-- Note: This requires recreating the table, so implement during low-traffic periods

-- Example partitioning strategy (implement when needed):
/*
-- Create partitioned table
CREATE TABLE business_analytics_partitioned (
    LIKE business_analytics INCLUDING ALL
) PARTITION BY RANGE (date);

-- Create monthly partitions
CREATE TABLE business_analytics_2024_01 PARTITION OF business_analytics_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE business_analytics_2024_02 PARTITION OF business_analytics_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Continue for each month...
*/

-- ============================================================================
-- QUERY OPTIMIZATION FUNCTIONS
-- ============================================================================

-- Function for optimized business search
CREATE OR REPLACE FUNCTION search_businesses(
    search_term TEXT DEFAULT NULL,
    category_filter UUID DEFAULT NULL,
    location_filter UUID DEFAULT NULL,
    min_rating DECIMAL DEFAULT NULL,
    is_verified_filter BOOLEAN DEFAULT NULL,
    is_featured_filter BOOLEAN DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    business_name VARCHAR,
    slug VARCHAR,
    description_en TEXT,
    category_name VARCHAR,
    location_name VARCHAR,
    average_rating DECIMAL,
    review_count BIGINT,
    is_verified BOOLEAN,
    is_featured BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bs.id,
        bs.business_name,
        bs.slug,
        bs.description_en,
        bs.category_name,
        bs.location_name,
        bs.average_rating,
        bs.review_count,
        bs.is_verified,
        bs.is_featured
    FROM business_summary bs
    WHERE 
        (search_term IS NULL OR to_tsvector('english', bs.business_name || ' ' || COALESCE(bs.description_en, '')) @@ plainto_tsquery('english', search_term))
        AND (category_filter IS NULL OR bs.category_id = category_filter)
        AND (location_filter IS NULL OR bs.location_id = location_filter)
        AND (min_rating IS NULL OR bs.average_rating >= min_rating)
        AND (is_verified_filter IS NULL OR bs.is_verified = is_verified_filter)
        AND (is_featured_filter IS NULL OR bs.is_featured = is_featured_filter)
    ORDER BY 
        bs.is_featured DESC,
        bs.average_rating DESC,
        bs.review_count DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERFORMANCE MONITORING VIEWS
-- ============================================================================

-- View to monitor slow queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE mean_time > 100  -- Queries taking more than 100ms on average
ORDER BY mean_time DESC;

-- View to monitor table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- View to monitor index usage
CREATE OR REPLACE VIEW index_usage AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- ============================================================================
-- MAINTENANCE PROCEDURES
-- ============================================================================

-- Procedure to update table statistics
CREATE OR REPLACE FUNCTION update_table_statistics()
RETURNS void AS $$
BEGIN
    ANALYZE businesses;
    ANALYZE customer_inquiries;
    ANALYZE reviews;
    ANALYZE business_analytics;
    ANALYZE business_services;
    ANALYZE business_images;
END;
$$ LANGUAGE plpgsql;

-- Procedure to clean up old analytics data (keep last 2 years)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
    DELETE FROM business_analytics 
    WHERE date < CURRENT_DATE - INTERVAL '2 years';
    
    DELETE FROM email_logs 
    WHERE sent_at < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- EXECUTION NOTES
-- ============================================================================

-- 1. Run these optimizations during low-traffic periods
-- 2. Monitor query performance before and after
-- 3. Refresh materialized views daily using cron job:
--    SELECT refresh_business_summary();
--    SELECT refresh_daily_analytics();
-- 4. Update statistics weekly:
--    SELECT update_table_statistics();
-- 5. Clean up old data monthly:
--    SELECT cleanup_old_analytics();

-- ============================================================================
-- PERFORMANCE VALIDATION QUERIES
-- ============================================================================

-- Test business search performance
-- EXPLAIN ANALYZE SELECT * FROM search_businesses('construction', NULL, NULL, 4.0, NULL, NULL, 20, 0);

-- Test business summary query performance  
-- EXPLAIN ANALYZE SELECT * FROM business_summary WHERE category_id = 'some-uuid' ORDER BY average_rating DESC LIMIT 20;

-- Monitor index usage
-- SELECT * FROM index_usage WHERE tablename = 'businesses';

-- Check table sizes
-- SELECT * FROM table_sizes;
