/**
 * Factory function to create error handlers
 * @param {string} userMessage - Message to show to the user
 * @param {boolean} isDev - Whether we're in development mode
 * @returns {Function} Express error handler middleware
 */
export const createErrorHandler = (userMessage = 'An unexpected error occurred', isDev = process.env.NODE_ENV === 'development') => {
  return (err, req, res, next) => {
    // Log the error for debugging
    console.error('\x1b[31m%s\x1b[0m', 'Error:', err.message);
    if (isDev) {
      // print stack trace in grey
      console.error('\x1b[90m%s\x1b[0m', err.stack);
    }

    // Handle MongoDB errors
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: {
          status: 400,
          message: 'Invalid ID format',
          type: 'ValidationError'
        }
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: {
          status: 400,
          message: err.message,
          type: 'ValidationError'
        }
      });
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(409).json({
        error: {
          status: 409,
          message: 'Duplicate key error',
          type: 'DuplicateError'
        }
      });
    }

    // Handle our custom API errors
    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: {
          status: err.status,
          message: err.message,
          type: err.name
        }
      });
    }

    // Default error (500)
    res.status(500).json({
      error: {
        status: 500,
        message: userMessage,
        type: 'InternalError'
      }
    });
  };
};

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
 * Not found middleware
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
}; 