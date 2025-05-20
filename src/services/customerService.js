import Customer from '../models/Customer.js';

/**
 * Get all customers with optional filtering
 */
export const getAllCustomers = async (filters = {}) => {
  return Customer.find(filters);
};

/**
 * Get a customer by ID
 */
export const getCustomerById = async (id) => {
  return Customer.findById(id);
};

/**
 * Create a new customer
 */
export const createCustomer = async (customerData) => {
  const customer = new Customer(customerData);
  return customer.save();
};

/**
 * Update a customer
 */
export const updateCustomer = async (id, updateData) => {
  return Customer.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (id) => {
  return Customer.findByIdAndDelete(id);
}; 