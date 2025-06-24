const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Database error handler
const handleDatabaseError = (error) => {
  let message = 'Database operation failed';
  let statusCode = 500;
  let code = 'DATABASE_ERROR';

  // PostgreSQL specific errors
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        message = 'A record with this information already exists';
        statusCode = 409;
        code = 'DUPLICATE_ENTRY';
        break;
      case '23503': // Foreign key violation
        message = 'Referenced record does not exist';
        statusCode = 400;
        code = 'INVALID_REFERENCE';
        break;
      case '23502': // Not null violation
        message = 'Required field is missing';
        statusCode = 400;
        code = 'MISSING_REQUIRED_FIELD';
        break;
      case '42P01': // Undefined table
        message = 'Database table not found';
        statusCode = 500;
        code = 'TABLE_NOT_FOUND';
        break;
      case '42703': // Undefined column
        message = 'Database column not found';
        statusCode = 500;
        code = 'COLUMN_NOT_FOUND';
        break;
      default:
        message = 'Database operation failed';
        statusCode = 500;
        code = 'DATABASE_ERROR';
    }
  }

  return new AppError(message, statusCode, code);
};

// JWT error handler
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN');
  }
  if (error.name === 'TokenExpiredError') {
    return new AppError('Your token has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
  }
  return new AppError('Authentication failed', 401, 'AUTH_ERROR');
};

// Validation error handler
const handleValidationError = (error) => {
  if (error.details) {
    // Joi validation error
    const message = error.details.map(detail => detail.message).join('. ');
    return new AppError(message, 400, 'VALIDATION_ERROR');
  }
  
  if (error.errors) {
    // Express-validator error
    const message = error.errors.map(err => err.msg).join('. ');
    return new AppError(message, 400, 'VALIDATION_ERROR');
  }

  return new AppError('Validation failed', 400, 'VALIDATION_ERROR');
};

// Multer error handler (file upload)
const handleMulterError = (error) => {
  let message = 'File upload failed';
  let code = 'UPLOAD_ERROR';

  switch (error.code) {
    case 'LIMIT_FILE_SIZE':
      message = 'File size too large';
      code = 'FILE_TOO_LARGE';
      break;
    case 'LIMIT_FILE_COUNT':
      message = 'Too many files uploaded';
      code = 'TOO_MANY_FILES';
      break;
    case 'LIMIT_UNEXPECTED_FILE':
      message = 'Unexpected file field';
      code = 'UNEXPECTED_FILE';
      break;
    default:
      message = 'File upload failed';
      code = 'UPLOAD_ERROR';
  }

  return new AppError(message, 400, code);
};

// Send error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: {
      status: err.status,
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      stack: err.stack,
      details: err.details || null
    },
    timestamp: new Date().toISOString()
  });
};

// Send error response in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: {
        code: err.code || 'OPERATION_FAILED',
        message: err.message
      },
      timestamp: new Date().toISOString()
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('Unexpected error:', err);
    
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.'
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Main error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.logError('Error occurred:', err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Handle specific error types
  if (err.code && err.code.startsWith('23')) {
    error = handleDatabaseError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  } else if (err.isJoi || err.errors) {
    error = handleValidationError(err);
  } else if (err.code && err.code.startsWith('LIMIT_')) {
    error = handleMulterError(err);
  } else if (!err.isOperational) {
    // Convert unknown errors to operational errors
    error = new AppError('Something went wrong', 500, 'INTERNAL_ERROR');
  }

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// 404 handler
const notFound = (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(err);
};

module.exports = {
  AppError,
  errorHandler,
  catchAsync,
  notFound
};
