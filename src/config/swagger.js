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
              description: 'Unique username for the customer'
            },
            password: {
              type: 'string',
              description: 'Customer password'
            },
            org_name: {
              type: 'string',
              description: 'Organization name'
            },
            org_handle: {
              type: 'string',
              description: 'Unique organization handle'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email address'
            },
            marketing_consent: {
              type: 'boolean',
              default: false,
              description: 'Marketing consent status'
            },
            phone: {
              type: 'string',
              description: 'Customer phone number'
            },
            timezone: {
              type: 'string',
              description: 'Customer timezone'
            },
            account_phone_number: {
              type: 'string',
              description: 'Account phone number'
            }
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