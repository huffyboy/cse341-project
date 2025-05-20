import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import customersRouter from './routes/customers.js';
import subscribersRouter from './routes/subscribers.js';
import connectDB from './config/database.js';
import { specs } from './config/swagger.js';
import testRoutes from './routes/testRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/subscribers', subscribersRouter);

// Only include test routes in development
if (isDevelopment) {
  app.use('/api/test', testRoutes);
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
  if (isDevelopment) {
    console.log('Test routes are enabled (development mode)');
  }
});
