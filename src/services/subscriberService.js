import Subscriber from '../models/Subscriber.js';

/**
 * Get all subscribers with optional filtering
 */
export const getAllSubscribers = async (filters = {}) => {
  return Subscriber.find(filters).populate('customer', 'username org_name');
};

/**
 * Get a subscriber by ID
 */
export const getSubscriberById = async (id) => {
  return Subscriber.findById(id).populate('customer', 'username org_name');
};

/**
 * Get subscribers by customer ID
 */
export const getSubscribersByCustomer = async (customerId) => {
  return Subscriber.find({ customer: customerId });
};

/**
 * Create a new subscriber
 */
export const createSubscriber = async (subscriberData) => {
  const subscriber = new Subscriber(subscriberData);
  return subscriber.save();
};

/**
 * Update a subscriber
 */
export const updateSubscriber = async (id, updateData) => {
  return Subscriber.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('customer', 'username org_name');
};

/**
 * Delete a subscriber
 */
export const deleteSubscriber = async (id) => {
  return Subscriber.findByIdAndDelete(id);
}; 