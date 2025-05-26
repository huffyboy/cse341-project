import express from 'express';
import {
  getAllSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber
} from '../controllers/subscriberController.js';
import { createErrorHandler } from '../middlewares/errorHandler.js';

const router = express.Router();

// Create error handler with custom message for subscriber routes
const handleSubscriberErrors = createErrorHandler('An error occurred while processing your subscriber request');

/**
 * @swagger
 * /api/subscribers:
 *   get:
 *     summary: Get all subscribers
 *     tags: [Subscribers]
 *     responses:
 *       200:
 *         description: List of subscribers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscriber'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllSubscribers);

/**
 * @swagger
 * /api/subscribers/{id}:
 *   get:
 *     summary: Get a subscriber by ID
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscriber ID
 *     responses:
 *       200:
 *         description: Subscriber details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getSubscriber);

/**
 * @swagger
 * /api/subscribers:
 *   post:
 *     summary: Create a new subscriber
 *     tags: [Subscribers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscriber'
 *     responses:
 *       201:
 *         description: Subscriber created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', createSubscriber);

/**
 * @swagger
 * /api/subscribers/{id}:
 *   put:
 *     summary: Update a subscriber
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscriber ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscriber'
 *     responses:
 *       200:
 *         description: Subscriber updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscriber'
 *       404:
 *         description: Subscriber not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/:id', updateSubscriber);

/**
 * @swagger
 * /api/subscribers/{id}:
 *   delete:
 *     summary: Delete a subscriber
 *     tags: [Subscribers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscriber ID
 *     responses:
 *       200:
 *         description: Subscriber deleted successfully
 *       404:
 *         description: Subscriber not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteSubscriber);

// Add error handler at the end of the routes
router.use(handleSubscriberErrors);

export default router; 