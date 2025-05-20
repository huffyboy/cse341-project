/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Format error response
 */
const formatError = (err) => {
  // Log the full error with stack trace for debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Return only the essential error information
  return {
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    type: err.name || 'Error'
  };
};

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Handle MongoDB errors
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: formatError({
        status: 400,
        message: 'Invalid ID format',
        name: 'ValidationError'
      })
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: formatError({
        status: 400,
        message: err.message,
        name: 'ValidationError'
      })
    });
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({
      error: formatError({
        status: 409,
        message: 'Duplicate key error',
        name: 'DuplicateError'
      })
    });
  }

  // Handle our custom API errors
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: formatError(err)
    });
  }

  // Default error (500)
  res.status(500).json({
    error: formatError(err)
  });
};

/**
 * Not found middleware
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
}; 