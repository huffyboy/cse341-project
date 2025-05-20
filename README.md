# Customer Management API

A RESTful API for managing customers and their subscribers, built with Node.js, Express, and MongoDB.

## Features

- Customer management (CRUD operations)
- Subscriber management (CRUD operations)
- RESTful API design
- Swagger documentation
- MongoDB database integration
- Environment-based configuration

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

## API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:3000/api-docs
```

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

## License

MIT 