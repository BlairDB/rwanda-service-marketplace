const { Pool } = require('pg');
const logger = require('../utils/logger');

// Enhanced database configuration for 20K+ businesses scaling
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'servicerw',
  user: process.env.DB_USER || 'servicerw_user',
  password: process.env.DB_PASSWORD || 'servicerw_password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

  // Enhanced connection pool settings for high-scale deployment
  max: process.env.DB_POOL_MAX || 50, // Increased from 20 for better concurrency
  min: process.env.DB_POOL_MIN || 5,  // Minimum connections to maintain
  idleTimeoutMillis: 30000,           // Close idle connections after 30s
  connectionTimeoutMillis: 10000,     // Increased timeout for new connections
  maxUses: 7500,                      // Rotate connections after 7500 uses

  // Performance optimizations
  application_name: 'servicerw-platform',
  statement_timeout: 30000,           // 30 second query timeout
  query_timeout: 30000,

  // Additional performance settings for production
  options: process.env.NODE_ENV === 'production' ?
    '-c default_transaction_isolation=read_committed -c timezone=UTC -c shared_preload_libraries=pg_stat_statements' :
    undefined
};

// Read replica configuration for scaling read operations
const readDbConfig = process.env.DB_READ_HOST ? {
  host: process.env.DB_READ_HOST,
  port: process.env.DB_READ_PORT || process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'servicerw',
  user: process.env.DB_USER || 'servicerw_user',
  password: process.env.DB_PASSWORD || 'servicerw_password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: process.env.DB_READ_POOL_MAX || 30,
  min: process.env.DB_READ_POOL_MIN || 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  application_name: 'servicerw-platform-read',
  statement_timeout: 30000,
  query_timeout: 30000
} : null;

// Create connection pools
const pool = new Pool(dbConfig);
const readPool = readDbConfig ? new Pool(readDbConfig) : null;

// Pool event handlers
pool.on('connect', (client) => {
  logger.debug(`New database client connected (total: ${pool.totalCount})`);
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('remove', (client) => {
  logger.debug(`Database client removed (total: ${pool.totalCount})`);
});

// Database connection function
async function connectDB() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release();
    
    logger.info('✅ Database connection established successfully');
    logger.info(`📍 Connected to: ${dbConfig.database} at ${dbConfig.host}:${dbConfig.port}`);
    logger.info(`🐘 PostgreSQL version: ${result.rows[0].pg_version.split(' ')[1]}`);
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Query function with error handling and logging (writes to master)
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries
    if (duration > 1000) {
      logger.warn(`🐌 Slow query detected (${duration}ms):`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        params: params.length > 0 ? '[PARAMS]' : 'none',
        duration: `${duration}ms`,
        pool: 'master'
      });
    }

    // Log query in debug mode
    if (process.env.LOG_LEVEL === 'debug') {
      logger.debug(`📊 Query executed (${duration}ms):`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        rowCount: result.rowCount,
        pool: 'master'
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('❌ Database query error:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      params: params.length > 0 ? '[PARAMS]' : 'none',
      error: error.message,
      duration: `${duration}ms`,
      pool: 'master'
    });
    throw error;
  }
}

// Read query function for read replicas (SELECT operations)
async function readQuery(text, params = []) {
  if (!readPool) {
    // No read replica configured, use master
    return query(text, params);
  }

  const start = Date.now();
  try {
    const result = await readPool.query(text, params);
    const duration = Date.now() - start;

    // Log slow queries
    if (duration > 1000) {
      logger.warn(`🐌 Slow read query detected (${duration}ms):`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        params: params.length > 0 ? '[PARAMS]' : 'none',
        duration: `${duration}ms`,
        pool: 'read-replica'
      });
    }

    // Log query in debug mode
    if (process.env.LOG_LEVEL === 'debug') {
      logger.debug(`📊 Read query executed (${duration}ms):`, {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        rowCount: result.rowCount,
        pool: 'read-replica'
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.warn('⚠️ Read replica query error, falling back to master:', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      params: params.length > 0 ? '[PARAMS]' : 'none',
      error: error.message,
      duration: `${duration}ms`,
      pool: 'read-replica'
    });

    // Fallback to master database
    return query(text, params);
  }
}

// Transaction helper
async function transaction(callback) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    logger.debug('🔄 Transaction started');
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    logger.debug('✅ Transaction committed');
    
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.debug('🔄 Transaction rolled back');
    throw error;
  } finally {
    client.release();
  }
}

// Get a client from the pool (for complex operations)
async function getClient() {
  return await pool.connect();
}

// Close all connections (for graceful shutdown)
async function closeDB() {
  try {
    await pool.end();
    if (readPool) {
      await readPool.end();
    }
    logger.info('🔌 Database connections closed');
  } catch (error) {
    logger.error('❌ Error closing database connections:', error);
  }
}

// Enhanced database health check
async function healthCheck() {
  const masterHealth = await checkPoolHealth(pool, 'master');
  const readHealth = readPool ? await checkPoolHealth(readPool, 'read-replica') : null;

  return {
    status: masterHealth.status === 'healthy' && (!readHealth || readHealth.status === 'healthy') ? 'healthy' : 'unhealthy',
    master: masterHealth,
    readReplica: readHealth,
    timestamp: new Date().toISOString()
  };
}

// Helper function to check individual pool health
async function checkPoolHealth(poolInstance, poolName) {
  try {
    const start = Date.now();
    const result = await poolInstance.query('SELECT 1 as health_check, NOW() as timestamp, version() as pg_version');
    const duration = Date.now() - start;

    return {
      status: 'healthy',
      responseTime: `${duration}ms`,
      totalConnections: poolInstance.totalCount,
      idleConnections: poolInstance.idleCount,
      waitingConnections: poolInstance.waitingCount,
      maxConnections: poolInstance.options.max,
      timestamp: result.rows[0].timestamp,
      version: result.rows[0].pg_version.split(' ')[1],
      poolName
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      totalConnections: poolInstance.totalCount,
      idleConnections: poolInstance.idleCount,
      waitingConnections: poolInstance.waitingCount,
      maxConnections: poolInstance.options.max,
      poolName
    };
  }
}

// Helper function to build WHERE clauses for search
function buildWhereClause(filters = {}) {
  const conditions = [];
  const params = [];
  let paramCount = 0;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      paramCount++;
      
      if (Array.isArray(value)) {
        // Handle array values (IN clause)
        const placeholders = value.map(() => `$${paramCount++}`).join(', ');
        conditions.push(`${key} IN (${placeholders})`);
        params.push(...value);
        paramCount = paramCount - value.length; // Adjust counter
      } else if (typeof value === 'string' && key.includes('search')) {
        // Handle text search
        conditions.push(`${key} ILIKE $${paramCount}`);
        params.push(`%${value}%`);
      } else {
        // Handle exact matches
        conditions.push(`${key} = $${paramCount}`);
        params.push(value);
      }
    }
  });

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
}

// Helper function for pagination
function buildPaginationClause(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return {
    limitClause: `LIMIT ${limit} OFFSET ${offset}`,
    offset,
    limit: parseInt(limit)
  };
}

module.exports = {
  pool,
  readPool,
  connectDB,
  query,
  readQuery,
  transaction,
  getClient,
  closeDB,
  healthCheck,
  buildWhereClause,
  buildPaginationClause
};
