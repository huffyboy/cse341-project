import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseUrl = process.env.URL || `http://localhost:${process.env.PORT || 3000}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Customer Management API',
      version: '1.0.0',
      description: 'API documentation for Customer and Subscriber management',
      contact: {
        name: 'API Support',
        email: 'huf13011@byui.com'
      }
    },
    servers: [
      {
        url: baseUrl,
        description: isDevelopment ? 'Development server' : 'Production server',
      },
    ],
    tags: [
      {
        name: 'Customers',
        description: 'Customer management endpoints',
      },
      {
        name: 'Subscribers',
        description: 'Subscriber management endpoints',
      },
      // Only include Test tag in development
      ...(isDevelopment ? [{
        name: 'Test',
        description: 'Test endpoints (development only)',
      }] : []),
    ],
    components: {
      schemas: {
        Customer: {
          type: 'object',
          required: ['username', 'password', 'org_name', 'org_handle'],
          properties: {
            username: {
              type: 'string',
              description: 'Unique username for the customer',
              minLength: 3,
              pattern: '^[a-zA-Z0-9_-]+$',
              example: 'riceballfriend',
              description: 'Username must be at least 3 characters long and can only contain letters, numbers, underscores, and hyphens'
            },
            password: {
              type: 'string',
              description: 'Customer password',
              minLength: 6,
              example: 'securepass123',
              description: 'Password must be at least 6 characters long'
            },
            org_name: {
              type: 'string',
              description: 'Organization name',
              minLength: 2,
              maxLength: 100,
              example: 'Riceball Friends',
              description: 'Organization name must be between 2 and 100 characters'
            },
            org_handle: {
              type: 'string',
              description: 'Unique organization handle used in text messages',
              minLength: 2,
              maxLength: 30,
              pattern: '^[a-zA-Z0-9_-]+$',
              example: 'riceball-friends',
              description: 'Organization handle must be between 2 and 30 characters, can only contain letters, numbers, underscores, and hyphens, and cannot have consecutive underscores or hyphens'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email address (optional)',
              example: 'contact@riceball.com'
            },
            marketing_consent: {
              type: 'boolean',
              default: false,
              description: 'Marketing consent status (defaults to false)',
              example: false
            },
            phone: {
              type: 'string',
              description: 'Customer phone number (optional)',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              example: '+1234567890',
              description: 'Phone number must be in international format (e.g., +1234567890)'
            },
            timezone: {
              type: 'string',
              description: 'Customer timezone',
              default: 'America/New_York',
              enum: [
                'America/New_York',
                'America/Chicago',
                'America/Denver',
                'America/Los_Angeles',
                'America/Anchorage',
                'Pacific/Honolulu',
                'America/Phoenix'
              ],
              example: 'America/New_York',
              description: 'Timezone must be one of the supported US timezones (defaults to America/New_York)'
            },
            account_phone_number: {
              type: 'string',
              description: 'Premium account phone number for sending texts (optional)',
              pattern: '^\\+?[1-9]\\d{1,14}$',
              example: '+1987654321',
              description: 'Account phone number must be in international format and different from the main phone number'
            }
          },
          example: {
            username: 'riceballfriend',
            password: 'securepass123',
            org_name: 'Riceball Friends',
            org_handle: 'riceball-friends',
            email: 'contact@riceball.com',
            marketing_consent: false,
            phone: '+1234567890',
            timezone: 'America/New_York',
            account_phone_number: '+1987654321'
          }
        },
        Subscriber: {
          type: 'object',
          required: ['customer'],
          properties: {
            customer: {
              type: 'string',
              description: 'Reference to the customer ID'
            },
            phone: {
              type: 'string',
              description: 'Subscriber phone number'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                status: {
                  type: 'integer',
                  description: 'HTTP status code'
                },
                message: {
                  type: 'string',
                  description: 'Error message'
                },
                type: {
                  type: 'string',
                  description: 'Error type'
                },
                stack: {
                  type: 'string',
                  description: 'Error stack trace (development only)'
                }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        Conflict: {
          description: 'Conflict',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/customers.js',
    './src/routes/subscribers.js',
    // Only include test routes in development
    ...(isDevelopment ? ['./src/routes/testRoutes.js'] : []),
  ],
};

export const specs = swaggerJsdoc(options); 