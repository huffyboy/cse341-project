# SMS Scheduler

A full-stack application for scheduling SMS announcements, built with Node.js, Express, MongoDB, and OAuth2 authentication.

## Core Technologies
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Template Engine**: EJS with express-ejs-layouts
- **Authentication**: Passport.js with OAuth2 (Google & GitHub)

## Application Structure

### Public Routes
- `/` - Home page with service description and sign-in options
- `/auth/login` - Login page with OAuth options
- `/auth/logout` - Logout endpoint
- `/auth/setup` - Initial account setup for new users

### Protected Routes (Dashboard)
- `/dashboard` - Main dashboard with announcement stats and subscriber count
- `/dashboard/account` - Account management and OAuth provider settings
- `/dashboard/announcements` - List of pending announcements
- `/dashboard/announcements/create` - Create new announcement
- `/dashboard/announcements/:id` - View announcement details
- `/dashboard/announcements/:id/edit` - Edit announcement
- `/dashboard/announcements/history` - View past announcements

## Navigation Structure
- **Top Left**: Company name/logo -> Dashboard
- **Top Right**: 
  - Organization name -> Account settings
  - Logout button

## Features

### Authentication
- OAuth2 authentication with Google and GitHub
- Multiple OAuth providers per account
- Initial account setup workflow
- Session-based authentication

### Dashboard
- Overview of announcement statistics
- Total subscriber count
- Quick access to recent announcements

### Account Management
- View and edit organization details
- Manage connected OAuth providers
- Add additional OAuth providers

### Announcement Management
- Create new announcements
- Edit existing announcements
- Delete announcements
- View announcement details
- View announcement history
- Schedule announcements for future delivery

## Project Structure
```
src/
├── config/         # Configuration files
├── controllers/    # Route handlers
├── middlewares/    # Custom middleware
├── models/         # Mongoose models
├── routes/         # Express routes
├── services/       # Business logic
├── views/          # EJS templates
│   ├── auth/       # Authentication views
│   ├── dashboard/  # Dashboard views
│   └── layouts/    # Layout templates
└── server.js       # Application entry point
```

## Security
- OAuth2 secure authentication
- Session management
- Protected routes
- Input validation
- Error handling

## Development
- ES Modules
- Environment-based configuration
- Development and production modes
- Hot reloading in development

Update this file as you make changes to the code
