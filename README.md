# CRM Backend API

A clean, modular Node.js Express application built with TypeScript and Prisma ORM for PostgreSQL with complete authentication system.

## 🧹 Database Reset & Seeding (Repeatable at any time)

Use these commands to safely rebuild your database schema and seed ample sample data, even if existing data is present.

1) Generate Prisma Client (safe to run anytime)
```bash
npm run prisma:generate
```

2) Apply migrations (create or update schema)
```bash
npm run prisma:migrate
```

3) Reset content and seed ample sample data (users, leads, work items, tasks, communications)
- Option A (recommended): one-shot Prisma reset with seed
```bash
npm run db:reset
```
- Option B: run our seed script directly (idempotent; will soft-reset content tables first)
```bash
npm run seed
```

Notes:
- `db:reset` uses `prisma migrate reset --force --skip-generate` to rebuild from migrations.
- The seed script is idempotent and generates rich sample data using `@faker-js/faker` (Admin user `admin@system.com` / `admin123`, multiple users, 50+ leads/customers, work items, tasks, and communications).
- If you encounter locked Prisma files on Windows (EPERM), stop the API process and retry `npm run prisma:generate`.

## 🏗️ Architecture

This backend follows a clean, modular architecture with clear separation of concerns:

```
app-api/
├── src/
│   ├── prisma/          # Prisma client setup and configuration
│   │   └── client.ts    # Database connection and client management
│   ├── routes/          # API route definitions
│   │   ├── index.ts     # Main router combining all routes
│   │   ├── auth.ts      # Authentication routes (signup/login)
│   │   ├── health.ts    # Health check endpoints
│   │   ├── users.ts     # User management routes (protected)
│   │   ├── leads.ts     # Lead management routes (protected)
│   │   └── customers.ts # Customer management routes (protected)
│   ├── controllers/     # Route controllers with business logic
│   │   ├── authController.ts      # Authentication logic
│   │   ├── healthController.ts    # Health check logic
│   │   ├── userController.ts      # User CRUD operations
│   │   ├── leadController.ts      # Lead CRUD operations
│   │   └── customerController.ts  # Customer CRUD operations
│   ├── middleware/      # Custom middleware functions
│   │   ├── index.ts     # Middleware exports
│   │   ├── errorHandler.ts       # Error handling middleware
│   │   ├── validation.ts         # Input validation middleware
│   │   └── auth.ts      # JWT authentication/authorization
│   ├── utils/           # Utility functions and helpers
│   │   ├── index.ts     # Utility exports
│   │   ├── logger.ts    # Winston logging configuration
│   │   ├── validation.ts         # Validation helper functions
│   │   ├── response.ts  # Standardized API response helpers
│   │   └── seedData.ts  # Database seeding utilities
│   ├── scripts/         # Utility scripts
│   │   └── seed.ts      # Database seeding script
│   ├── app.ts           # Express application setup and configuration
│   └── server.ts        # Server entry point and startup
├── prisma/
│   └── schema.prisma    # Database schema with snake_case tables
├── logs/                # Application log files (auto-created)
├── dist/                # Compiled JavaScript output
└── environment-config.txt # Environment variables template
```

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Authentication**: Complete JWT-based auth with signup/login
- **Password Security**: bcrypt hashing with 12 salt rounds
- **Role-Based Access**: Flexible role system with ADMIN, SALES, MANAGER, USER
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Express.js**: Modern Express setup with middleware
- **Winston Logging**: Comprehensive logging with file and console output
- **Error Handling**: Centralized error handling with proper status codes
- **Validation**: Input validation middleware and utilities
- **Security**: Helmet for security headers, CORS configuration
- **Development**: Hot reload with ts-node-dev
- **Snake_case Schema**: Database tables use snake_case naming
- **Meta Tables**: Flexible role and status management
- **Audit Trail**: Complete tracking of who created/updated records

## 📋 Prerequisites

- Node.js (>=18.0.0)
- npm or yarn
- PostgreSQL database

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd app-api
npm install
```

### 2. Environment Configuration

Create a `.env` file from the template:

```bash
cp environment-config.txt .env
```

Update your `.env` file with actual values:

```env
# Database Configuration - Required
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Logging Configuration
LOG_LEVEL=info

# JWT Configuration - Required for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d
```

### 3. Database Setup

Generate Prisma client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

Seed the database with initial roles and statuses:
```bash
npm run seed
```

### 4. Create Logs Directory

```bash
mkdir logs
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## 🔐 Authentication

### JWT Token Format
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **ADMIN**: Full system access, can manage users, leads, and customers
- **SALES**: Can manage leads and customers
- **MANAGER**: Can manage leads and customers with team oversight
- **USER**: Basic access with limited permissions

