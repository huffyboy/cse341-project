import express from 'express';
import { ApiError, createErrorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Counter to track which error we're on
let errorCounter = 0;

// Create error handler with custom message for test routes
const handleTestErrors = createErrorHandler('Something went wrong in the test endpoint');

/**
 * @swagger
 * /api/test/error:
 *   get:
 *     summary: Test endpoint for error handling
 *     tags: [Test]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [400, 401, 403, 404, 409, 500]
 *         description: Type of error to test
 *     responses:
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/error', (req, res, next) => {
  const errorType = req.query.type || '500';
  const errorMessages = {
    '400': 'Bad Request - Invalid input',
    '401': 'Unauthorized - Authentication required',
    '403': 'Forbidden - Insufficient permissions',
    '404': 'Not Found - Resource not found',
    '409': 'Conflict - Resource already exists',
    '500': 'Internal Server Error - Something went wrong'
  };

  // Array of different error types to trigger
  const runtimeErrors = [
    { name: 'GenericError', trigger: () => { throw new Error('This is a test 500 error'); } },
    { name: 'ReferenceError', trigger: () => { console.log(undefinedVariable); } },
    { name: 'MethodNotFoundError', trigger: () => { const obj = {}; obj.nonExistentMethod(); } },
    { name: 'SyntaxError', trigger: () => { JSON.parse('invalid json'); } },
    { name: 'RangeError', trigger: () => { throw new RangeError('Number too large'); } },
    { name: 'TypeError', trigger: () => { throw new TypeError('Invalid type operation'); } },
    { name: 'EvalError', trigger: () => { throw new EvalError('Invalid eval'); } }
  ];

  // If type is 500, choose error based on counter or random if we've gone through all
  if (errorType === '500') {
    let selectedError;
    if (errorCounter < runtimeErrors.length) {
      // Cycle through errors in order
      selectedError = runtimeErrors[errorCounter];
      errorCounter++;
      console.error('\x1b[33m%s\x1b[0m', `Triggering error ${errorCounter}/${runtimeErrors.length}: ${selectedError.name}`);
    } else {
      // After cycling through all, switch to random
      selectedError = runtimeErrors[Math.floor(Math.random() * runtimeErrors.length)];
      console.error('\x1b[33m%s\x1b[0m', `Triggering random error: ${selectedError.name}`);
    }
    selectedError.trigger();
  }

  // For other errors or if runtime error wasn't chosen, use our custom ApiError
  // Print API error in blue
  console.error('\x1b[34m%s\x1b[0m', `Triggering API error: ${errorType}`);
  next(new ApiError(parseInt(errorType), errorMessages[errorType]));
});

/**
 * @swagger
 * /api/test/validation:
 *   post:
 *     summary: Test endpoint for validation errors
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               age:
 *                 type: integer
 *                 minimum: 18
 *     responses:
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       200:
 *         description: Success
 */
router.post('/validation', (req, res, next) => {
  const { email, age } = req.body;
  const errors = [];

  // Email validation (matching Customer model style)
  if (email) {
    if (typeof email !== 'string') {
      errors.push('Email must be a string');
    } else {
      // Trim and lowercase like Mongoose does
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail.includes('@')) {
        errors.push('Invalid email format');
      }
    }
  }

  // Age validation (matching Mongoose style)
  if (age) {
    if (typeof age !== 'number') {
      errors.push('Age must be a number');
    } else if (age < 18) {
      errors.push('Age must be 18 or older');
    }
  }

  if (errors.length > 0) {
    next(new ApiError(400, errors.join(', ')));
    return;
  }

  res.json({ message: 'Validation successful', data: req.body });
});

/**
 * @swagger
 * /api/test/async:
 *   get:
 *     summary: Test endpoint for async error handling
 *     tags: [Test]
 *     responses:
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/async', async (req, res, next) => {
  try {
    // Simulate an async operation that fails
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Async operation failed'));
      }, 1000);
    });
  } catch (error) {
    next(error);
  }
});

// Add error handler at the end of the routes
router.use(handleTestErrors);

export default router; 