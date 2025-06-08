import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import passport from './config/passport.js';
import subscribersRouter from './routes/subscribers.js';
import customersRouter from './routes/customers.js';
import authRouter from './routes/auth.js';
import announcementsRouter from './routes/announcements.js';
import mainRouter from './routes/index.js';
import connectDB from './config/database.js';
import { specs } from './config/swagger.js';
import testRoutes from './routes/testRoutes.js';
import { createErrorHandler, notFound } from './middlewares/errorHandler.js';
import methodOverride from 'method-override';
import flash from 'connect-flash';
import Customer from './models/Customer.js';
import MongoStore from 'connect-mongo';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== 'production';
const baseUrl = process.env.URL || `http://localhost:${port}`;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create global error handler
const handleGlobalErrors = createErrorHandler('An unexpected error occurred', isDevelopment);

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for development
}));
app.use(morgan('dev'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: 'lax'
  }
}));

// Debug middleware for session
app.use((req, res, next) => {
  console.log('Session debug:', {
    sessionID: req.sessionID,
    hasSession: !!req.session,
    hasUser: !!req.session?.passport?.user,
    user: req.session?.passport?.user
  });
  next();
});

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware for authentication
app.use((req, res, next) => {
  console.log('Auth debug:', {
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
  });
  next();
});

// Flash middleware - must be after session and passport
app.use(flash());

// Make user and flash messages available to all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/', mainRouter);
app.use('/api/customers', customersRouter);
app.use('/api/subscribers', subscribersRouter);
app.use('/auth', authRouter);
app.use('/dashboard', announcementsRouter);

// Only include test routes in development
if (isDevelopment) {
  app.use('/api/test', testRoutes);
}

// Error handling middleware
app.use(notFound);
app.use(handleGlobalErrors);

// Start server
app.listen(port, () => {
  console.log(`Server is running at ${baseUrl}`);
  console.log(`API Documentation available at ${baseUrl}/api-docs`);
  if (isDevelopment) {
    console.log('Test routes are enabled (development mode)');
  }
});
