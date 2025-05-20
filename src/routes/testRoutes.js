import express from 'express';
import { ApiError } from '../middlewares/errorHandler.js';

const router = express.Router();

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

  // For 500 error, throw an actual exception
  if (errorType === '500') {
    throw new Error('This is a test 500 error');
  }

  // For other errors, use our custom ApiError
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

  if (!email || !email.includes('@')) {
    errors.push('Invalid email format');
  }

  if (!age || age < 18) {
    errors.push('Age must be 18 or older');
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

export default router; 