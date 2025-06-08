import Subscriber from '../models/subscriber.js';

/**
 * Get all subscribers with optional filtering
 */
export const getAllSubscribers = async (filters = {}) => {
  return Subscriber.find(filters).populate('customer', 'org_name');
};

/**
 * Get a subscriber by ID
 */
export const getSubscriberById = async (id) => {
  return Subscriber.findById(id).populate('customer', 'org_name');
};

/**
 * Get subscribers by customer ID
 */
export const getSubscribersByCustomer = async (customerId) => {
  try {
    return await Subscriber.find({ customer: customerId })
      .sort({ created_at: -1 });
  } catch (error) {
    console.error('Error getting subscribers:', error);
    throw error;
  }
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
export const updateSubscriber = async (id, customerId, updateData) => {
  try {
    return await Subscriber.findOneAndUpdate(
      { _id: id, customer: customerId },
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw error;
  }
};

/**
 * Delete a subscriber
 */
export const deleteSubscriber = async (id) => {
  return Subscriber.findByIdAndDelete(id);
};

export const getSubscriberCount = async (customerId) => {
  try {
    return await Subscriber.countDocuments({ customer: customerId });
  } catch (error) {
    console.error('Error getting subscriber count:', error);
    throw error;
  }
};

export const addSubscriber = async (subscriberData) => {
  try {
    const subscriber = new Subscriber(subscriberData);
    return await subscriber.save();
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
};

export const removeSubscriber = async (id, customerId) => {
  try {
    return await Subscriber.findOneAndDelete({ _id: id, customer: customerId });
  } catch (error) {
    console.error('Error removing subscriber:', error);
    throw error;
  }
}; 