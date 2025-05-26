import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: {
        status: 400,
        message: errors.array().map(err => err.msg).join(', '),
        type: 'ValidationError'
      }
    });
  }
  next();
};

// Customer validation rules
export const customerValidationRules = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('org_name')
    .trim()
    .notEmpty().withMessage('Organization name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Organization name must be between 2 and 100 characters'),
  
  body('org_handle')
    .trim()
    .notEmpty().withMessage('Organization handle is required')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Organization handle can only contain letters, numbers, underscores, and hyphens')
    .isLength({ min: 2, max: 30 }).withMessage('Organization handle must be between 2 and 30 characters')
    .custom((value) => {
      // Ensure handle is URL-safe and readable
      if (value.includes('__') || value.includes('--')) {
        throw new Error('Organization handle cannot contain consecutive underscores or hyphens');
      }
      return true;
    }),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in international format (e.g., +1234567890)'),
  
  body('timezone')
    .optional()
    .trim()
    .default('America/New_York')
    .isIn([
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Anchorage', 'Pacific/Honolulu', 'America/Phoenix'
    ]).withMessage('Invalid timezone. Must be one of: America/New_York, America/Chicago, America/Denver, America/Los_Angeles, America/Anchorage, Pacific/Honolulu, America/Phoenix'),
  
  body('account_phone_number')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Account phone number must be in international format (e.g., +1234567890)')
    .custom((value, { req }) => {
      // If account phone is provided, it must be different from the main phone
      if (value && req.body.phone && value === req.body.phone) {
        throw new Error('Account phone number must be different from the main phone number');
      }
      return true;
    }),
  
  body('marketing_consent')
    .optional()
    .isBoolean().withMessage('Marketing consent must be a boolean value')
    .default(false)
];

// Subscriber validation rules
export const subscriberValidationRules = [
  body('customer')
    .notEmpty().withMessage('Customer reference is required')
    .isMongoId().withMessage('Invalid customer ID format'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Phone number must be in international format (e.g., +1234567890)')
]; 