## 📡 API Endpoints

### Authentication (Public)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role_id": "role_admin"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Auth Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": {
        "id": "role_admin",
        "name": "ADMIN"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Health Check (Public)
- `GET /health` - Basic health check
- `GET /api/health` - Detailed health check with database status
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Users (Protected)
- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/:id` - Get user by ID (own profile or ADMIN)
- `POST /api/users` - Create new user (ADMIN only)
- `PUT /api/users/:id` - Update user (own profile or ADMIN)
- `DELETE /api/users/:id` - Delete user (ADMIN only)

### Leads (Protected - Requires Authentication)
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/status/:statusId` - Get leads by status

### Customers (Protected - Requires Authentication)
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

## 🗄️ Database Schema

### Meta Tables
- **roles**: `id`, `name`, `description`, `is_active`, `created_at`, `updated_at`
- **lead_status**: `id`, `name`, `description`, `is_active`, `created_at`, `updated_at`

### Main Tables
- **users**: `id`, `email`, `name`, `password_hash`, `role_id`, `created_at`, `updated_at`
- **leads**: Contact fields, `status_id`, `assigned_to`, `created_by`, `updated_by`, timestamps
- **customers**: Contact fields, `assigned_to`, `created_by`, `updated_by`, timestamps

All transactional tables include audit trail fields: `created_at`, `created_by`, `updated_at`, `updated_by`

### Default Roles (Created by Seed)
- **ADMIN**: System administrator with full access
- **SALES**: Sales representative with access to leads and customers
- **MANAGER**: Sales manager with team oversight capabilities
- **USER**: Basic user with limited access

### Default Lead Statuses (Created by Seed)
- **NEW**: New lead that has not been contacted
- **CONTACTED**: Lead has been contacted
- **QUALIFIED**: Lead has been qualified as potential customer
- **PROPOSAL**: Proposal has been sent to lead
- **WON**: Lead has been converted to customer
- **LOST**: Lead was not converted

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload using ts-node-dev
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run seed` - Seed database with initial roles and statuses

## 🔧 Development

### Getting Started with Authentication

1. **Seed the database** to create initial roles:
   ```bash
   npm run seed
   ```

2. **Create an admin user** using signup:
   ```bash
   curl -X POST http://localhost:3001/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin User",
       "email": "admin@example.com", 
       "password": "securepassword",
       "role_id": "role_admin"
     }'
   ```

3. **Login and get JWT token**:
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "securepassword"
     }'
   ```

4. **Use token for protected endpoints**:
   ```bash
   curl -X GET http://localhost:3001/api/users \
     -H "Authorization: Bearer <your-jwt-token>"
   ```

### Adding New Endpoints

1. **Create Route**: Add route definition in `src/routes/`
2. **Create Controller**: Add controller logic in `src/controllers/`
3. **Add Authentication**: Use `requireAuth` or `requireRole()` middleware
4. **Add Validation**: Create validation middleware if needed
5. **Update Router**: Import and mount new routes in `src/routes/index.ts`

### Middleware Usage

```typescript
import { requireAuth, requireRole, requireAnyRole } from '../middleware/auth';

// Require authentication only
router.use(requireAuth);

// Require specific role
router.get('/admin-only', requireRole('ADMIN'), controller.adminFunction);

// Require any of multiple roles
router.get('/sales-managers', requireAnyRole(['SALES', 'MANAGER']), controller.function);
```

### Error Handling

All controllers use the `asyncHandler` wrapper for automatic error catching:

```typescript
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export const myController = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const currentUser = req.user!; // User info from JWT
  // Your logic here
});
```

### Logging

Use the logger utility throughout the application:

```typescript
import { logger } from '../utils/logger';

logger.info('Information message');
logger.error('Error message', { error });
logger.debug('Debug message');
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Granular permission system
- **Input Validation**: Request validation middleware
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Error Sanitization**: Production vs development error details
- **Audit Trails**: Complete user action tracking

## 📊 Monitoring

- **Health Checks**: Multiple health check endpoints for monitoring
- **Logging**: Comprehensive logging with Winston
- **Database Monitoring**: Built-in database connectivity checks
- **Authentication Logs**: Complete user action logging

## 🚀 Production Deployment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   - `NODE_ENV=production`
   - `DATABASE_URL` with production database
   - `JWT_SECRET` with strong secret (minimum 32 characters)
   - Other required environment variables

3. **Run database setup**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

4. **Build and start**:
   ```bash
   npm run build
   npm start
   ```

## 📚 Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **ts-node-dev** - Development hot reload

This backend provides a complete, production-ready authentication system with role-based access control, comprehensive error handling, and security best practices for a scalable CRM system. 