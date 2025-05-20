import * as subscriberService from '../services/subscriberService.js';

/**
 * Get all subscribers
 */
export const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await subscriberService.getAllSubscribers();
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

/**
 * Get subscriber by ID
 */
export const getSubscriber = async (req, res, next) => {
  try {
    const subscriber = await subscriberService.getSubscriberById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json(subscriber);
  } catch (error) {
    next(error);
  }
};

/**
 * Get customer's subscribers
 */
export const getCustomerSubscribers = async (req, res, next) => {
  try {
    const subscribers = await subscriberService.getSubscribersByCustomer(req.params.id);
    res.json(subscribers);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new subscriber
 */
export const createSubscriber = async (req, res, next) => {
  try {
    const subscriber = await subscriberService.createSubscriber(req.body);
    res.status(201).json(subscriber);
  } catch (error) {
    next(error);
  }
};

/**
 * Update subscriber
 */
export const updateSubscriber = async (req, res, next) => {
  try {
    const subscriber = await subscriberService.updateSubscriber(req.params.id, req.body);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json(subscriber);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete subscriber
 */
export const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await subscriberService.deleteSubscriber(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 