# Customer Management API

A RESTful API for managing customers and their subscribers, built with Node.js, Express, and MongoDB.

## Features

- Customer management (CRUD operations)
- Subscriber management (CRUD operations)
- RESTful API design
- Swagger documentation
- MongoDB database integration
- Environment-based configuration
- Comprehensive error handling
- Test routes for development
- REST Client integration for API testing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or pnpm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cse341-project
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Running the Application

Development mode:
```bash
npm run dev
# or
pnpm dev
```

Production mode:
```bash
npm start
# or
pnpm start
```

## API Testing

The project includes REST Client files for easy API testing:

1. `tests/api-routes.rest` - Main API endpoints
2. `tests/test-routes.rest` - Test routes for error handling

To use the REST Client:
1. Install the "REST Client" extension in VS Code
2. Open any `.rest` file
3. Click "Send Request" above any request

You can configure the base URL for testing:
- Default: `http://localhost:3000`
- Production: Uncomment and modify the `@baseUrl` line in the `.rest` files
- Environment variables: Set `HOST` and `PORT` in your environment

## API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:3000/api-docs
```

## Error Handling

The API uses a standardized error response format:
```json
{
  "status": 400,
  "message": "Error message",
  "type": "error_type"
}
```

Common error types:
- 400: Bad Request - Invalid input
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Resource already exists
- 500: Internal Server Error

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── server.js       # Application entry point
tests/
├── api-routes.rest # API testing
└── test-routes.rest # Error testing
```

## API Endpoints

### Customers
- GET /api/customers - Get all customers
- GET /api/customers/:id - Get customer by ID
- POST /api/customers - Create new customer
- PUT /api/customers/:id - Update customer
- DELETE /api/customers/:id - Delete customer
- GET /api/customers/:id/subscribers - Get customer's subscribers

### Subscribers
- GET /api/subscribers - Get all subscribers
- GET /api/subscribers/:id - Get subscriber by ID
- POST /api/subscribers - Create new subscriber
- PUT /api/subscribers/:id - Update subscriber
- DELETE /api/subscribers/:id - Delete subscriber

### Test Routes (Development Only)
- GET /api/test/error?type={code} - Test error handling
- POST /api/test/validation - Test input validation
- GET /api/test/async - Test async error handling

## Development

### Test Routes
Test routes are only available in development mode (`NODE_ENV=development`). They help test:
- Error handling
- Input validation
- Async operations
- HTTP status codes

### Environment Variables
- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)
- `HOST`: API host (for testing)

## License

MIT 